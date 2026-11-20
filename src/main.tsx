import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { MotionConfig } from 'framer-motion';
import { SmoothScrollProvider } from '@/components/SmoothScrollProvider';
import App from './App';
import './styles/globals.css';
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><HelmetProvider><BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><MotionConfig reducedMotion="user"><SmoothScrollProvider><App /></SmoothScrollProvider></MotionConfig></BrowserRouter></HelmetProvider></React.StrictMode>);
