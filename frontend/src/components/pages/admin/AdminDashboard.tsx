import React from 'react'
import FlexColContainer from '../../common/FlexColContainer'
import Card from '../../common/Card'
import { Link } from 'react-router-dom'
import { ROUTE_PATHS } from '../../../constants/routePaths'
export default function AdminDashboard() {
    return (
        <FlexColContainer>
            <Card title={'Projects'}>
                <div className="flex space-x-5">
                    <Card>
                        <div>View Projects</div>
                        <Link className='bg-red-600 text-white px-2 py-0.5 rounded-lg hover:bg-red-500' to={ROUTE_PATHS.ADMIN_PROJECTS_VIEW}>View</Link>
                    </Card>
                    <Card>
                        <div>Add Project</div>
                        <Link className='bg-red-600 text-white px-2 py-0.5 rounded-lg hover:bg-red-500' to={ROUTE_PATHS.ADMIN_PROJECTS_ADD}>Add</Link>
                    </Card>
                </div>
            </Card>
        </FlexColContainer>
    )
}
