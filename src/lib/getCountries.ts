import { countriesPT } from "@/countries/countriesPT";
import { countriesEN } from "@/countries/countriesEN";
import { countriesES } from "@/countries/countriesES";
import { Locale } from "@/i18n/i18n.config";

const countriesDict = { pt: countriesPT, en: countriesEN, es: countriesES };

export const countryOptions = countriesPT.map((value) => value.code);

export const getCountries = (lang: Locale) => {
  return countriesDict[lang];
};
