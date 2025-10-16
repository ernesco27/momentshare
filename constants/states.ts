import ROUTES from "./route";

export const DEFAULT_EMPTY = {
  title: "No Data Found",
  message:
    "Looks like the database is taking a nap. Wake it up with some new entries.",
  button: {
    text: "Add Data",
    href: ROUTES.HOME,
  },
};

export const DEFAULT_ERROR = {
  title: "Something Went Wrong",
  message: "Even our code can have a bad day. Give it another shot.",
  button: {
    text: "Retry Request",
    href: ROUTES.HOME,
  },
};

export const EMPTY_EVENT = {
  title: "Ahh, No Events Yet!",
  message:
    "Your event board is empty. Maybe it’s waiting for your upcoming event to get things rolling.",
};

export const EMPTY_PLAN = {
  title: "Ahh, No Plans Yet!",
  message: "Plans will be available soon. Check back later",
};

export const EMPTY_GALLERY = {
  title: "Ahh, No Media Yet!",
  message:
    "Your event gallery is empty. Maybe it’s waiting for your upcoming event to get things rolling.",
};
