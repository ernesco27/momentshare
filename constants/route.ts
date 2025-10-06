const ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  PROFILE: (id: string) => `/profile/${id}`,

  EVENTS: "/dashboard/events",
  EVENT: (id: string) => `/dashboard/events/${id}`,
  CREATE_EVENT: (id: string) => `/dashboard/events/create-event/${id}`,
  EDIT_EVENT: (id: string) => `/dashboard/events/${id}/edit`,

  DASHBOARD: "/dashboard",
  GALLERY: (id: string) => `/dashboard/events/gallery/${id}`,
  UPLOAD: (id: string) => `/events/upload/${id}`,
};

export default ROUTES;
