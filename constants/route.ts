const ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  PROFILE: (id: string) => `/profile/${id}`,

  EVENTS: (id: string) => `/events/${id}`,
  CREATE_EVENT: "/create-event",
  DASHBOARD: (id: string) => `/dashboard/${id}`,
};

export default ROUTES;
