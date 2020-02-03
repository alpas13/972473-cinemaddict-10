import AbstractSmartComponent from "./abstract-smart-component.js";
import {setProfileName} from "../utils/common.js";

export default class ProfileName extends AbstractSmartComponent {
  constructor(moviesModel) {
    super();

    this._movies = moviesModel;
    this._profileRating = ``;
  }

  getTemplate() {
    return (
      `<section class="header__profile profile">
       <p class="profile__rating">${this._profileRating}</p>
       <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
       </section>`
    );
  }

  rename() {
    this._profileRating = setProfileName(this._movies.getAllMovies());

    this.rerender();
  }

  recoveryListeners() {
  }
}

