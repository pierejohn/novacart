import React, { useContext, useEffect, useState } from 'react'
import { storeContext } from '../../context/StoreContext'
import { useFormik } from 'formik'
import style from './Checkout.module.css'
import { FaLock } from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";
import visaImg from '../../images/category/visaIMG2.png'
import cashImg from '../../images/category/cashIMG2.png'
import * as Yup from 'yup'
import axios from 'axios';
import { BaseUrl, BaseUrl2 } from '../utils/baseUrl';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router';
import ErrorPage from '../ErrorPage/ErrorPage'
import { div } from 'motion/react-client';
export default function Checkout() {

    let navigate = useNavigate()
    const [allProduct, setAllProduct] = useState([])
    const [loading, setLoading] = useState(true)
    const [pageLoading, setPageLoading] = useState(false)
    
    const [totalPrice, setTotalPrice] = useState(0)
    const [totalPriceWithTax, setTotalPriceWithTax] = useState(0)
    const [numberOfAddresses, setNumberOfAddresses] = useState(0)
    const [cartId, setCartId] = useState(0)
    const [onLinePay, setOnLinePay] = useState(false)


    const [allAddresses, setAllAddresses] = useState([])
    const [clickedAddress, setClickedAddress] = useState(0)
    const [displayDeleteConfirmtion, setDisplayDeleteConfirmtion] = useState(false)
    const [idOfWantToDeleteAddress, setIdOfWantToDeleteAddress] = useState(null)


    let { getUserCard, addAddress, getAddress, setConfirmedOrder } = useContext(storeContext)





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
    let CheckOutFormick = useFormik(
        {

            initialValues: {
                name: '',
                details: '',
                city: '',
                phone: '',
            },
            validationSchema,
            onSubmit: (val) => {

                addNewAddress(val)





            }



        }
    )


    let placeOrderFormik = useFormik({
        initialValues: {
            details: "",
            phone: "",
            city: "",
            postalCode: "12345",
            _id: "12345"

        },
        onSubmit: (val) => {
            console.log(val);

            if (onLinePay) {
                placeOrderOnline(val)

            } else {
                placeOrderCash(val)

            }


        }

    })



    async function placeOrderCash(val) {
        let token = localStorage.getItem('token')
        let { city, phone, details } = val
        console.log({ city, phone, details });

        await axios.post(`${BaseUrl2}/orders/${val._id}`, { "shippingAddress": { city, phone, details } }, { headers: { token } }).then((data) => {
            setConfirmedOrder(data)

            // console.log(data.data.data._id);
            navigate(`/orderConfirmed/${data.data.data._id}`)

            getAllCard()

        }).catch((error) => {
            toast.error('please choose address first');
            console.log(error?.response?.data?.message);

        })
    }


    
    async function placeOrderOnline(val) {
        let token = localStorage.getItem('token')
        let { city, phone, details } = val
        console.log({ city, phone, details });

        await axios.post(`${BaseUrl}/orders/checkout-session/${val._id}`, { "shippingAddress": { city, phone, details } }, { headers: { token } }).then((data) => {
            console.log(data.data.session.url);
            setConfirmedOrder(data)
            window.location.assign(data.data.session.url);
            // navigate(`${data.data.session.url}`)
            getAllCard()

        }).catch((error) => {
            toast.error('please choose address first');
            console.log(error?.response?.data?.message);

        })
    }


    async function getAllCard() {
        let token = localStorage.getItem('token')
        let response
        if (token) {
            response = await getUserCard(token)

            // console.log(response);

            setAllProduct(response.data.data.products)
            setTotalPrice(response.data.data.totalCartPrice);
            setCartId(response.data.data._id);

            if (response.data.data.totalCartPrice == 0) {
                setTotalPriceWithTax(response.data.data.totalCartPrice)
            } else {
                setTotalPriceWithTax((20 + 100 + response.data.data.totalCartPrice))
            }


            // setTotalPriceWithTax((response.data.data.totalCartPrice))
            setLoading(false)
            setPageLoading(true)

        }

    }

    useEffect(() => {

        getAllAddress()
        getAllCard()





    }, [])


    async function addNewAddress(val) {
        let token = localStorage.getItem('token')
        let response
        if (token) {
            response = await addAddress(val)
            // console.log(response);
            getAllAddress()
        } else {
            console.log('pls login first');

        }

    }
    async function getAllAddress() {
        let token = localStorage.getItem('token')

        let response
        if (token) {
            response = await getAddress(token)
            // console.log(response);
            setNumberOfAddresses(response.data.results)
            setAllAddresses(response.data.data)
            // console.log(response.data.data[0]);



        } else {
            console.log('pls login first');

        }

    }
    function chosenAddress(address) {


        setClickedAddress(address._id);
        placeOrderFormik.setFieldValue('city', address.city)
        placeOrderFormik.setFieldValue('details', address.details)
        placeOrderFormik.setFieldValue('name', address.name)
        placeOrderFormik.setFieldValue('phone', address.phone)
        placeOrderFormik.setFieldValue('_id', cartId)


    }

    function displayAddaddress() {
        setNumberOfAddresses(0)

    }
    function displayDelete(id) {
        setIdOfWantToDeleteAddress(id)
        setDisplayDeleteConfirmtion(true)

    }
    function cancelDelete() {
        setDisplayDeleteConfirmtion(false)

    }
    async function deleteAddress() {
        let token = localStorage.getItem('token')
        await axios.delete(`${BaseUrl}/addresses/${idOfWantToDeleteAddress}`, { headers: { token } }).then((data) => {
            setDisplayDeleteConfirmtion(false)

            placeOrderFormik.setFieldValue('city', ' ')
            placeOrderFormik.setFieldValue('details', '')
            placeOrderFormik.setFieldValue('name', '')
            placeOrderFormik.setFieldValue('phone', '')
            placeOrderFormik.setFieldValue('_id', '')
            console.log(data);
            getAllAddress()

        }).catch((error) => {
            console.log(error?.response?.data?.message);

        })
    }




    return (
       <div>
        <div className={`SpinnerScreen ${pageLoading ? 'fadeOut' : ''}`}>
        <span className='loader'></span>
</div>
       { (allProduct.length==0?<ErrorPage/>:
        <>
            <ToastContainer toastStyle={{ marginTop: "50px" }} position="top-right" autoClose={3000} />
            <div className={`SpinnerScreen ${loading ? '' : 'fadeOut'}`}>
                <span className='loader'></span>
            </div>

            <div
                className={`${style.DeleteConfirmation} ${displayDeleteConfirmtion ? "" : "d-none"
                    } d-flex align-items-center justify-content-center`}
            >
                <div className={style.modalBox}>
                    <div className="modal-header border-0">
                        <h5 className="modal-title fw-bold">Confirm Delete</h5>
                        <button
                            type="button"
                            onClick={cancelDelete}
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
                        <button onClick={cancelDelete} className="btn btn-light px-4">
                            Cancel
                        </button>

                        <button onClick={deleteAddress} className="btn btn-danger px-4">
                            Delete
                        </button>
                    </div>
                </div>
            </div>


            <div className='container mt-5 pt-5'>
                <h2>CheckOut</h2>
                <h5 className='grayColor'>Complete your order</h5>
                <div className="row">
                    <div className='col-lg-7 col-md-7 col-12'>
                        <div >
                            {(numberOfAddresses > 0 ?
                                <>
                                    <div className={`${style.cardStyle} `}>
                                        <h3>Shipping Address</h3>
                                        <h5>Saved Address</h5>
                                        <form onSubmit={placeOrderFormik.handleSubmit}>
                                            <div className={style.addressGroup}>
                                                {allAddresses.map((val, index) => {
                                                    return <label key={val._id}
                                                        onChange={() => chosenAddress(val)}
                                                        className={`${style.addressCard} position-relative ${clickedAddress == val._id ? style.active : ''} `}>
                                                        <input type="radio" name="address"
                                                        />
                                                        <button
                                                            onClick={() => displayDelete(val._id)}
                                                            type="button" className={`${style.closeBtn} btn-close position-absolute`} aria-label="Close"></button>
                                                        <div className="d-flex justify-content-between align-items-start">

                                                            <div className="d-flex gap-3">

                                                                <div className={style.radioCircle}></div>



                                                                <div>
                                                                    <h6 className="mb-1">{val.city}</h6>

                                                                    <p className="mb-1 text-muted">
                                                                        {val.details}
                                                                    </p>

                                                                    <p className="mb-0 text-muted">
                                                                        {val.city}, Egypt
                                                                    </p>
                                                                </div>

                                                            </div>
                                                            {/* 
                                                    <span className={style.defaultBadge}>
                                                        Default
                                                    </span> */}

                                                        </div>
                                                    </label>
                                                })}


                                            </div>

                                        </form>
                                        <h5 onClick={() => displayAddaddress()} className={`${style.linkToAddAdress} blueColor my-3 d-flex align-items-center gap-1`}> <AiOutlinePlus />Add New Address</h5>





                                    </div>
                                    <div className={`${style.cardStyle} mt-3`}>
                                        <h3>Payment Method</h3>
                                        <p className='grayColor'>Choose how you want to pay</p>

                                        <div className={`${style.addressGroup} `} >


                                            <label
                                                onClick={() => setOnLinePay(false)}
                                                className={` ${(onLinePay ? '' : style.active)} ${style.addressCard}`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="address"
                                                />



                                                <div className="d-flex justify-content-between align-items-start">

                                                    <div className="d-flex align-items-center gap-3">

                                                        <div className={style.radioCircle}></div>

                                                        <div className='d-flex align-items-center gap-3'>
                                                            <div  >
                                                                <img className={`${style.iconsStyle}`} src={cashImg} alt="" /></div>

                                                            <div> <h6>
                                                                Cash on Delivery
                                                            </h6>

                                                                <p className="mb-0 text-muted">
                                                                    Pay when you receive your order
                                                                </p></div>

                                                        </div>

                                                    </div>
                                                    {(onLinePay ? '' : <span className={style.defaultBadge}>
                                                        Default
                                                    </span>)}


                                                </div>
                                            </label>
                                            <label
                                                onClick={() => setOnLinePay(true)}
                                                className={` mb-3 ${(onLinePay ? style.active : '')} ${style.addressCard}`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="address"
                                                />



                                                <div className="d-flex justify-content-between align-items-start">

                                                    <div className="d-flex align-items-center gap-3">

                                                        <div className={style.radioCircle}></div>

                                                        <div className='d-flex align-items-center gap-3'>
                                                            <div  >
                                                                <img className={`${style.iconsStyleVisa}`} src={visaImg} alt="" /></div>

                                                            <div> <h6>
                                                                Online Payment
                                                            </h6>

                                                                <p className="mb-0 text-muted">
                                                                    Pay securely with your card
                                                                </p></div>

                                                        </div>

                                                    </div>

                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    <button type="submit" onClick={placeOrderFormik.handleSubmit} className="btn btn-primary w-100 m-auto d-block my-5">
                                        Place Order
                                    </button>

                                </>
                                :



                                <div className={`${style.cardStyle} py-3`}>
                                    <h3>Shipping Address</h3>
                                    <form action="" className={` d-flex flex-column gap-3`}  onSubmit={CheckOutFormick.handleSubmit}>
                                        <div>
                                            <label htmlFor="name" >Full name</label>
                                            <input type="text" onBlur={CheckOutFormick.handleBlur} onChange={CheckOutFormick.handleChange} className='form-control' id='name' name='name' placeholder="" />

                                            {(CheckOutFormick.errors.name && CheckOutFormick.touched.name ? <div className="alert alert-danger mt-3" role="alert">
                                                {CheckOutFormick.errors.name}
                                            </div> : '')}



                                        </div>
                                        <div>

                                            <label htmlFor="details" >Full address</label>

                                            <input type="text" onBlur={CheckOutFormick.handleBlur} onChange={CheckOutFormick.handleChange} className='form-control' id='details' name='details' placeholder="Street address, building number, apartment..." />

                                            {(CheckOutFormick.errors.details && CheckOutFormick.touched.details ? <div className="alert alert-danger mt-3" role="alert">
                                                {CheckOutFormick.errors.details}
                                            </div> : '')}
                                        </div>
                                        <div>

                                            <label htmlFor="city" >City name</label>

                                            <select className="form-select shadow-sm rounded-3 py-2" onChange={CheckOutFormick.handleChange} onBlur={CheckOutFormick.handleBlur} id="city" name="city">
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
                                            {(CheckOutFormick.errors.city && CheckOutFormick.touched.city ? <div className="alert alert-danger mt-3" role="alert">
                                                {CheckOutFormick.errors.city}
                                            </div> : '')}
                                        </div>

                                        <div>



                                            <label htmlFor="phone" >Phone</label>
                                            <input type="text" onBlur={CheckOutFormick.handleBlur} onChange={CheckOutFormick.handleChange} className='form-control' id='phone' name='phone' placeholder="01234567891" />
                                            {(CheckOutFormick.errors.phone && CheckOutFormick.touched.phone ? <div className="alert alert-danger mt-3" role="alert">
                                                {CheckOutFormick.errors.phone}
                                            </div> : '')}
                                        </div>
                                        <div>


                                            <button type='submit ' className='btn btn-primary w-100'>Save address</button>
                                        </div>


                                    </form>



                                </div>)}
                        </div>
                    </div>

                    <div className='col-lg-5 col-md-5 col-12'>
                        <div className={`${style.cardStyle} `}>
                            <h3>Order Summary</h3>
                            <hr />
                            <div className={`${style.orderSymmaryScrool}`}>
                                {allProduct.length > 0 ?
                                    allProduct.map((val, index) => {
                                        return <div key={val._id
                                        } className={`${style.itemInSummary} d-flex justify-content-between`}>
                                            <div className='d-flex justify-content-start gap-3'>
                                                <div className='w-25'>
                                                    <img className='w-100' src={val.product.imageCover} alt="" />
                                                </div>
                                                <div>
                                                    <div>
                                                        <h5>{(val.product.title.length > 13 ? val.product.title.slice(0, 15) + '...' : val.product.title)}</h5>
                                                        <h6 className='grayColor'>brand: <span>{val.product.brand.slug}</span></h6>
                                                        <h6 className='grayColor'>QTY: <span>{val.count}</span></h6>
                                                    </div>

                                                </div>
                                            </div>

                                            <h5>{val.price}$</h5>
                                        </div>
                                    })
                                    : ''}


                            </div>



                            <div className='d-flex justify-content-between   pt-3'>
                                <div className='d-flex gap-3 align-items-baseline'>
                                    <h3>Total</h3>
                                    <p className='grayColor'>Include Tax and Delevery</p>
                                </div>
                                <h3>{totalPriceWithTax}$</h3>
                            </div>

                            <p className={`${style.secureInfo} d-flex align-items-center gap-1  grayColor`}><FaLock />
                                Your payment information is secure</p>

                        </div>
                    </div>
                </div>
            </div>
        </>)}</div> 
    )
}
