export const API = {
  AUTH: {
    REGISTER: '/api/users/register',
    LOGIN: '/api/users/login'
  },
  USERS: {
    GET_ALL: '/api/users',
    GET_BY_ID: (id: string) => `/api/users/${id}`,
    UPDATE: (id: string) => `/api/users/${id}`,
    DELETE: (id: string) => `/api/users/${id}`,
    UPLOAD_AVATAR: (id: string) => `/api/users/${id}/avatar`
  }
};