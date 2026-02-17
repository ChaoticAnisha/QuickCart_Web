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
  },
  PRODUCTS: {
    GET_ALL: '/api/products',
    GET_BY_ID: (id: string) => `/api/products/${id}`,
    CREATE: '/api/products',
    UPDATE: (id: string) => `/api/products/${id}`,
    DELETE: (id: string) => `/api/products/${id}`,
    UPDATE_STOCK: (id: string) => `/api/products/${id}/stock`
  },
  CATEGORIES: {
    GET_ALL: '/api/categories',
    GET_BY_ID: (id: string) => `/api/categories/${id}`,
    CREATE: '/api/categories',
    UPDATE: (id: string) => `/api/categories/${id}`,
    DELETE: (id: string) => `/api/categories/${id}`
  }
};