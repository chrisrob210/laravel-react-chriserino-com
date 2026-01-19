import React from 'react'
import FlexColContainer from '../../common/FlexColContainer'
import Card from '../../common/Card'
import { Link } from 'react-router-dom'
import { ROUTE_PATHS } from '../../../constants/routePaths'
import Title from '../../common/Title'
export default function AdminDashboard() {
    return (
        // <div className="flex flex-row justify-center pt-3 min-h-screen bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400 text-slate-800">
        <FlexColContainer>
            <Title title="Dashboard" />
            <Card>
                <div className="flex space-x-5">
                    <Card>
                        <div className="font-semibold text-slate-600">Project Management</div>
                        <div>Add, edit, and remove projects</div>
                        <Link className='bg-slate-500 text-white px-2 py-0.5 rounded-lg hover:bg-slate-400' to={ROUTE_PATHS.ADMIN_PROJECT_MANAGEMENT}>Manage</Link>
                    </Card>
                    {/* <Card>
                        <div className="font-semibold text-slate-600">Portfolio Management</div>
                        <div>Edit the portfolio</div>
                        <Link className='bg-slate-500 text-white px-2 py-0.5 rounded-lg hover:bg-slate-400' to={ROUTE_PATHS.ADMIN_PORTFOLIO_MANAGEMENT}>Manage</Link>
                    </Card> */}
                    <Card>
                        <div className="font-semibold text-slate-600">Technology Management</div>
                        <div>Add, edit, and delete technologies</div>
                        <Link className='bg-slate-500 text-white px-2 py-0.5 rounded-lg hover:bg-slate-400' to={ROUTE_PATHS.ADMIN_TECHNOLOGY_MANAGEMENT}>Manage</Link>
                    </Card>
                </div>
            </Card>
        </FlexColContainer>
        /* </div> */
    )
}
