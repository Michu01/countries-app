import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import Country from "../models/Country";
import getMultipleRandomElements from "../utility/getMultipleRandomElements";

export default class CountryProvider {
    private graphqlClient = new ApolloClient({
        uri: process.env.REACT_APP_GRAPHQL_API,
        cache: new InMemoryCache(),
    });
    private getCountriesQuery = gql`query GetCountries($continent: String) {
        countries(filter: { continent: { eq: $continent } }) {
            name
        }
    }`;
    
    private async getCountry(name: string): Promise<Country | string> {
        const response = await fetch(`${process.env.REACT_APP_REST_API}/name/${name}?fields=name,capital,population,currencies,subregion,languages`);

        if (!response.ok) {
            return name;
        }

        const matching = await response.json() as any[];

        if (matching.length === 0) {
            return name;
        }

        const first = matching[0];

        return {
            name: first.name,
            capital: first.capital,
            population: first.population,
            subregion: first.subregion,
            languages: Object.values(first.languages),
            currencies: Object.values(first.currencies)
        };
    }

    public async getCountries(continent: string, count: number): Promise<{ countries?: Array<Country | string> }> {
        const { data } = await this.graphqlClient.query({ query: this.getCountriesQuery, variables: { continent } });

        if (data === undefined) {
            return {};
        }

        const names = data.countries.map((country: any) => country.name);

        const randomNames = getMultipleRandomElements(names, count).sort();

        const tasks = randomNames.map(name => this.getCountry(name));

        const countries = await Promise.all(tasks);

        return { countries };
    }
}