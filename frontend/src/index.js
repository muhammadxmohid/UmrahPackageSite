import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/tailwind.css';

import GA from 'google-analytics-react';

const trackingId = process.env.REACT_APP_GA_TRACKING_ID || '';

if (trackingId) {
  GA.initialize(trackingId);
  GA.pageview(window.location.pathname + window.location.search);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
