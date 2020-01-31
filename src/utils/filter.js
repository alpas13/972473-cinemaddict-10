export const FilterType = {
  ALL: `All`,
  WATCHLIST: `Watchlist`,
  HISTORY: `History`,
  FAVORITES: `Favorites`,
};

export const isAddToWatchList = (movies) => {
  return movies.filter((card) => card.isAddToWatchList);
};

export const isWatched = (movies) => {
  return movies.filter((card) => card.isWatched);
};

export const isFavorite = (movies) => {
  return movies.filter((card) => card.isFavorite);
};

export const getMoviesByFilter = (movies, filter) => {
  switch (filter) {
    case FilterType.ALL:
      return movies;
    case FilterType.WATCHLIST:
      return isAddToWatchList(movies);
    case FilterType.HISTORY:
      return isWatched(movies);
    case FilterType.FAVORITES:
      return isFavorite(movies);
  }

  return movies;
};

export const getFilters = (movies) => {
  return Object.values(FilterType)
      .map((filter) => {
        return {
          name: filter,
          count: getMoviesByFilter(movies, filter).length,
        };
      });
};
