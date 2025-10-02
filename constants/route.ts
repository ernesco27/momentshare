const ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  PROFILE: (id: string) => `/profile/${id}`,

  EVENTS: "/events",
  EVENT: (id: string) => `/events/${id}`,
  CREATE_EVENT: (id: string) => `/events/create-event/${id}`,
  DASHBOARD: (id: string) => `/dashboard/${id}`,
  GALLERY: (id: string) => `/events/gallery/${id}`,
  UPLOAD: (id: string) => `/events/upload/${id}`,
};

export default ROUTES;
