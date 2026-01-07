import React from 'react';
import { Navigate } from 'react-router-dom';
import { ROUTE_PATHS } from './routePaths';
import ProtectedRoute from '../components/ProtectedRoute';
import Home from '../components/pages/Home';
import Portfolio from '../components/pages/Portfolio';
import Projects from '../components/pages/Projects';
import BarcodePage from '../components/projects/barcode/BarcodePage';
import TriviaBattleArena from '../components/projects/tba/TriviaBattleArena';
import AddProjects from '../components/pages/admin/AddProjects';
import AdminDashboard from '../components/pages/admin/AdminDashboard';
import ViewProjects from '../components/pages/admin/ViewProjects';

export type AppRoute = {
    path: string;
    element: React.ReactElement;
    label?: string;
    protected?: boolean;
    showNavbar: boolean;
    showInNavbar: boolean;
}

export const routes: AppRoute[] = [
    {
        path: ROUTE_PATHS.HOME,
        element: <Navigate to={ROUTE_PATHS.PORTFOLIO} replace />,
        label: 'Home',
        protected: false,
        showNavbar: true,
        showInNavbar: true
    },
    {
        path: ROUTE_PATHS.PORTFOLIO,
        element: <Portfolio />,
        label: 'Portfolio',
        protected: false,
        showNavbar: false,
        showInNavbar: true
    },

    // PROJECTS
    {
        path: ROUTE_PATHS.PROJECTS,
        element: <Projects />,
        label: 'Projects',
        protected: false,
        showNavbar: true,
        showInNavbar: true,
    },
    {
        path: ROUTE_PATHS.PROJECT_BARCODE_SCANNER,
        element: <BarcodePage />,
        label: 'Barcode Scanner',
        protected: false,
        showNavbar: true,
        showInNavbar: false
    },
    {
        path: ROUTE_PATHS.PROJECT_TRIVIA_BATTLE,
        element: <TriviaBattleArena />,
        label: 'Trivia Battle',
        protected: false,
        showNavbar: true,
        showInNavbar: false
    },

    // ADMIN
    {
        path: ROUTE_PATHS.ADMIN_DASHBOARD,
        element: (
            <ProtectedRoute requireAdmin={true} >
                <AdminDashboard />
            </ProtectedRoute>
        ),
        label: 'Admin Dashboard',
        protected: true,
        showNavbar: true,
        showInNavbar: true,
    },
    {
        path: ROUTE_PATHS.ADMIN_PROJECTS_VIEW,
        element: (
            <ProtectedRoute requireAdmin={true} >
                <ViewProjects />
            </ProtectedRoute>
        ),
        label: 'View Projects',
        protected: true,
        showNavbar: true,
        showInNavbar: false
    },
    {
        path: ROUTE_PATHS.ADMIN_PROJECTS_ADD,
        element: (
            <ProtectedRoute requireAdmin={true} >
                <AddProjects />
            </ProtectedRoute>
        ),
        label: 'Add Project',
        protected: true,
        showNavbar: true,
        showInNavbar: false
    }
];