import {
  generateFilmTitle,
  generateFilmYear,
  generateImgUrl,
  getRandomDataFromArray,
  generateTimeDuration,
  POSTER_PATH,
  posters,
  TIME_DATA,
  filmsList,
  genre,
  descriptionText,
  generateRandomBoolean,
} from "./film-card";
import {generateRandomInteger} from "../utils.js";

const Limiter = {
  MONTHS: 11,
  DAYS: 30,
  HOURS: 24,
  MINUTES: 60,
  COMMENTS: 10,
};
const AGE = [12, 16, 18];
const EMOJI_PATH = `./images/emoji/`;

const directors = [
  `Francis Ford Coppola`,
  `Michael Curtiz`,
  `Stanley Kubrick`,
  `Martin Scorsese`,
  `Alfred Hitchcock`,
  `Billy Wilder`,
  `David Lean`,
  `Stanley Dohen`,
  `George Lucas`,
  `Roman Polanski`,
  `Alfred Hitchcock`,
  `Carol Reed`,
  `Victor Fleming`,
  `Akira Kurosawa`,
  `Quentin Tarantino`,
  `Steven Spielberg`,
];

const writers = [
  `Billy Wilder`,
  `Ethan Coen and Joel Coen`,
  `Robert Towne`,
  `Quentin Tarantino`,
  `Francis Ford Coppola`,
  `William Goldman`,
  `Charlie Kaufman`,
  `Woody Allen`,
  `Nora Ephron`,
  `Ernest Lehman`
];

const actors = [
  `Robert De Niro`,
  `Jack Nicholson`,
  `Marlon Brando`,
  `Denzel Washington`,
  `Clark Gable`,
  `Tom Hanks`,
  `Humphrey Bogart`,
  `Daniel Day-Lewis`,
  `Leonardo DiCaprio`,
  `Johnny Depp`,
  `Meryl Streep`,
  `Elizabeth Taylor`
];

const countries = [
  `USA`,
  `Austria`,
  `Belgium`,
  `Bulgaria`,
  `Cyprus`,
  `Denmark`,
  `Finland`,
  `France`,
  `Germany`
];

const emoji = [
  `angry.png`,
  `puke.png`,
  `sleeping.png`,
  `smile.png`,
  `trophy.png`
];

const commentText = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];

const commentAuthors = [
  `Robert De Niro`,
  `Jack Nicholson`,
  `Marlon Brando`,
  `Denzel Washington`,
  `Clark Gable`,
  `Tom Hanks`,
  `Humphrey Bogart`,
  `Daniel Day-Lewis`,
  `Leonardo DiCaprio`,
  `Johnny Depp`,
  `Meryl Streep`,
  `Elizabeth Taylor`
];

const generateCommentDate = () => {
  const dayAgo = generateRandomInteger(Limiter.DAYS);
  const hoursAgo = generateRandomInteger(Limiter.HOURS);
  const minutesAgo = generateRandomInteger(Limiter.MINUTES);
  let randomData = TIME_DATA;
  randomData.setMonth(generateRandomInteger(Limiter.MONTHS));
  randomData.setDate(randomData.getDate() - dayAgo);
  randomData.setHours(hoursAgo, minutesAgo);

  const month = randomData.getMonth() + 1 < 10 ? `0${randomData.getMonth() + 1}` : randomData.getMonth() + 1;
  const date = randomData.getDate() < 10 ? `0${randomData.getDate()}` : randomData.getDate();
  const hours = randomData.getHours() < 10 ? `0${randomData.getHours()}` : randomData.getHours();
  const minutes = randomData.getMinutes() < 10 ? `0${randomData.getMinutes()}` : randomData.getMinutes();

  return (`${randomData.getFullYear()}/${month}/${date} ${hours}:${minutes}`);
};

export const generateDetailFilmCard = () => {
  return {
    poster: generateImgUrl(POSTER_PATH, posters),
    age: getRandomDataFromArray(AGE).slice(0, 1),
    title: generateFilmTitle(filmsList),
    director: getRandomDataFromArray(directors).slice(0, 1),
    writers: getRandomDataFromArray(writers).join(`, `),
    actors: getRandomDataFromArray(actors).join(`, `),
    releaseDate: generateFilmYear(`fullDate`),
    runtime: generateTimeDuration(),
    country: getRandomDataFromArray(countries).join(`, `),
    genre: getRandomDataFromArray(genre),
    description: descriptionText.join(` `),
    isAddToWatchList: generateRandomBoolean(),
    isWatched: generateRandomBoolean(),
    isFavorite: generateRandomBoolean(),
  };
};

const generateComment = () => {
  return {
    emoji: generateImgUrl(EMOJI_PATH, emoji),
    commentText: getRandomDataFromArray(commentText),
    author: getRandomDataFromArray(commentAuthors).slice(0, 1),
    commentDate: generateCommentDate(),
  };
};

export const generateComments = () => {
  const totalComments = generateRandomInteger(Limiter.COMMENTS);
  return {
    totalComments,
    comments: new Array(totalComments)
        .fill(``)
        .map(generateComment)
  };
};
