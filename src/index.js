import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { GraphQLClient } from 'graphql-request';

// Cache to persist homepage data between route changes
const graphqlCache = {};
const originalRequest = GraphQLClient.prototype.request;

GraphQLClient.prototype.request = async function (document, variables, ...rest) {
  const queryStr = typeof document === 'string' ? document : (document.loc?.source?.body || '');
  const match = queryStr.match(/(?:query|mutation)\s+([a-zA-Z0-9_]+)/);
  const queryName = match ? match[1] : '';

  // Whitelist of static/frequently accessed queries on Home page
  const cacheWhitelist = ['GetActiveBanners', 'GetProductCategories', 'GetProducts'];

  if (cacheWhitelist.includes(queryName)) {
    const cacheKey = `${queryName}_${JSON.stringify(variables || {})}`;

    if (graphqlCache[cacheKey]) {
      // Return cached data immediately to prevent layout shifts/shimmers
      // and refresh data in the background to keep it up to date
      originalRequest.call(this, document, variables, ...rest)
        .then(freshData => {
          graphqlCache[cacheKey] = freshData;
        })
        .catch(err => console.warn('Background sync failed:', err));

      return graphqlCache[cacheKey];
    }

    const response = await originalRequest.call(this, document, variables, ...rest);
    graphqlCache[cacheKey] = response;
    return response;
  }

  return originalRequest.call(this, document, variables, ...rest);
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
        <App />
      </GoogleOAuthProvider>
    </Provider>
  </React.StrictMode>
);
