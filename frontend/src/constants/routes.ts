import React from 'react';
import { Navigate } from 'react-router-dom';
import { ROUTE_PATHS } from './routePaths';
import Home from '../components/pages/Home';
import Portfolio from '../components/pages/Portfolio';
import Projects from '../components/pages/Projects';
import BarcodePage from '../components/projects/barcode/BarcodePage';
import TriviaBattleArena from '../components/projects/tba/TriviaBattleArena';

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


    // PROJECTS
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
        element: React.createElement(BarcodePage),
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
