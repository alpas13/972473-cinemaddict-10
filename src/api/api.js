import Movie from "../models/movie.js";
import Comment from "../models/comment.js";

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 || response.status < 300) {
    return response;
  }
  throw new Error(`${response.status}: ${response.statusText}`);

};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getMovies() {
    return this._load({url: `movies`})
        .then((response) => response.json())
        .then(Movie.parseMovies);
  }

  getComment(movieId) {
    return this._load({url: `comments/${movieId}`})
        .then((response) => response.json())
        .then(Comment.parseComments);
  }

  createComment(movieId, data) {
    const comment = new Comment(data);
    return this._load({url: `comments/${movieId}`,
      method: Method.POST,
      body: JSON.stringify(comment.toRAW()),
      headers: new Headers({'Content-Type': `application/json`}),
    })
        .then((response) => response.json());
  }

  updateMovie(movieId, data) {
    return this._load({url: `movies/${movieId}`,
      method: Method.PUT,
      body: JSON.stringify(data.toRAW()),
      headers: new Headers({'Content-Type': `application/json`}),
    })
        .then((response) => response.json())
        .then(Movie.parseMovie);
  }

  deleteComment(id) {
    return this._load({url: `comments/${id}`, method: Method.DELETE});
  }

  syncData(data) {
    return this._load({url: `movies/sync`,
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
        .then((response) => response.json());
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
        .then(checkStatus)
        .catch((err) => {
          throw err;
        });
  }
}
