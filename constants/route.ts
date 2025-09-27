const ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  PROFILE: (id: string) => `/profile/${id}`,

  EVENTS: "/events",
  EVENT: (id: string) => `/events/${id}`,
  CREATE_EVENT: (id: string) => `/events/create-event/${id}`,
  DASHBOARD: (id: string) => `/dashboard/${id}`,
};

export default ROUTES;
