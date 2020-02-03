import Api from "./api/api.js";
import Provider from "./api/provider.js";
import Store from "./api/store.js";
import ProfileNameComponent from './components/profile-name.js';
import SortController from './controller/sort-controller.js';
import LoadingComponent from "./components/loading.js";
import FilmsComponent from './components/films.js';
import PageController from "./controller/page-controller.js";
import MoviesModel from "./models/movies.js";
import FilterController from "./controller/filter.js";
import StatisticComponent from "./components/statistic.js";
import {render, RenderPosition} from "./utils/render.js";

import {MenuItem} from "./components/menu.js";

const STORE_PREFIX = `cinemaddict-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;
export const AUTHORIZATION = `Basic kBwYd2o=XN9yZAzdXNlc`;
export const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict`;

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
      .then(() => {
      }).catch(() => {
      });
});

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);
const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

const moviesModel = new MoviesModel(apiWithProvider);

const profileNameComponent = new ProfileNameComponent(moviesModel);
render(siteHeaderElement, profileNameComponent, RenderPosition.BEFOREEND);

const filterController = new FilterController(siteMainElement, moviesModel);
filterController.render();

const statisticsComponent = new StatisticComponent(moviesModel);
render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);
statisticsComponent.hide();

const sortingController = new SortController(siteMainElement, moviesModel);
sortingController.render();

const loadingComponent = new LoadingComponent();
render(siteMainElement, loadingComponent, RenderPosition.BEFOREEND);

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

const pageController = new PageController(filmsComponent.getElement(), moviesModel, apiWithProvider, filterController, sortingController);

apiWithProvider.getMovies()
    .then((movies) => {
      moviesModel.setMovies(movies);
      profileNameComponent.rename();
      pageController.render();
      loadingComponent.hide();
    });

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  if (!apiWithProvider.getSynchronize()) {
    apiWithProvider.sync()
        .then(() => {
        })
        .catch(() => {
        });
  }
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
