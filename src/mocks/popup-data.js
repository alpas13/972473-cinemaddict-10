import {
  generateFilmTitle,
  generateFilmYear,
  generateImgUrl,
  getRandomDataFromArray,
  generateTimeDuration,
  POSTER_PATH,
  POSTERS,
  TIME_DATA,
  FILMS_LIST,
  GENRE,
  DESCRIPTION_TEXT
} from "./film-card";
import {generateRandomInteger} from "../utils";

const Limiter = {
  MONTHS: 11,
  DAYS: 30,
  HOURS: 24,
  MINUTES: 60,
  COMMENTS: 10,
};
const AGE = [12, 16, 18];
const EMOJI_PATH = `./images/emoji/`;

const DIRECTORS = [
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

const WRITERS = [
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

const ACTORS = [
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

const COUNTRIES = [
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

const EMOJI = [
  `angry.png`,
  `puke.png`,
  `sleeping.png`,
  `smile.png`,
  `trophy.png`
];

const COMMENT_TEXT = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];

const COMMENT_AUTHORS = [
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
    poster: generateImgUrl(POSTER_PATH, POSTERS),
    age: getRandomDataFromArray(AGE).slice(0, 1),
    title: generateFilmTitle(FILMS_LIST),
    director: getRandomDataFromArray(DIRECTORS).slice(0, 1),
    writers: getRandomDataFromArray(WRITERS).join(`, `),
    actors: getRandomDataFromArray(ACTORS).join(`, `),
    releaseDate: generateFilmYear(`fullDate`),
    runtime: generateTimeDuration(),
    country: getRandomDataFromArray(COUNTRIES).join(`, `),
    genre: getRandomDataFromArray(GENRE),
    description: DESCRIPTION_TEXT.join(` `),
  };
};

const generateComment = () => {
  return {
    emoji: generateImgUrl(EMOJI_PATH, EMOJI),
    commentText: getRandomDataFromArray(COMMENT_TEXT),
    author: getRandomDataFromArray(COMMENT_AUTHORS).slice(0, 1),
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
