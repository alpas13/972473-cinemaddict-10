import {generateRandomInteger} from "../utils.js";
import moment from "moment";

export const POSTER_PATH = `./images/posters/`;
export const TIME_DATA = new Date();
const YEARS_PERIOD = 70;
const MAX_COMMENTS = 1000;

const FilmRating = {
  MAX: 10,
  MIN: 0
};

const FilmDuration = {
  MAX: 120,
  MIN: 15,
};

const Limiter = {
  MAX: 3,
  MIN: 1,
};

export const filmsList = [
  `The Shawshank Redemption`,
  `The Godfather`,
  `The Godfather: Part II`,
  `The Dark Knight`,
  `Schindler's List`,
  `12 Angry Men`,
  `Pulp Fiction`,
  `The Lord of the Rings: The Return of the King`,
  `The Good, the Bad and the Ugly`,
  `Fight Club`,
  `The Lord of the Rings: The Fellowship of the Ring`,
  `Star Wars: Episode V - The Empire Strikes Back`,
  `Forrest Gump`,
  `Inception`,
  `The Lord of the Rings: The Two Towers`,
  `One Flew Over The Cuckoo's Nest`,
  `Goodfellas`,
  `The Matrix`,
  `Seven Samurai`,
  `Star Wars: Episode IV: A New Hope`,
  `City of God`,
  `Se7en`,
  `The Silence of the Lambs`,
  `It's a Wonderful Life`,
  `The Usual Suspects`
];

export const posters = [
  `made-for-each-other.png`,
  `popeye-meets-sinbad.png`,
  `sagebrush-trail.jpg`,
  `santa-claus-conquers-the-martians.jpg`,
  `the-dance-of-life.jpg`,
  `the-dance-of-life.jpg`,
  `the-great-flamarion.jpg`,
  `the-man-with-the-golden-arm.jpg`
];

export const descriptionText = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];

export const genre = [
  `Action`,
  `Adventure`,
  `Animation`,
  `Biography`,
  `Comedy`,
  `Crime`,
  `Documentary`,
  `Drama`,
  `Family`,
  `Fantasy`,
  `Film-Noir`,
  `History`,
  `Horror`,
  `Music`,
  `Musical`,
  `Mystery`,
  `Romance`,
  `Sci-Fi`,
  `Short`,
  `Sport`,
  `Thriller`,
  `War`,
  `Western`
];

export const generateFilmTitle = (data) => {
  const index = generateRandomInteger(data.length);
  const randomRating = Math.floor((Math.random() * (FilmRating.MAX - FilmRating.MIN) + FilmRating.MIN) * 10) / 10;
  return {
    name: data[index],
    rating: randomRating < 1 ? 0 : randomRating.toFixed(1),
  };
};

export const generateImgUrl = (path, data) => {
  const index = generateRandomInteger(data.length);
  return path + data[index];
};

export const generateFilmYear = (fullDate = false) => {
  const filmAge = generateRandomInteger(YEARS_PERIOD);
  const date = generateRandomInteger(28, 1);
  const randomMonth = generateRandomInteger(11);
  const detailData = moment().subtract({
    days: date,
    month: randomMonth,
    years: filmAge,
  });

  return fullDate ? `${detailData.format(`DD MMMM YYYY`)}` : `${detailData.format(`YYYY`)}`;
};

export const generateTimeDuration = () => {
  const duration = generateRandomInteger(FilmDuration.MAX, FilmDuration.MIN);

  if (duration > 60) {
    return duration - 60 > 10 ? `1h ${duration - 60}m` : `1h 0${duration - 60}m`;
  }
  return `${duration}m`;
};

export const getRandomDataFromArray = (data) => {
  const selectedData = [];
  const numberItems = generateRandomInteger(Limiter.MAX, Limiter.MIN);

  for (let i = numberItems; i--;) {
    selectedData.push(data[generateRandomInteger(data.length)]);
  }

  return selectedData;
};

export const generateRandomBoolean = () => {
  return Math.random() > 0.5;
};

export const generateFilmCard = () => {
  return {
    poster: generateImgUrl(POSTER_PATH, posters),
    title: generateFilmTitle(filmsList),
    year: generateFilmYear(),
    duration: generateTimeDuration(),
    genre: getRandomDataFromArray(genre).slice(0, 1),
    description: getRandomDataFromArray(descriptionText).join(` `),
    comments: generateRandomInteger(MAX_COMMENTS),
    isAddToWatchList: generateRandomBoolean(),
    isWatched: generateRandomBoolean(),
    isFavorite: generateRandomBoolean(),
  };
};

export const generateListOfFilmsCards = (count) => {
  return new Array(count)
      .fill(``)
      .map(generateFilmCard);
};
