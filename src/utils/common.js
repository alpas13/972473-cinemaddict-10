import moment from "moment";

export const formatDate = (date) => {
  return moment(date).format(`DD MMMM YYYY`);
};

export const formatYear = (date) => {
  return moment(date).format(`YYYY`);
};

export const formatCommentDate = (date) => {
  return moment(date).format(`YYYY/MM/DD hh:mm`);
};

export const formatTime = (durationTime, format = null) => {
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

export const setProfileName = (movies) => {
  const moviesNumber = movies.filter((movie) => movie.isWatched === true).length;
  let profileRating = ``;

  if (moviesNumber >= 1 && moviesNumber < 11) {
    profileRating = `Novice`;
  } else if (moviesNumber >= 11 && moviesNumber < 21) {
    profileRating = `Fan`;
  } else if (moviesNumber >= 21) {
    profileRating = `Movie Buff`;
  }
  return profileRating;
};
