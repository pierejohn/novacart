import React, { useContext, useEffect, useState } from 'react'
import { storeContext } from '../../context/StoreContext'
import { FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { RiDeleteBin6Line } from "react-icons/ri";
import { CiShoppingCart } from "react-icons/ci";


import style from './Wishlist.module.css'
import { useNavigate } from 'react-router';
export default function Wishlist() {


    const [wishlistItems, setWishlistItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [deletingId, setDeletingId] = useState(0)
    let { getUserWishlist, setWishlistNumber, addproduct, deleteproductFromWishlist } = useContext(storeContext)
    let navigate = useNavigate()

    async function deleteFromWishlist(productId) {
        let token = localStorage.getItem('token')
        let response
        if (token) {
            setDeletingId(productId)
            response = await deleteproductFromWishlist(token, productId)
            getWishlist()
        } else {
            console.log('pls login firs');

        }



    }
    async function addProduct(productId) {
        let token = localStorage.getItem('token')
        let response
        if (token) {
            setDeletingId(productId)
            response = await addproduct(token, productId)
            deleteFromWishlist(productId)
        } else {
            console.log('pls login firs');


        }
    }

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalf = rating % 1 !== 0;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<FaStar key={i} color="gold" />);
            } else if (i === fullStars && hasHalf) {
                stars.push(<FaStarHalfAlt key={i} color="gold" />);
            } else {
                stars.push(<FaRegStar key={i} color="#ccc" />);
            }
        }

        return stars;
    };

    function dirctToPageInfo(id) {
        console.log(id);

        navigate(`/products-details/${id}`)
    }
    function getDiscountPercent(oldPrice, newPrice) {
        return Math.round(
            ((oldPrice - newPrice) / oldPrice) * 100
        )


    }

    async function getWishlist() {
        let token = localStorage.getItem('token')
        if (token) {
            let response = await getUserWishlist(token)
            // setWishlistNumber(response.data.data)
            // console.log(response.data.count);
            setWishlistNumber(response.data.count)
            setWishlistItems(response.data.data)
            setLoading(false)
        } else {
            console.log('pleas log in');

        }





    }

    useEffect(() => {


        getWishlist()
    }, [])
    return (
        <>

            <div className={`SpinnerScreen ${loading ? '' : 'fadeOut'}`}>
                <span className='loader'></span>
            </div>
            {(wishlistItems.length > 0 ? <div className="container mt-5 pt-5">
                <h1 className='fw-bolder'>My Wishlist({wishlistItems.length})</h1>
                <p className='grayColor'>Items you love,all in one place</p>
                {
                    // console.log(wishlistItems[10])

                }

                <div className="row">
                    {wishlistItems.map((val, index) => {

                        return <div onClick={() => dirctToPageInfo(val.id)} key={val.id
                        } className={`p-3 col-lg-3 col-md-4 col-sm-6 col-12 ${style.fullCard}  ${(deletingId === val.id ? style.fadeCard : '')}`}>  <div className={`${style.wishlistCard} `}>
                                <div className='position-relative'>
                                    <img className={`${style.wishlistImg}`} src={val.imageCover} alt="" />

                                    <p className={`${style.stockAvilabilty} inStockBg`}>In Stock</p>

                                </div>
                                <h5>{(val.title.length <= 15 ? val.title : val.title.slice(0, 15) + '...')}</h5>
                                <div className='d-flex gap-2'>
                                    <p>{renderStars('3')}</p>
                                    <p>4.5</p>
                                    <p>(128 reviews)</p>
                                </div>
                                {val.priceAfterDiscount ?
                                    <div className='d-flex gap-2 justify-content-between align-items-center'>
                                        <div className='d-flex align-items-center gap-4'>
                                            <h4 className='blueColor'>${val.priceAfterDiscount
                                            }</h4>
                                            <div className='position-relative'>
                                                <h5 className={`${style.priceBeforDiscound} grayColor`} >${val.price}</h5></div>
                                        </div>
                                        <h6 className={`${style.discoundText}`}>{getDiscountPercent(val.price, val.priceAfterDiscount
                                        )}% off</h6>
                                    </div> : <div className='d-flex gap-2 justify-content-between align-items-center'>

                                        <h4 className='blueColor'>${val.price}</h4>
                                    </div>}



                                <div className='d-flex gap-3'>
                                    <button onClick={(e) => {
                                        e.stopPropagation()
                                        addProduct(val.id)
                                    }
                                    } className='btn w-75 btn-primary '><CiShoppingCart />Add to Cart</button>
                                    <button onClick={(e) => {
                                        e.stopPropagation();
                                        deleteFromWishlist(val.id)
                                    }
                                    } className={`btn w-25 btn-white ${style.deleteBtn}`}><RiDeleteBin6Line /></button>
                                </div>
                            </div></div>
                    })}

                </div>

            </div> : <>

                <div className={`${style.bgImgNoWishlist}`}></div>

            </>)}

        </>
    )
}
