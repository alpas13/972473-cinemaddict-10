import moment from "moment";

const formatDate = (date) => {
  return moment(date).format(`DD MMMM YYYY`);
};

const formatYear = (date) => {
  return moment(date).format(`YYYY`);
};

const formatCommentDate = (date) => {
  return moment(date).format(`YYYY/MM/DD hh:mm`);
};

const formatTime = (durationTime, format = null) => {
  let duration = null;

  if (durationTime) {
    if (durationTime > 60) {
      duration = moment().hour(Math.floor(durationTime / 60)).minutes(durationTime % 60);
      return !format ? `${duration.format(`h`)}h ${duration.format(`mm`)}m` : `${duration.format(`mm`)}`;
    }

    duration = moment().hour(0).minutes(durationTime);
    return !format ? `${duration.format(`mm`)}m` : `${duration.format(`mm`)}`;
  }
  return null;
};

const setProfileName = (movies) => {
  const moviesNumber = movies.filter((movie) => movie.isWatched).length;

  if (moviesNumber >= 1 && moviesNumber < 11) {
    return `Novice`;
  } else if (moviesNumber >= 11 && moviesNumber < 21) {
    return `Fan`;
  } else if (moviesNumber >= 21) {
    return `Movie Buff`;
  }

  return ``;
};

export {formatDate, formatYear, formatCommentDate, formatTime, setProfileName};
