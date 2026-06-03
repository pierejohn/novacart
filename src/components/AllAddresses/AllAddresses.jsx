import React, { useContext, useEffect, useState } from 'react'
import style from './AllAddresses.module.css'
import { CiLocationOn } from 'react-icons/ci'
import { storeContext } from '../../context/StoreContext';
import { BaseUrl } from '../utils/baseUrl';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router';
import AddAddress from '../AddAddress/AddAddress';

export default function AllAddresses() {
    let navigate = useNavigate()
    const [addresses, setAddresses] = useState({})
    const [loading, setLoading] = useState(true)
    const [cancelDelete, setCancelDelete] = useState(false)
    const [idOfWantToDeleteAddress, setIdOfWantToDeleteAddress] = useState(false)
    const [idOfWantToDeleteAddressDisplay, setIdOfWantToDeleteAddressisplay] = useState(false)

    useEffect(() => {
        allAdresses()

    }, [])

    let { getAddress, setAddressExist, addressExist } = useContext(storeContext)

    async function allAdresses() {
        let response
        let token = localStorage.getItem('token')
        if (token) {

            response = await getAddress(token)
            setAddresses(response.data.data)
            if (response.data.data.length == 0) {

                setAddressExist(false)
                navigate('addAddress')
            } else {
                setAddressExist(true)
            }

            setLoading(false)

        } else {
            console.log('pls go login first');

        }


    }




    async function deleteAddress() {
        let token = localStorage.getItem('token')
        setCancelDelete(false)
        await axios.delete(`${BaseUrl}/addresses/${idOfWantToDeleteAddress}`, { headers: { token } }).then((data) => {




            setIdOfWantToDeleteAddressisplay(idOfWantToDeleteAddress)
            allAdresses()

        }).catch((error) => {
            console.log(error?.response?.data?.message);

        })
    }

    return (
        <>
            <div className={`SpinnerScreen ${loading ? '' : 'fadeOut'}`}>
                <span className='loader'></span>
            </div>
            <div className={`${style.deletePage} ${cancelDelete ? '' : style.fade} d-flex align-items-center justify-content-center`}>
                <div className={style.modalBox}>
                    <div className="modal-header border-0 ">
                        <h5 className="modal-title fw-bold">Confirm Delete</h5>
                        <button onClick={() => setCancelDelete(false)}
                            type="button"

                            className="btn-close"
                        />
                    </div>

                    <div className="modal-body text-center">


                        <h6 className="mt-3">
                            Are you sure you want to delete this address?

                        </h6>

                        <p className="text-muted small mt-2">
                            This action cannot be undone.
                        </p>
                    </div>

                    <div className="modal-footer border-0 d-flex justify-content-center gap-2">
                        <button onClick={() => setCancelDelete(false)} className="btn btn-light px-4">
                            Cancel
                        </button>

                        <button onClick={() => deleteAddress()} className="btn btn-danger px-4">
                            Delete
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mt-5 ">
                <div className='d-flex justify-content-between align-items-end'>
                    <div>
                        <h2>My Addresses</h2>
                        <h6 className='grayColor'>View all your saved delivery addresses</h6>
                    </div>
                    <div>
                        <NavLink to={'addAddress'} className={`${style.addAddressBtn} btn`}>Add New Address</NavLink>
                    </div>
                </div>

                {(!addresses.length > 0 ? '' :

                    addresses.map((val, index) => {
                        return <div key={val._id} className={`${style.orderItems} ${(val._id == idOfWantToDeleteAddressDisplay ? style.deleteStyle : '')} m-auto mt-3 p-3 d-flex gap-3 position-relative bg-white`} >

                            <div className={`${style.iconBox}`}>
                                <CiLocationOn className={`${style.icon} greenColor`} />

                            </div>
                            <div >
                                <h5 className='pb-3'>{val.name}</h5>
                                <h6 className='grayColor'>{val.city}</h6>
                                <h6 className='grayColor'>{val.details}</h6>
                                <h6 className=''>{val.phone}</h6>
                                <h6 className='grayColor'>{val.city} , Egypt</h6>

                            </div>
                            <button

                                type="button" onClick={() => { setCancelDelete(true); setIdOfWantToDeleteAddress(val._id) }} className={`${style.closeBtn} btn-close position-absolute`} aria-label="Close"></button>

                        </div>
                    })

                )




                }


            </div>
        </>
    )
}
