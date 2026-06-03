import React, { useContext, useEffect, useState } from 'react'
import { storeContext } from '../../context/StoreContext'
import { FaMinus, FaPlus } from 'react-icons/fa'
import { IoMdClose } from "react-icons/io";
import style from './Cart.module.css'
import { Link } from 'react-router';
export default function Cart() {

    const [allProducts, setAllProducts] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)
    const [totalTax, setTotalTax] = useState(0)
    const [totalPriceWithTax, setTotalPriceWithTax] = useState(0)
    const [removingAllProducts, setRemovingAllProducts] = useState(false)
    const [loading, setLoading] = useState(true)

    const [coundLoading, setCoundLoading] = useState({ id: null, is: false });
    const [removingId, setRemovingId] = useState(null);

    let { getUserCard, DeleteSpecificItem, updateQty, cardNumber, deleteAllCart } = useContext(storeContext)

    useEffect(() => {
        getCart()
    }, [])

    async function deleteCart() {

        let token = localStorage.getItem("token");

        if (token) {
            setRemovingAllProducts(true)
            // console.log(token);

            let response = await deleteAllCart(token)
            await getCart();





        } else {
            console.log('you are not loged');

        }
    }

    function plusProduct(id, count) {
        setCoundLoading({ id, is: true });

        ChangeQty(id, count + 1);
    }

    function minProduct(id, count) {
        setCoundLoading({ id, is: true });

        ChangeQty(id, count - 1);
    }

    async function ChangeQty(id, count) {
        let token = localStorage.getItem("token");

        if (token) {
            await updateQty(token, id, count);

            await getCart();


        } else {
            console.log('you are not loged');

        }
    }

    async function DeleteItem(id) {
        let token = localStorage.getItem("token");

        if (token) {
            setRemovingId(id);
            await DeleteSpecificItem(token, id);
            await getCart();



        } else {
            console.log('you are not loged');

        }
    }




    async function getCart() {
        let token = localStorage.getItem('token')
        if (token) {
            let response = await getUserCard(token)
            // console.log(response);
            
            // console.log(response.data.data.products.length);

            setTotalPrice(response.data.data.totalCartPrice)
            // setTotalTax((response.data.data.totalCartPrice * 0.14).toFixed(2))
            setTotalTax(20)
            setAllProducts(response.data.data.products)
            setTotalPriceWithTax((20+100 + response.data.data.totalCartPrice))
            // setTotalPriceWithTax((response.data.data.totalCartPrice))

            //    console.log(coundLoading);
            setCoundLoading({ id: null, is: false });
            //   console.log(allProducts);
            setRemovingAllProducts(false)
            setLoading(false)


        } else {
            console.log('you are not loged');

        }

    }

    return (

        <>
            <div className={`SpinnerScreen ${loading ? '' : 'fadeOut'}`}>
                <span className='loader'></span>
            </div>

            {(cardNumber == 0 ? <>

                <div className={`${style.emptyCartBg}`}>

                </div>
            </> : <div className={`${(removingAllProducts ? style.removing : '')} container mt-5 pt-5`}>
                {(cardNumber == 0) ? '' :
                    <>
                        <div className={` d-flex justify-content-between`}>
                            <h2>Your Cart</h2>
                            <button onClick={() => deleteCart()} className='btn text-danger'>Clear Cart</button>
                        </div>
                        <h5 className='grayColor'>{`${cardNumber} items`}</h5></>}


                <div className="row justify-content-between">
                    <div className={`   col-lg-7`} >


                        {
                            (allProducts.length == 0 ?
                                <h1>no product yet</h1>
                                :
                                <div>{allProducts.map((val, index) => {



                                    // console.log(val.product.title);
                                    // console.log(val);

                                    return <div key={index} id='val._id' className='  m-auto position-relative mt-3'>
                                        <div
                                            key={val._id}
                                            className={`${style.card} row p-4 ${removingId === val.product._id ? style.removing : ""
                                                }`}
                                        >

                                            <div className='col-lg-2 col-md-2 col-12'>
                                                <img className='w-100' src={val.product.imageCover} alt="" />
                                            </div>
                                            <div className='col-lg-8 col-md-8 col-6'>
                                                <h3>{val.product.title}</h3>
                                                <p className='grayColor'>{`brand ${val.product.brand.name}`}</p>
                                                <div className='d-flex rounded-3 mt-5'>
                                                    <div className={`rounded-start-3 ${style.addAndSubtract}`}
                                                        onClick={() => minProduct(val.product._id, val.count)} ><FaMinus /></div>

                                                    <h6 className={`${style.cardNumber} `}>



                                                        {/* {!coundLoading? (
                                                            <div className="spinner-border text-secondary" role="status"></div>
                                                        ) : (
                                                            val.count
                                                        )} */
                                                            (coundLoading.id == val.product._id && coundLoading.is ? <div className="spinner-border text-primary" role="status"></div> : val.count)



                                                        }


                                                    </h6>
                                                    <div className={`rounded-end-3 ${style.addAndSubtract} `} onClick={() => plusProduct(val.product._id, val.count)}  ><FaPlus /></div>



                                                </div>
                                            </div>
                                            <div className='col-lg-2 col-md-2 col-6'>
                                                <h3 className='mt-5'>{val.price}$</h3>
                                            </div>
                                        </div>
                                        <div onClick={() => DeleteItem(val.product._id)} className={`${style.deleteIcon}  row p-4 ${removingId === val.product._id ? style.removing : ""
                                            }`} >
                                            <IoMdClose />
                                        </div>
                                    </div>
                                })}</div>)

                        }


                    </div>
                    <div className={`${style.card} grayColor col-lg-4 d-flex flex-column gap-3  mt-3 p-5 fw-bold`}>
                        <h2 className='text-black'>Order Summaty</h2>
                        <div className='d-flex justify-content-between '>
                            <p>subtotal</p>
                            <p>{`${totalPrice} $`}</p>
                        </div>
                        <div className='d-flex justify-content-between'>
                            <p>Shipping</p>
                            <p>100$</p>
                        </div>
                        <div className='d-flex justify-content-between'>
                            <p>Tax</p>
                            <p>{`${totalTax} $`}</p>
                            {/* <p>0$</p> */}
                        </div>
                        <hr />
                        <div className='d-flex justify-content-between'>
                            <h3 className='text-black'>Total</h3>
                            <h3 className='text-black'>{`${totalPriceWithTax} $`}</h3>
                        </div>
                        <Link to={'/checkout'} className='btn btn-primary
                        '> Check Out</Link>

                    </div>
                </div>
            </div>)}

        </>
    )
}
