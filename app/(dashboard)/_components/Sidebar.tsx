import React from 'react'
import Logo from './Logo'
import SidebarRoutes from './SidebarRoutes'
const Sidebar = () => {
    return (
        <div className='h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm dark'>
            <div className='p-6'>
                <Logo />
            </div>
            <div className='flex flex-col w-full'>
                <SidebarRoutes />

            </div>
        </div>
    )
}

export default Sidebar