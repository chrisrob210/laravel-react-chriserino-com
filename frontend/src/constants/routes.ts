import React from 'react';
import { Navigate } from 'react-router-dom';
import Home from '../components/pages/Home';
import Portfolio from '../components/pages/Portfolio';
import Projects from '../components/pages/Projects';
import BarcodeScan from '../components/pages/projects/BarcodeScan'
import TriviaBattleArena from '../components/pages/projects/TriviaBattleArena';

// Route path constants
export const ROUTE_PATHS = {
    HOME: '/',
    PORTFOLIO: '/portfolio',
    PROJECTS: '/projects',
    PROJECT_BARCODE_SCANNER: '/projects/barcode-scanner',
    PROJECT_TRIVIA_BATTLE: '/projects/trivia-battle-arena',
} as const;


export type AppRoute = {
    path: string;
    element: React.ReactElement;
    label?: string;
    protected?: boolean;
    showNavbar: boolean;
    showInNavbar: boolean;
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
        showNavbar: true,
        showInNavbar: true
    },
    {
        path: ROUTE_PATHS.PORTFOLIO,
        element: React.createElement(Portfolio),
        label: 'Portfolio',
        protected: false,
        showNavbar: false,
        showInNavbar: true
    },
    {
        path: ROUTE_PATHS.PROJECTS,
        element: React.createElement(Projects),
        label: 'Projects',
        protected: false,
        showNavbar: true,
        showInNavbar: true,
    },
    {
        path: ROUTE_PATHS.PROJECT_BARCODE_SCANNER,
        element: React.createElement(BarcodeScan),
        label: 'Barcode Scanner',
        protected: false,
        showNavbar: true,
        showInNavbar: false
    },
    {
        path: ROUTE_PATHS.PROJECT_TRIVIA_BATTLE,
        element: React.createElement(TriviaBattleArena),
        label: 'Trivia Battle',
        protected: false,
        showNavbar: true,
        showInNavbar: false
    }


];
