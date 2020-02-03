import Movie from "../models/movie";
import Comment from "../models/comment";
import nanoid from "nanoid";

const getSyncedMovies =
    (items) => items.filter(({success}) => success).map(({payload}) => payload.movie);

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._isSynchronized = true;
  }

  getMovies() {
    if (this._isOnLine()) {
      return this._api.getMovies()
          .then((movies) => {
            movies.forEach((movie) => {
              this._store.setItem(`movie_${movie.id}`, movie.toRAW());
            });
            return movies;
          });
    }

    const moviesKeys = Object.keys(this._store.getAll()).filter((it) => {
      return !it.indexOf(`movie_`);
    });
    const storeMovies = moviesKeys.map((it) => this._store.getAll()[it]);

    this._isSynchronized = false;

    return Promise.resolve(Movie.parseMovies(storeMovies));
  }

  getComment(movieId) {
    if (this._isOnLine()) {
      return this._api.getComment(movieId)
          .then((comments) => {
            comments.forEach((comment) => comment.toRAW());
            this._store.setItem(`comments_${movieId}`, comments);
            return comments;
          });
    }

    const storeComments = this._store.getAll()[`comments_${movieId}`];

    this._isSynchronized = false;

    return Promise.resolve(Comment.parseComments(storeComments));
  }

  createComment(movieId, data) {
    if (this._isOnLine()) {
      return this._api.createComment(movieId, data);
    }

    const fakeNewCommentId = nanoid();
    const fakeNewComment = Comment.parseComment(Object.assign({}, data.toRAW(), {id: fakeNewCommentId}));

    this._isSynchronized = false;

    this._store.setItem(fakeNewComment.id, Object.assign({}, fakeNewComment.toRAW(), {offline: true}));

    return Promise.resolve(fakeNewComment);
  }

  updateMovie(movieId, data) {
    if (this._isOnLine()) {
      return this._api.updateMovie(movieId, data)
          .then((movie) => {
            this._store.setItem(movie.id, movie.toRAW());
            return movie;
          });
    }

    const fakeUpdatedMovie = Movie.parseMovie(Object.assign({}, data.toRAW(), {movieId}));

    this._isSynchronized = false;

    this._store.setItem(movieId, Object.assign({}, fakeUpdatedMovie.toRAW(), {offline: true}));

    return Promise.resolve(Movie.parseMovie(fakeUpdatedMovie));
  }

  deleteComment(id) {
    if (this._isOnLine()) {
      return this._api.deleteComment(id);
    }

    return false;
  }

  sync() {
    if (this._isOnLine()) {
      const moviesKeys = Object.keys(this._store.getAll()).filter((it) => {
        return !it.indexOf(`movie_`);
      });
      const storeMovies = moviesKeys.map((it) => this._store.getAll()[it]);

      return this._api.syncData(storeMovies)
          .then((response) => {
            storeMovies.forEach((movie) => {
              if (movie.offline) {
                this._store.removeItem(movie.id);
              }
            });

            const updatedMovie = getSyncedMovies(response.updated);
            [...updatedMovie].forEach((movie) => {
              this._store.setItem(movie.id, movie);
            });

            this._isSynchronized = true;

            return Promise.resolve();
          });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  getSynchronize() {
    return this._isSynchronized;
  }

  _isOnLine() {
    return window.navigator.onLine;
  }
}
