import moment from "moment";

const DEBOUNCE_TIMEOUT = 500;

moment.relativeTimeThreshold(`mm`, 3);
moment.relativeTimeThreshold(`m`, 60);
moment.relativeTimeThreshold(`hh`, 1.59);
moment.relativeTimeThreshold(`h`, 24);


moment.updateLocale(`en`, {
  relativeTime: {
    future: `in %s`,
    past: `%s`,
    s: `now`,
    ss: `now`,
    m: `a minute ago`,
    mm: `few minutes ago`,
    h: `an hour ago`,
    hh: `few hours ago`,
    d: `a day ago`,
    dd: `%d days ago`,
    M: `a month ago`,
    MM: `%d months ago`,
    y: `a year ago`,
    yy: `%d years ago`
  }
});

const formatDate = (date) => {
  return moment(date).format(`DD MMMM YYYY`);
};

const formatYear = (date) => {
  return moment(date).format(`YYYY`);
};

const formatCommentDate = (date) => {
  return moment(date).fromNow();
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

export {DEBOUNCE_TIMEOUT, formatDate, formatYear, formatCommentDate, formatTime, setProfileName};
