import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/main.scss';
import { ChakraProvider } from '@chakra-ui/react';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';

import RouteList from './RouteList';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <ThemeProvider>
        <ToastProvider>
          <RouteList />
        </ToastProvider>
      </ThemeProvider>
    </ChakraProvider>
  </React.StrictMode>
);
