import { FormEvent, useState } from "react";
import Country from "./models/Country";
import CountryProvider from "./services/CountryProvider";
import isCountry from "./utility/isCountry";

const App = ({ countryProvider }: { countryProvider: CountryProvider }) => {
  const [countries, setCountries] = useState<Array<Country | string> | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const continent = e.currentTarget.continent.value;
    const count = e.currentTarget.count.valueAsNumber;

    setIsLoading(true);

    try {
      const { countries } = await countryProvider.getCountries(continent, count);

      setCountries(countries);
    } catch (ex) {
      console.error(ex);
    }
    finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      { 
        isLoading &&
        <div className="loading position-fixed d-flex flex-column justify-content-center align-items-center">
          <div className="spinning-loader m-1"/>
          <h1 className="m-1">Loading</h1>
        </div>
      }
      <div className="container">
        <div className="row">
          <div className="col d-none d-sm-block"/>
          <div className="col p-3">
            <form onSubmit={e => handleSubmit(e)}>
              <div className="form-group mb-3">
                <label>Continent</label>
                <select className="form-control" name="continent" title="Continent" required>
                  <option value="AF">Africa</option>
                  <option value="AN">Antarctica</option>
                  <option value="AS">Asia</option>
                  <option value="EU">Europe</option>
                  <option value="NA">North America</option>
                  <option value="OC">Oceania</option>
                  <option value="SA">South America</option>
                </select>
              </div>
              <div className="form-group mb-3">
                <label>Result Count</label>
                <input className="form-control" type="number" name="count" min={2} max={10} defaultValue={2} required title="Result Count"/>
              </div>
              <div className="form-group">
                <button className="btn btn-primary w-100" type="submit">Submit</button>
              </div>
            </form>
          </div>
          <div className="col d-none d-sm-block"/>
        </div>
        <div className="row overflow-x-auto p-3">
        {
          countries !== undefined &&
          <table className="table">
            <thead>
              <tr>
                <th/>
                <th>Name</th>
                <th>Capital</th>
                <th>Population</th>
                <th>Subregion</th>
                <th>Languages</th>
                <th>Currencies</th>
              </tr>
            </thead>
            <tbody>
            {
              countries.map((country, i) => 
              {
                if (isCountry(country)) {
                  return (
                    <tr key={country.name.common}>
                      <td>{i + 1}</td>
                      <td>{country.name.common}</td>
                      <td>{country.capital.join(", ")}</td>
                      <td>{country.population}</td>
                      <td>{country.subregion}</td>
                      <td>{country.languages.join(", ")}</td>
                      <td>{country.currencies.map(e => e.name).join(", ")}</td>
                    </tr>
                  );
                }
                return (
                  <tr key={country}>
                    <td>{i + 1}</td>
                    <td>{country}</td>
                    <td colSpan={5}>No information found!</td>
                  </tr>
                );
              })
            }
            </tbody>
          </table>
        }
        </div>
      </div>
    </>
  );
}

export default App;
