import React, { useEffect } from 'react'
import { NavLink, useLocation, useParams } from 'react-router';
import { FaArrowLeft } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
import { GoPerson } from "react-icons/go";
import { CiCreditCard1 } from "react-icons/ci";
import ErrorPage from '../ErrorPage/ErrorPage'
import style from './SpacificOrderDetails.module.css'

export default function SpacificOrderDetails() {

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, []);
    let location = useLocation()
    let parms = useParams()
    let order = location.state
    // console.log(parms.OrderId);
    
    if (!order) {
        return (<ErrorPage/>)
    }
    let { createdAt, isDelivered, isPaid, paymentMethodType, shippingAddress, shippingPrice, taxPrice, totalOrderPrice, user } = order
    let priceBeforeTaxandDelivery = totalOrderPrice - (taxPrice + shippingPrice)
    let { city, details } = shippingAddress
    let { email, name, phone } = user

    // log(order.id==)




    return (
        <div className='container mt-5'>

            <NavLink to={'/settings/allOrders'} className='d-flex align-items-center gap-3 greenColor cursor-pointer text-decoration-none' ><FaArrowLeft /> <span>Back to Orders</span></NavLink>
            <h2 className='pt-3'>Order #{parms.OrderId}</h2>
            <h6 className='grayColor'>Placed on May {createdAt.slice(0, 10)} at {createdAt.slice(11, 16)} </h6>

            <div className="row">

                <div className='col-lg-8 mb-5'>
                    <div className={`${style.orderItems} `}>

                        <div className={`${style.orderItem}`} >

                            <div className={style.productInfo}>


                                <h5>

                                    OrderItems({order.cartItems.length})
                                </h5>

                            </div>



                        </div>
                        {order.cartItems.map((item) => (

                            <div className={style.orderItem} key={item._id}>

                                <div className={style.productInfo}>
                                    <img src={item.product.imageCover} alt="" />

                                    <div>
                                        <h5>{item.product.title}</h5>
                                        <h6 className='grayColor'>Brand {item.product.brand.name}</h6>
                                        <div className='d-flex gap-2 align-items-baseline'>
                                            <FaStar color='gold' />
                                            <div className='grayColor'>{item.product.ratingsAverage}</div>
                                            <div className='grayColor'> ({item.product.ratingsQuantity})</div>



                                        </div>
                                    </div>

                                </div>

                                <div className={style.itemData}>
                                    <span>Price: {item.price}$</span>
                                    <span>Qty: {item.count}</span>
                                    <span>Total: {item.price * item.count}$</span>
                                </div>

                            </div>

                        ))}
                    </div>
                </div>
                <div className='col-lg-4'>
                    <div className='col-lg-12 mb-3'>
                        <div className={`${style.orderItems} p-3`} >
                            <h5>Order Summary</h5>
                            <div className={'grayColor d-flex flex-column gap-3 border-bottom pb-3'}>
                                <div className='d-flex justify-content-between '>
                                    <div>SubTotal</div>
                                    <div>{priceBeforeTaxandDelivery}$</div>
                                </div>
                                <div className='d-flex justify-content-between'>
                                    <div>Shipping Fee</div>
                                    <div>{shippingPrice}$</div>
                                </div>
                                <div className='d-flex justify-content-between'>
                                    <div>Tax (VAT)</div>
                                    <div>{taxPrice}$</div>
                                </div>



                            </div>
                            <div className=' d-flex justify-content-between my-3'>
                                <h5>Total</h5>
                                <h5 className='greenColor'>{totalOrderPrice}$</h5>
                            </div>
                            <div className={`${style.payAndDelState}`}>
                                <div className=' d-flex justify-content-between my-3'>
                                    <h6 className='grayColor'>Payment Status:</h6>
                                    <h6 className={`${style.deliverAndPayStatus}`} >
                                        {(isPaid ? 'Paied' : 'Not Paied')}

                                    </h6>
                                </div>
                                <div className=' d-flex justify-content-between my-3'>
                                    <h6 className='grayColor'>Delivery Status:</h6>
                                    <h6 className={`${style.deliverAndPayStatus}`} >
                                        {(isDelivered ? 'Deliveried' : 'Not Deliveried')}

                                    </h6>
                                </div></div>
                        </div>
                    </div>


                    <div className='col-lg-12 mb-3'>
                        <div className={`${style.orderItems} p-3 d-flex gap-3`} >

                            <div className={`${style.iconBox}`}>
                                <CiLocationOn className={`${style.icon} greenColor`} />

                            </div>
                            <div >
                                <h5 className='pb-3'>Shipping Address</h5>
                                <h6 className='grayColor'>{city}</h6>
                                <h6 className='grayColor'>{details}</h6>
                                <h6 className='grayColor'>{city} , Egypte</h6>

                            </div>
                        </div>
                    </div>


                    <div className='col-lg-12 mb-3'>
                        <div className={`${style.orderItems} p-3 d-flex gap-3`} >

                            <div className={`${style.iconBox}`}>
                                <GoPerson className={`${style.icon} greenColor`} />

                            </div>
                            <div >
                                <h5 className='pb-3'>Custommer Information</h5>
                                <h6 className='grayColor'>{name}</h6>
                                <h6 className='grayColor'>{email}</h6>
                                <h6 className='grayColor'>{phone}</h6>

                            </div>
                        </div>
                    </div>

                    <div className='col-lg-12 mb-3'>
                        <div className={`${style.orderItems} p-3 d-flex gap-3`} >

                            <div className={`${style.iconBox}`}>
                                <CiCreditCard1 className={`${style.icon} greenColor`} />

                            </div>
                            <div >
                                <h5 className='pb-3'>Payment Method</h5>
                                <h6 className='grayColor'>{paymentMethodType} on Delivery</h6>


                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
