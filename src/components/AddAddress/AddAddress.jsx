import React, { useContext, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { Await, NavLink, useNavigate } from 'react-router'
import style from "./AddAddress.module.css";
import { useFormik } from 'formik';
import * as Yup from 'yup'
import { storeContext } from '../../context/StoreContext';
export default function AddAddress() {

    const [loading, setLoading] = useState(false)
    let navigate = useNavigate()
    let { addAddress,addressExist, setAddressExist } = useContext(storeContext)
    let validationSchema = Yup.object({
        name: Yup.string()
            .min(3, "Name must be at least 3 characters")
            .max(30, "Name is too long")
            .required("Full name is required"),

        details: Yup.string()
            .min(10, "Please enter a full address")
            .required("Address is required"),


        city: Yup.string()
            .required("Please select a city"),

        phone: Yup.string()
            .matches(
                /^01[0125][0-9]{8}$/,
                "Please enter a valid Egyptian phone number"
            )
            .required("Phone number is required"),
    });


    let addAddressFormik = useFormik(({
        initialValues: {
            name: '',
            details: '',
            city: '',
            phone: '',
        },
        validationSchema,
        onSubmit(val) {
            AddAddress(val)

        }
    }))

    async function AddAddress(val) {
        setLoading(true)
        let token = localStorage.getItem('token')
        let response
        if (token) {
            response = await addAddress(val)
            
            if (response.status == 200) {
                navigate('/settings/allAddresses')
            }

        } else {
            console.log('pls login first');

        }
        setLoading(false)

    }


    return (
        <div className='container mt-5 '>
           
            {(addressExist? <NavLink to={'/settings/allAddresses'} className='d-flex align-items-center gap-3 greenColor cursor-pointer text-decoration-none' ><FaArrowLeft /> <span>Back to Addesses</span></NavLink>: '')}
           


            <h2 className='my-3'>Add New Address</h2>
            <h6 className='grayColor'>Add a new delivery <address></address></h6>


            <div className={`${style.cardStyle} py-3`}>
                <h3>Shipping Address</h3>
                <form onSubmit={addAddressFormik.handleSubmit} action="" className={` d-flex flex-column gap-3`} >
                    <div>
                        <label htmlFor="name" >Full name</label>
                        <input type="text" onChange={addAddressFormik.handleChange} onBlur={addAddressFormik.handleBlur} className='form-control' id='name' name='name' placeholder="" />

                        {(addAddressFormik.errors.name && addAddressFormik.touched.name ? <div className="alert alert-danger mt-3" role="alert">
                            {addAddressFormik.errors.name}
                        </div> : '')}



                    </div>
                    <div>

                        <label htmlFor="details" >Full address</label>

                        <input type="text" onChange={addAddressFormik.handleChange} onBlur={addAddressFormik.handleBlur} className='form-control' id='details' name='details' placeholder="Street address, building number, apartment..." />

                        {(addAddressFormik.errors.details && addAddressFormik.touched.details ? <div className="alert alert-danger mt-3" role="alert">
                            {addAddressFormik.errors.details}
                        </div> : '')}

                    </div>
                    <div>

                        <label htmlFor="city" >City name</label>

                        <select className="form-select shadow-sm rounded-3 py-2" onChange={addAddressFormik.handleChange} onBlur={addAddressFormik.handleBlur} id="city" name="city">
                            <option value="">Choose your city</option>

                            <option>Cairo</option>
                            <option>Alexandria</option>
                            <option>Ismailia</option>
                            <option>Kafr El Sheikh</option>
                            <option>Aswan</option>
                            <option>Assiut</option>
                            <option>Luxor</option>
                            <option>New Valley</option>
                            <option>North Sinai</option>
                            <option>Beheira</option>
                            <option>Beni Suef</option>
                            <option>Port Said</option>
                            <option>Red Sea</option>
                            <option>Giza</option>
                            <option>Dakahlia</option>
                            <option>South Sinai</option>
                            <option>Damietta</option>
                            <option>Sohag</option>
                            <option>Suez</option>
                            <option>Sharqia</option>
                            <option>Gharbia</option>
                            <option>Faiyum</option>
                            <option>Qalyubia</option>
                            <option>Qena</option>
                            <option>Matrouh</option>
                            <option>Monufia</option>
                            <option>Minya</option>
                        </select>

                        {(addAddressFormik.errors.city && addAddressFormik.touched.city ? <div className="alert alert-danger mt-3" role="alert">
                            {addAddressFormik.errors.city}
                        </div> : '')}
                    </div>


                    <div>



                        <label htmlFor="phone" >Phone</label>
                        <input onChange={addAddressFormik.handleChange} onBlur={addAddressFormik.handleBlur} type="text" className='form-control' id='phone' name='phone' placeholder="01234567891" />


                        {(addAddressFormik.errors.phone && addAddressFormik.touched.phone ? <div className="alert alert-danger mt-3" role="alert">
                            {addAddressFormik.errors.phone}
                        </div> : '')}
                    </div>
                    <div>


                        <button type='submit ' className='btn btn-success w-100'>


                            {(loading ? <div className="spinner-border" role="status">

                            </div> : 'Save address')}

                        </button>
                    </div>


                </form>



            </div>
        </div>
    )
}
