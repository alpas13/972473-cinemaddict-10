export default class Movie {
  constructor(data) {
    const {id, comments, film_info: filmInfo, user_details: userDetails} = data;
    const {
      title,
      alternative_title: alternativeTitle,
      total_rating: totalRating,
      poster,
      age_rating: ageRating,
      director,
      writers,
      actors,
      release,
      runtime,
      genre,
      description
    } = filmInfo;
    const {
      date,
      release_country: releaseCountry
    } = release;
    const {
      personal_rating: personalRating,
      watchlist,
      already_watched: alreadyWatched,
      watching_date: watchingDate,
      favorite
    } = userDetails;


    this.id = id;
    this.comments = comments;
    this.title = title;
    this.alternativeTitle = alternativeTitle;
    this.totalRating = totalRating;
    this.poster = poster;
    this.ageRating = ageRating;
    this.director = director;
    this.writers = writers;
    this.actors = actors;
    this.releaseDate = new Date(date);
    this.releaseCountry = releaseCountry;
    this.runtime = runtime;
    this.genre = genre;
    this.description = description;
    this.personalRating = personalRating;
    this.isAddToWatchList = Boolean(watchlist);
    this.isWatched = Boolean(alreadyWatched);
    this.watchingDate = watchingDate ? new Date(watchingDate) : null;
    this.isFavorite = Boolean(favorite);
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
        "watching_date": this.watchingDate,
        "favorite": this.isFavorite
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
