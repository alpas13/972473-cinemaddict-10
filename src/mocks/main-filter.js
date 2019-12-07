import {generateRandomInteger} from "../utils";

const FILTER_LIMITER = 20;

const FILTERS_LIST = [
  `Watchlist`,
  `History`,
  `Favorites`
];

export const generateFiltersIndicators = () => {
  return FILTERS_LIST
      .map((value) => {
        const indicator = generateRandomInteger(FILTER_LIMITER);
        return {
          name: value,
          count: indicator ? indicator : ``,
        };
      });
};
