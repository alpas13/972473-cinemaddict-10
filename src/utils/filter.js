const FilterType = {
  ALL: `All`,
  WATCHLIST: `Watchlist`,
  HISTORY: `History`,
  FAVORITES: `Favorites`,
};

const isAddToWatchList = (movies) => {
  return movies.filter((card) => card.isAddToWatchList);
};

const isWatched = (movies) => {
  return movies.filter((card) => card.isWatched);
};

const isFavorite = (movies) => {
  return movies.filter((card) => card.isFavorite);
};

const getMoviesByFilter = (movies, filter) => {
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

const getFilters = (movies) => {
  return Object.values(FilterType)
      .map((filter) => {
        return {
          name: filter,
          count: getMoviesByFilter(movies, filter).length,
        };
      });
};

export {FilterType, getMoviesByFilter, getFilters};
