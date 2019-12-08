import {generateRandomInteger} from "../utils";

const FILTER_LIMITER = 20;

const filtersList = [
  `Watchlist`,
  `History`,
  `Favorites`
];

export const generateFiltersIndicators = () => {
  return filtersList
      .map((value) => {
        const indicator = generateRandomInteger(FILTER_LIMITER);
        return {
          name: value,
          count: indicator ? indicator : ``,
        };
      });
};
