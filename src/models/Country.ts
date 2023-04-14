import CountryName from "./CountryName";
import Currency from "./Currency";

type Country = {
    name: CountryName;
    capital: string[];
    population: number;
    subregion: string;
    currencies: Currency[];
    languages: string[];
}

export default Country;