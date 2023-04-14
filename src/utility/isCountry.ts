import Country from "../models/Country";

const isCountry = (country: any): country is Country => country.name !== undefined;

export default isCountry;