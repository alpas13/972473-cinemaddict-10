import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import AbstractSmartComponent from "./abstract-smart-component";
import {formatTime} from "../utils/common.js";
import {setProfileName} from "../utils/common.js";

export default class Statistic extends AbstractSmartComponent {
  constructor(moviesModel) {
    super();

    this._DateRange = {
      All: `all-time`,
      TODAY: `today`,
      WEEK: `week`,
      MONTH: `month`,
      YEAR: `year`
    };

    this._profileName = ``;
    this._dateFrom = null;
    this._dateTo = null;
    this._moviesModel = moviesModel;
    this._movies = [];
    this._filmsByDate = [];
    this._filmsCount = null;
    this._filmsDuration = null;
    this._topGenre = null;
    this._checkedStatus = `all-time`;
    this._genreChart = null;
  }

  getTemplate() {
    return (`<section class="statistic">
    <p class="statistic__rank">
      ${this._profileName}
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">Sci-Fighter</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${this._checkedStatus === `all-time` ? `checked` : ``}>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${this._checkedStatus === `today` ? `checked` : ``}>
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${this._checkedStatus === `week` ? `checked` : ``}>
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${this._checkedStatus === `month` ? `checked` : ``}>
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${this._checkedStatus === `year` ? `checked` : ``}>
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${this._filmsCount}<span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${Math.floor(this._filmsDuration / 60)}<span class="statistic__item-description">h</span>${formatTime(this._filmsDuration, true)}<span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${this._topGenre}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`);
  }

  recoveryListeners() {
    this._subscribeOnEvents();
    this._renderCharts();
  }

  show() {
    super.show();

    this._checkedStatus = `all-time`;
    this._dateFrom = null;
    this._dateTo = null;
  }

  setData() {
    this._movies = this._moviesModel.getAllMovies();
    this._profileName = setProfileName(this._movies);
    this._filmsByDate = this._getMoviesByDateRange(this._movies, this._dateFrom, this._dateTo);
    this._filmsCount = this._filmsByDate.length;
    this._filmsDuration = this._filmsByDate.reduce((acc, movie) => {
      return acc + movie.runtime;
    }, 0);
    this._topGenre = this._topGenreParsing(this._filmsByDate).slice(0, 1)[0].genre;
    this.rerender();
  }

  _subscribeOnEvents() {
    this.getElement().querySelector(`.statistic__filters`).addEventListener(`change`, (evt) => {
      if (evt.target.tagName === `INPUT`) {
        this._dateTo = new Date();
        this._checkedStatus = `${evt.target.value}`;
        switch (evt.target.value) {
          case this._DateRange.All:
            this._movies = this._getMoviesByDate(this._DateRange.All);
            break;
          case this._DateRange.TODAY:
            this._movies = this._getMoviesByDate(this._DateRange.TODAY);
            break;
          case this._DateRange.WEEK:
            this._movies = this._getMoviesByDate(this._DateRange.WEEK);
            break;
          case this._DateRange.MONTH:
            this._movies = this._getMoviesByDate(this._DateRange.MONTH);
            break;
          case this._DateRange.YEAR:
            this._movies = this._getMoviesByDate(this._DateRange.YEAR);
            break;
        }
        this.setData();
      }
    });
  }

  _topGenreParsing(movies) {
    const genres = movies
        .map((movie) => movie.genre)
        .join(`,`)
        .split(`,`)
        .reduce((acc, genre) => {
          acc[genre] = (acc[genre] || 0) + 1;
          return acc;
        }, {});

    let temp = [];
    for (let [key, value] of Object.entries(genres)) {
      temp.push({genre: key, value});
    }

    temp = temp.sort((a, b) => {
      if (a.genre < b.genre) {
        return -1;
      } else if (a.genre > b.genre) {
        return 1;
      } else {
        return 0;
      }
    }).sort((a, b) => b.value - a.value);

    if (temp[0].genre === ``) {
      const noNameGenre = temp[0];
      temp.shift();
      temp.push(noNameGenre);
    }

    return temp;
  }

  _getMoviesByDateRange(movies, dateFrom, dateTo) {
    if (!dateFrom) {
      return movies;
    } else {
      return movies.slice().filter((movie) => {
        return movie.watchingDate >= dateFrom && movie.watchingDate <= dateTo;
      });
    }
  }

  _getMoviesByDate(range) {
    const date = new Date();
    switch (range) {
      case this._DateRange.All:
        this._dateFrom = null;
        break;
      case this._DateRange.TODAY:
        this._dateFrom = new Date(date.setHours(0, 0, 0));
        break;
      case this._DateRange.WEEK:
        this._dateFrom = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7, 0, 0, 0);
        break;
      case this._DateRange.MONTH:
        this._dateFrom = new Date(date.getFullYear(), date.getMonth() - 1, 1, 0, 0, 0);
        break;
      case this._DateRange.YEAR:
        this._dateFrom = new Date(date.getFullYear() - 1, date.getMonth(), 1, 0, 0, 0);
        break;
    }
    return this._getMoviesByDateRange(this._movies, this._dateFrom, this._dateTo);
  }

  _renderCharts() {
    const element = this.getElement();

    const genreCtx = element.querySelector(`.statistic__chart`);

    this._resetCharts();

    this._genreChart = this._renderGenreChart(genreCtx, this._filmsByDate);
  }

  _resetCharts() {
    if (this._genreChart) {
      this._genreChart.destroy();
      this._genreChart = null;
    }
  }

  _renderGenreChart(genreCtx, movies) {
    const genres = this._topGenreParsing(movies).filter((movie) => movie.genre !== ``);
    const genresLabels = genres.map((genre) => genre.genre);
    const genresCountByLabels = genres.map((genre) => genre.value);

    return new Chart(genreCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: genresLabels,
        datasets: [{
          data: genresCountByLabels,
          backgroundColor: `rgb(255,255,0)`,
          borderWidth: 1,
          barThickness: 30,
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 18
            },
            color: `#ffffff`,
            anchor: `start`,
            align: `start`,
            padding: 30
          }
        },
        tooltips: {
          enabled: false
        },
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: false,
            ticks: {
              beginAtZero: true,
            }
          }],
          yAxes: [{
            ticks: {
              fontSize: 18,
              fontColor: `#ffffff`,
              padding: 60,
            }
          }]
        }
      }
    });
  }
}
