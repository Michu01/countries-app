import { FormEvent, useState } from "react";
import Country from "./models/Country";
import CountryProvider from "./services/CountryProvider";
import isCountry from "./utility/isCountry";
import "./App.css";
import config from "./config.json";

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
          <h3 className="m-1">Loading</h3>
        </div>
      }
      <div className="container min-vh-100 d-flex flex-column justify-content-center p-3">
        <div className="row m-3 bg-white border rounded p-3">
          <div className="col-1 col-sm-2 col-md-3 col-lg-4"/>
          <div className="col-10 col-sm-8 col-md-6 col-lg-4 d-flex flex-column">
            <h2 className="align-self-center">Query Countries</h2>
            <form onSubmit={e => handleSubmit(e)}>
              <div className="form-group mb-3">
                <label>Continent</label>
                <select className="form-control" name="continent" title="Continent" required>
                  { Object.entries(config.CONTINENTS).map(continent => <option key={continent[0]} value={continent[0]}>{continent[1]}</option>) }
                </select>
              </div>
              <div className="form-group mb-3">
                <label>Result Count</label>
                <input className="form-control" type="number" name="count" min={config.MIN_COUNTRY_COUNT} max={config.MAX_COUNTRY_COUNT} defaultValue={config.DEFAULT_COUNTRY_COUNT} required title="Result Count"/>
              </div>
              <div className="form-group">
                <button className="btn btn-primary w-100" type="submit">Submit</button>
              </div>
            </form>
          </div>
          <div className="col-1 col-sm-2 col-md-3 col-lg-4"/>
        </div>
        {
          countries !== undefined &&
          <div className="row m-3 bg-white border rounded p-3 overflow-x-auto">
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
          </div>
        }
      </div>
    </>
  );
}

export default App;
