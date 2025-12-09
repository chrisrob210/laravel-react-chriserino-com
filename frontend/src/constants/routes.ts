import React from 'react';
import { RouteObject } from 'react-router-dom';
import Home from '../components/pages/Home';
import Portfolio from '../components/pages/Portfolio';

export type AppRoute = {
    path: string;
    element: React.ReactElement;
    label?: string;
    protected?: boolean;
}

export const routes: AppRoute[] = [
    {
        path: '/',
        element: React.createElement(Home),
        label: 'Home',
        protected: false
    },
    {
        path: '/portfolio',
        element: React.createElement(Portfolio),
        label: 'Portfolio',
        protected: false
    },
];
