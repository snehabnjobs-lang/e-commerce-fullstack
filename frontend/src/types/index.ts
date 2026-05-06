export interface Category {
  _id: string;
  name: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  sold: number;
  shipping: boolean;
  category?: Category;
}

export interface CartItem extends Product {
  count: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 0 | 1;
}

export interface AuthData {
  token: string;
  user: User;
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

export interface ToastAPI {
  success: (msg: string, duration?: number) => number;
  error: (msg: string, duration?: number) => number;
  warning: (msg: string, duration?: number) => number;
  info: (msg: string, duration?: number) => number;
  dismiss: (id: number) => void;
}

export interface ThemeContextValue {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}
