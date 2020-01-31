import API from "./api.js";
import ProfileComponent from './components/profile-name.js';
import FilmsComponent from './components/films.js';
import PageController from "./controller/page-controller.js";
import MoviesModel from "./models/movies.js";
import FilterController from "./controller/filter.js";
import StatisticComponent from "./components/statistic.js";
import {render, RenderPosition} from "./utils/render.js";

import {MenuItem} from "./components/menu.js";

export const AUTHORIZATION = `Basic kBwYd2o=XN9yZAzdXNlc`;
export const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict`;

const api = new API(END_POINT, AUTHORIZATION);
const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

render(siteHeaderElement, new ProfileComponent(), RenderPosition.BEFOREEND);

const moviesModel = new MoviesModel();

const filterController = new FilterController(siteMainElement, moviesModel);
filterController.render();

const statisticsComponent = new StatisticComponent(moviesModel);
render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);
statisticsComponent.hide();

filterController.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.STATISTICS:
      pageController.hide();
      statisticsComponent.show();
      statisticsComponent.setData();
      break;
    case MenuItem.ALL_MOVIES:
      statisticsComponent.hide();
      pageController.show();
      break;
  }
});

const filmsComponent = new FilmsComponent();
render(siteMainElement, filmsComponent, RenderPosition.BEFOREEND);

const pageController = new PageController(filmsComponent.getElement(), moviesModel, api, filterController);

api.getMovies()
    .then((movies) => {
      moviesModel.setMovies(movies);
      pageController.render();
    });
