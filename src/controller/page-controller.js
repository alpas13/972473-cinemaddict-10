import FilmsList from "../components/list.js";
import ExtraFilmsList from "../components/list-extra.js";
import FilmsContainer from "../components/films-container.js";
import ButtonShowMore from "../components/button-show-more.js";
import FilmCardComponent from "../components/card";
import PopupComponent from "../components/popup";
import {generateComments, generateDetailFilmCard} from "../mocks/popup-data";
import {render, remove, RenderPosition} from "../utils/render";

export default class PageController {
  constructor(container) {
    this._container = container;
    this._TOTAL_EXTRA_CARDS = 2;
    this._SHOWING_CARD_COUNT_ON_START = 5;
    this._SHOWING_CARD_COUNT_BY_BUTTON = 5;
  }

  renderFilmCard(container, card) {
    const filmCardComponent = new FilmCardComponent(card);
    const popupComponent = new PopupComponent(generateDetailFilmCard(), generateComments());
    const siteBodeElement = document.querySelector(`body`);

    const onClickHandler = () => {
      render(siteBodeElement, popupComponent, RenderPosition.BEFOREEND);
    };

    filmCardComponent.setClickHandler(`.film-card__poster`, onClickHandler);
    filmCardComponent.setClickHandler(`.film-card__title`, onClickHandler);
    filmCardComponent.setClickHandler(`.film-card__comments`, onClickHandler);

    popupComponent.setClosePopupHandler(() => {
      remove(popupComponent);
    });

    render(container.getElement(), filmCardComponent, RenderPosition.BEFOREEND);
  }

  render(cards) {
    const filmsList = new FilmsList();
    const topRatedFilms = new ExtraFilmsList(`Top rated`);
    const mostCommentFilms = new ExtraFilmsList(`Most commented`);
    const generalFilmsContainer = new FilmsContainer();
    const buttonShowMore = new ButtonShowMore();

    let showingCardCount = this._SHOWING_CARD_COUNT_ON_START;

    render(this._container, filmsList, RenderPosition.BEFOREEND);
    render(filmsList.getElement(), generalFilmsContainer, RenderPosition.BEFOREEND);

    cards.slice(0, showingCardCount).forEach((card) => {
      this.renderFilmCard(generalFilmsContainer, card);
    });

    render(filmsList.getElement(), buttonShowMore, RenderPosition.BEFOREEND);

    buttonShowMore.setClickHandler(() => {
      let prevCardCount = showingCardCount;
      showingCardCount += this._SHOWING_CARD_COUNT_BY_BUTTON;

      cards.slice(prevCardCount, showingCardCount).forEach((card) => {
        this.renderFilmCard(generalFilmsContainer, card);
      });

      if (showingCardCount >= cards.length) {
        remove(buttonShowMore);
        buttonShowMore.removeElement();
      }
    });

    render(this._container, topRatedFilms, RenderPosition.BEFOREEND);
    const topRatedFilmsContainer = new FilmsContainer();
    render(topRatedFilms.getElement(), topRatedFilmsContainer, RenderPosition.BEFOREEND);

    cards.slice()
        .sort((a, b) => {
          return b.title.rating - a.title.rating;
        })
        .slice(0, this._TOTAL_EXTRA_CARDS)
        .forEach((card) => {
          if (card.title.rating > 0) {
            this.renderFilmCard(topRatedFilmsContainer, card);
          }
        });


    render(this._container, mostCommentFilms, RenderPosition.BEFOREEND);
    const mostCommentFilmsContainer = new FilmsContainer();
    render(mostCommentFilms.getElement(), mostCommentFilmsContainer, RenderPosition.BEFOREEND);

    cards.slice()
        .sort((a, b) => {
          return b.comments - a.comments;
        })
        .slice(0, this._TOTAL_EXTRA_CARDS)
        .forEach((card) => {
          if (card.comments > 0) {
            this.renderFilmCard(mostCommentFilmsContainer, card);
          }
        });
  }
}
