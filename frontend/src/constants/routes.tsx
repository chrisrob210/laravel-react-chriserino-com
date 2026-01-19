import React from 'react';
import { Navigate } from 'react-router-dom';
import { ROUTE_PATHS } from './routePaths';
import ProtectedRoute from '../components/ProtectedRoute';
import Home from '../components/pages/Home';
import Portfolio from '../components/pages/Portfolio';
import Projects from '../components/pages/Projects';
import BarcodePage from '../components/projects/barcode/BarcodePage';
import TriviaBattleArena from '../components/projects/tba/TriviaBattleArena';
import AdminProjectManagement from '../components/pages/admin/AdminProjectManagement';
import AdminProjectEdit from '../components/pages/admin/AdminProjectEdit';
import AdminProjectCreate from '../components/pages/admin/AdminProjectCreate';
import AdminDashboard from '../components/pages/admin/AdminDashboard';
import AdminPortfolioManagement from '../components/pages/admin/AdminPortfolioManagement';
import AdminTechnologyManagement from '../components/pages/admin/AdminTechnologyManagement';
import AdminTechnologyEdit from '../components/pages/admin/AdminTechnologyEdit';
import AdminTechnologyCreate from '../components/pages/admin/AdminTechnologyCreate';

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
        showInNavbar: false
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
        showInNavbar: false,
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
        path: ROUTE_PATHS.ADMIN_PROJECT_MANAGEMENT,
        element: (
            <ProtectedRoute requireAdmin={true} >
                <AdminProjectManagement />
            </ProtectedRoute>
        ),
        label: 'Add Project',
        protected: true,
        showNavbar: true,
        showInNavbar: false
    },
    {
        path: ROUTE_PATHS.ADMIN_PROJECT_EDIT + '/:id',
        element: (
            <ProtectedRoute requireAdmin={true} >
                <AdminProjectEdit />
            </ProtectedRoute>
        ),
        label: 'Edit Project',
        protected: true,
        showNavbar: true,
        showInNavbar: false
    },
    {
        path: ROUTE_PATHS.ADMIN_PROJECT_CREATE,
        element: (
            <ProtectedRoute requireAdmin={true} >
                <AdminProjectCreate />
            </ProtectedRoute>
        ),
        label: 'Create Project',
        protected: true,
        showNavbar: true,
        showInNavbar: false
    },
    {
        path: ROUTE_PATHS.ADMIN_PORTFOLIO_MANAGEMENT,
        element: (
            <ProtectedRoute requireAdmin={true} >
                <AdminPortfolioManagement />
            </ProtectedRoute>
        ),
        label: 'Add Project',
        protected: true,
        showNavbar: true,
        showInNavbar: false
    },
    {
        path: ROUTE_PATHS.ADMIN_TECHNOLOGY_MANAGEMENT,
        element: (
            <ProtectedRoute requireAdmin={true} >
                <AdminTechnologyManagement />
            </ProtectedRoute>
        ),
        label: 'Add Project',
        protected: true,
        showNavbar: true,
        showInNavbar: false
    },
    {
        path: ROUTE_PATHS.ADMIN_TECHNOLOGY_EDIT + '/:id',
        element: (
            <ProtectedRoute requireAdmin={true} >
                <AdminTechnologyEdit />
            </ProtectedRoute>
        ),
        label: 'Edit Technology',
        protected: true,
        showNavbar: true,
        showInNavbar: false
    },
    {
        path: ROUTE_PATHS.ADMIN_TECHNOLOGY_CREATE,
        element: (
            <ProtectedRoute requireAdmin={true} >
                <AdminTechnologyCreate />
            </ProtectedRoute>
        ),
        label: 'Create Technology',
        protected: true,
        showNavbar: true,
        showInNavbar: false
    }
];