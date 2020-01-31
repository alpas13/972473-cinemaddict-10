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
