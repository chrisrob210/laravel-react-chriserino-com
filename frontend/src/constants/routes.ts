import React from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import Home from '../components/pages/Home';
import Portfolio from '../components/pages/Portfolio';

// Route path constants
export const ROUTE_PATHS = {
    HOME: '/',
    PORTFOLIO: '/portfolio',
} as const;


export type AppRoute = {
    path: string;
    element: React.ReactElement;
    label?: string;
    protected?: boolean;
    showNavbar: boolean;
}

export const routes: AppRoute[] = [
    // {
    //     path: ROUTE_PATHS.HOME,
    //     element: React.createElement(Home),
    //     label: 'Home',
    //     protected: false,
    //     showNavbar: true
    // },
    {
        path: ROUTE_PATHS.HOME,
        element: React.createElement(Navigate, { to: ROUTE_PATHS.PORTFOLIO, replace: true }),
        label: 'Home',
        protected: false,
        showNavbar: true
    },
    {
        path: ROUTE_PATHS.PORTFOLIO,
        element: React.createElement(Portfolio),
        label: 'Portfolio',
        protected: false,
        showNavbar: false
    },
];
