import React, { useContext } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { storeContext } from '../../context/StoreContext';
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { HiOutlineClipboardList } from "react-icons/hi";
import { IoInformationCircleOutline } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { CiDeliveryTruck } from "react-icons/ci";
import ErrorPage from '../ErrorPage/ErrorPage.jsx';


import cashImg from '../../images/category/cashIMG2.png'
import style from './OrderConfirmed.module.css';


export default function OrderConfirmed() {

    let { confirmedOrder } = useContext(storeContext)
    let { orderId } = useParams()
    let createdAt, cartItems, id, shippingAddress
    let cartPrice, shippingPrice, taxPrice, totalOrderPrice

    if (confirmedOrder?.data?.data?._id == orderId) {
        console.log('hii');

        console.log(orderId);
        console.log(confirmedOrder?.data?.data);
        // console.log(confirmedOrder.data.pricing);
        ({ createdAt, cartItems, id, shippingAddress } = confirmedOrder?.data?.data);
        console.log(cartItems);


        ({ cartPrice, shippingPrice, taxPrice, totalOrderPrice } = confirmedOrder?.data?.pricing);
    } else {

    }

let navigate=useNavigate()
    return (

        <div className=''>
            {(confirmedOrder?.data?.data?._id == orderId ? <>
                <div className='container mt-5 pt-4'>
                    <div className='d-flex align-items-end gap-3'>
                        <div className={`${style.confirmIcon}`}><IoCheckmarkCircleOutline /></div>
                        <div>
                            <h1 >Order Confirmed!</h1>
                            <h5 className='grayColor'>Thanks you for your order, Your order has been placed successfully</h5>

                        </div>
                    </div>


                    <div className="row mt-4">
                        <div className="col-lg-7 col-md-7 col-12">
                            <div className={`${style.cartStyle} d-flex flex-column gap-4`}>
                                <div className='d-flex align-items-end gap-3'>
                                    <div className={`${style.listIcon}`}>< HiOutlineClipboardList /></div>
                                    <h4>Order Summery</h4>
                                </div>
                                <div className='d-flex flex-column gap-2'>
                                    <div className='d-flex justify-content-between'>
                                        <p className='grayColor'>Order Id</p>
                                        <p className='grayColor'>{orderId}</p>
                                    </div>
                                    <div className='d-flex justify-content-between'>
                                        <p className='grayColor'>Order date</p>
                                        <p className='grayColor'>{createdAt.slice(0, 10)}</p>
                                    </div>

                                </div>
                            </div>

                            <div className={`${style.cartStyle} d-flex flex-column gap-4 my-3`}>
                                <div className='d-flex align-items-end gap-3'>
                                    <div className={`${style.listIcon}`}>< FaLocationDot /></div>
                                    <h4>Shipping Address</h4>
                                </div>

                                <div className='d-flex flex-column'>
                                    <h6 className=''>{shippingAddress.city}</h6>
                                    <h6 className='grayColor'>{shippingAddress.details}</h6>
                                    <h6 className='grayColor'>{shippingAddress.city},Egypt</h6>
                                </div>



                            </div>
                            <div className={`${style.cartStyle} d-flex flex-column gap-4 `}>
                                <div className='d-flex align-items-end gap-3'>
                                    <div className='d-flex align-items-center justify-content-center'><img className={`${style.cashyIcon}`} src={cashImg} alt="" /></div>
                                    <h4>Shipping Address</h4>
                                </div>

                                <div className='d-flex flex-column'>
                                    <h6 className=''>Cash on Delivery</h6>
                                    <h6 className='grayColor'>Pay when you receive order</h6>

                                </div>
                                <div className={`${style.informcard} d-flex gap-3`} >
                                    <div className={`${style.informIcon}`}><IoInformationCircleOutline /></div>
                                    <div>
                                        <h5>Cash on Delivery</h5>
                                        <h6 className='grayColor'>Please have the exact amount when our delivery partner arrives</h6>

                                    </div>
                                </div>


                            </div>





                        </div>
                        <div className="col-lg-5 col-md-5 col-12">



                            <div className={`${style.cartStyle} `}>
                                <h3>Order Details</h3>
                                <div className={`${style.orderSymmaryScrool}`}>


                                    {cartItems.map((val, index) => {
                                        return <div key={val.product.id} className={`${style.itemInSummary} d-flex justify-content-between`}>
                                            <div className='d-flex justify-content-start gap-3'>
                                                <div className='w-25 '>
                                                    <img className='w-75' src={val.product.imageCover} alt="" />
                                                </div>
                                                <div>
                                                    <div>
                                                        {/* <h5>{(val.product.title.length > 13 ? val.product.title.slice(0, 15) + '...' : val.product.title)}</h5> */}

                                                        <h6 className='grayColor'>brand: <span>{val.product.brand.name}</span></h6>
                                                        <h6 className='grayColor'>QTY: <span>{val.count}</span></h6>
                                                    </div>

                                                </div>
                                            </div>
                                            <h5>{val.price}$</h5>
                                        </div>
                                    })}




                                </div>

                                <div className={`${style.itemInSummary} grayColor`} >
                                    <div className='d-flex justify-content-between mb-3'>
                                        <h6>Subtotal</h6>
                                        <h6>{cartPrice}$</h6>
                                    </div><div className='d-flex justify-content-between my-3'>
                                        <h6>Shiping</h6>
                                        <h6>{shippingPrice}$</h6>
                                    </div><div className='d-flex justify-content-between mt-3'>
                                        <h6>Tax</h6>
                                        <h6>{taxPrice}$</h6>
                                    </div>
                                </div>

                                <div className='d-flex justify-content-between my-3'>
                                    <h3>Total</h3>
                                    <h3>{totalOrderPrice}$</h3>
                                </div>
                                <div className={`${style.nextCard} d-flex gap-3`} >
                                    <div className={`${style.nextIcon} d-flex align-items-top`}><CiDeliveryTruck /></div>
                                    <div>
                                        <h5>Whats Next?</h5>
                                        <h6 className='grayColor '>you will receive a confirmation call shortly Your order will be diliverd within 2-3 bsiness days</h6>

                                    </div>
                                </div>
                                <Link to={'/'} className='btn btn-primary w-100 my-3'> Containue Shoping</Link>

                            </div>


                        </div>
                    </div>
                </div>
            </> : <ErrorPage />)}
        </div>


    )
}
