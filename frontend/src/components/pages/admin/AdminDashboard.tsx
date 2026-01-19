import React from 'react'
import FlexColContainer from '../../common/FlexColContainer'
import Card from '../../common/Card'
import { Link } from 'react-router-dom'
import { ROUTE_PATHS } from '../../../constants/routePaths'
export default function AdminDashboard() {
    return (
        // <div className="flex flex-row justify-center pt-3 min-h-screen bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400 text-slate-800">
        <FlexColContainer>
            <Card>
                <div className="flex space-x-5">
                    <Card>
                        <div>Project Management</div>
                        <Link className='bg-slate-500 text-white px-2 py-0.5 rounded-lg hover:bg-slate-400' to={ROUTE_PATHS.ADMIN_PROJECT_MANAGEMENT}>Manage</Link>
                    </Card>
                    <Card>
                        <div>Portfolio Management</div>
                        <Link className='bg-slate-500 text-white px-2 py-0.5 rounded-lg hover:bg-slate-400' to={ROUTE_PATHS.ADMIN_PORTFOLIO_MANAGEMENT}>Manage</Link>
                    </Card>
                </div>
            </Card>
        </FlexColContainer>
        /* </div> */
    )
}
