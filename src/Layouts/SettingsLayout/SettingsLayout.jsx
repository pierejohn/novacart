import React, { useState } from 'react'
import { IoBagOutline } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import { IoLocationOutline } from "react-icons/io5";
import { CiSettings } from "react-icons/ci";
import { IoSettingsSharp } from "react-icons/io5";

import style from './SettingsLayout.module.css'
import { NavLink, Outlet } from 'react-router';

export default function SettingsLayout()
{
    
    
    const [closed, setClosed] = useState(true)
    function toggelNav()
    {
        setClosed(!closed)
        console.log(closed);
        
    }
    return (
        <>
            <div className="container-fluid mt-5">
                <div className=" row position-relative">
                    <div className={`${style.settingsNav} ${(closed?'':style.open)} pe-0`}>
                        <div className={`${style.settingsStyle}`}>

                            <NavLink
                                to="settings"
                                className={({ isActive }) =>`${style.settingsItemNav} py-4 ps-3 my-4 me-3 d-flex align-items-center justify-content-start ${isActive ? style.activeNav : ""}`}>
                                <div className='d-flex align-items-baseline'>
                                    <div className={style.settingsLayout}>
                                        <CiSettings />
                                    </div>


                                    <h4 className='mb-0 pb-0'>Settings</h4>

                                </div>
                            </NavLink>

                            <NavLink
                                to="allOrders"
                                className={({ isActive }) =>
                                    `${style.settingsItemNav} py-4 ps-3 my-4 me-3 d-flex align-items-center justify-content-start ${isActive ? style.activeNav : ""}`}>
                                <div className='d-flex align-items-baseline'>
                                    <div className={style.settingsLayout}>
                                        <IoBagOutline />
                                    </div>


                                    <h4 className='mb-0 pb-0'>Orders</h4>

                                </div>
                            </NavLink>

                            <NavLink
                                to="wishList"
                                className={({ isActive }) =>
                                    `${style.settingsItemNav} py-4 ps-3 my-4 me-3 d-flex align-items-center justify-content-start ${isActive ? style.activeNav : ""}`}>
                                <div className='d-flex align-items-baseline'>
                                    <div className={style.settingsLayout}>
                                        <CiHeart />
                                    </div>


                                    <h4 className='mb-0 pb-0'>WishList</h4>

                                </div>
                            </NavLink>


                            <NavLink
                                to="allAddresses"
                                className={({ isActive }) =>
                                    `${style.settingsItemNav} py-4 ps-3 my-4 me-3 d-flex align-items-center justify-content-start ${isActive ? style.activeNav : ""}`}>
                                <div className='d-flex align-items-baseline'>
                                    <div className={style.settingsLayout}>
                                        <IoLocationOutline />
                                    </div>


                                    <h4 className='mb-0 pb-0'>Addresses</h4>

                                </div>
                            </NavLink>








                        </div>

                        <div onClick={toggelNav} className={`${style.openAndCloseBtn}`}>
                            <IoSettingsSharp />

                        </div>  
                        </div>



                    <div className="ps-0">
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    )
}
