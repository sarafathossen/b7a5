import Footer from '@/components/Footer'
import Header from '@/components/Header'
import React from 'react'

const DashboardLayout = (
    {
        children
    }: {
        children: React.ReactNode
    }
) => {
    return (
        <div className="">
            <Header></Header>
            <div className='max-w-7xl mx-auto'>
                {children}
            </div>
            <Footer></Footer>
        </div>
    )
}

export default DashboardLayout
