import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import { Outlet } from 'react-router'

import CategorySlider from '../../components/CategorySlider/CategorySlider'


export default function MainLayout() {
  return (
    <>
      <Navbar />
      <div className=''>
        <Outlet />
        </div>

    </>
  )
}
