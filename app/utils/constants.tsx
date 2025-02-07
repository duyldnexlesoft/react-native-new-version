export const httpMethods = {
  GET: "get",
  POST: "post",
  PUT: "put",
  PATCH: "patch",
  DELETE: "delete",
};
export const ACTIVITY_EXPERIENCE_LEVEL = ["Beginner", "Intermediate", "Expert"];
export const GENDER = ["Male", "Female", "Non-binary"];
export const CATEGORIES = {
  RUNNING: "Running",
  WALKING: "Walking",
  CYCLING: "Cycling",
  HIKING: "Hiking",
  PERSONAL_TRAINING: "Personal Training",
  GOLF: "Golf",
  TENNIS: "Tennis",
  OTHER: "Other",
};

export const SERVICE_LEVEL = ["Exercise", "Competitive"];
export const AUTH_TOKEN = "AUTH_TOKEN";
export const CURRENT_USER = "CURRENT_USER";
export const SHERPA_TOKEN = "SHERPA_TOKEN";
export const BANK_LINK = "bank";
export const LIMIT_MESSAGE = 20;
export const LIMIT_ITEM = 10;
export const ALL = "All";
export const STATUS = {
  REQUESTED: "Requested",
  REJECTED: "Rejected",
  ACCEPTED: "Accepted",
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  CANCELED: "Canceled",
  REFUNDED: "Refunded",
  EXPIRED: "Expired",
};
export const STATUS_SERVICE = {
  ACTIVE: 1,
  INACTIVE: 2,
};
export const FORMAT_TIME: any = {
  time: "hh:mm A",
  date: "MMM DD, YYYY",
  datetime: "MMM DD, hh:mm A",
};
export const PROFILE_TABS = {
  SERVICES: "Services",
  AVAILABILITY: "Availability",
  BIO: "Bio",
  REVIEWS: "Reviews",
};
export const REVIEW_TYPE = {
  ATHLETE: "Athlete",
  SHERPA: "Sherpa",
};
export const BOOKING_TABS = {
  UPCOMING: "Upcoming",
  REVIEW: "Review",
  PAST: "Past",
};
export const ATHLETE_TABS = {
  DETAIL: "Detail",
  REVIEW: "Review",
};
export const DAYS_OF_WEEK = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

export default {};
