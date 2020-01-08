import moment from "moment";

export const formatDate = (date) => {
  return moment(date).format(`DD MMMM YYYY`);
};

export const formatYear = (date) => {
  return moment(date).format(`YYYY`);
};

export const formatTime = (durationTime) => {
  let duration = null;

  if (durationTime > 60) {
    duration = moment().hour(Math.floor(durationTime / 60)).minutes(durationTime % 60);
    return `${duration.format(`h`)}h ${duration.format(`mm`)}m`;
  }

  duration = moment().hour(0).minutes(durationTime);

  return `${duration.format(`mm`)}m`;
};
