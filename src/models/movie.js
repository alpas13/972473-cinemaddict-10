export default class Movie {
  constructor(data) {
    this.id = data.id;
    this.comments = data.comments;
    this.title = data.film_info.title;
    this.alternativeTitle = data.film_info.alternative_title;
    this.totalRating = data.film_info.total_rating;
    this.poster = data.film_info.poster;
    this.ageRating = data.film_info.age_rating;
    this.director = data.film_info.director;
    this.writers = data.film_info.writers;
    this.actors = data.film_info.actors;
    this.releaseDate = data.film_info.release.date;
    this.releaseCountry = data.film_info.release.release_country;
    this.runtime = data.film_info.runtime;
    this.genre = data.film_info.genre;
    this.description = data.film_info.description;
    this.personalRating = data.user_details.personal_rating;
    this.isAddToWatchList = data.user_details.watchlist;
    this.isWatched = data.user_details.already_watched;
    this.watchingDate = data.user_details.watching_date;
    this.isFavorite = data.user_details.favorite;
  }

  toRAW() {
    return {
      "id": this.id,
      "comments": this.comments,
      "film_info": {
        "title": this.title,
        "alternative_title": this.alternativeTitle,
        "total_rating": this.totalRating,
        "poster": this.poster,
        "age_rating": this.ageRating,
        "director": this.director,
        "writers": this.writers,
        "actors": this.actors,
        "release": {
          "date": this.releaseDate,
          "release_country": this.releaseCountry
        },
        "runtime": this.runtime,
        "genre": this.genre,
        "description": this.description,
      },
      "user_details": {
        "personal_rating": this.personalRating,
        "watchlist": this.isAddToWatchList,
        "already_watched": this.isWatched,
        "watching_date": this.watchingDate ? this.watchingDate : new Date(0).toISOString(),
        "favorite": this.isFavorite,
      }
    };
  }

  static parseMovie(data) {
    return new Movie(data);
  }

  static parseMovies(data) {
    return data.map(Movie.parseMovie);
  }

  static clone(data) {
    return new Movie(data.toRAW());
  }
}
