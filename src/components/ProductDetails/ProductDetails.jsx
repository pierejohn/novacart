import React, { useContext, useEffect, useState } from 'react'
import * as bootstrap from "bootstrap";
import { BaseUrl } from '../utils/baseUrl'
import { Link, useParams } from 'react-router'
import axios from 'axios'
import '../SpinnerLoading/SpinnerLoading.css'
import { FaChevronRight, FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa6"
import { FaHeart } from "react-icons/fa";
import 'react-inner-image-zoom/lib/styles.min.css';
import InnerImageZoom from 'react-inner-image-zoom';
import style from './ProductDetails.module.css';
import { CiCreditCard2, CiDeliveryTruck } from 'react-icons/ci';
import { RiLoopRightFill } from 'react-icons/ri';
import { PiHeadsetThin } from 'react-icons/pi';
import { div, h5, img } from 'motion/react-client';
import { IoPersonSharp } from "react-icons/io5";
import { storeContext } from '../../context/StoreContext';
import { toast, ToastContainer } from 'react-toastify';
import { useFormik } from 'formik';
import AddComment from '../AddComment/AddComment';
import AllComments from '../AllComments/AllComments';
export default function ProductDetails() {



const [productDetails, setProductDetails] = useState({})
const [apiState, setApiState] = useState(false)
const [loading, setLoading] = useState(true)
const [loadingAddProduct, setLoadingAddProduct] = useState(false)
const [starIsClicked, setStarIsClicked] = useState(false)
const [reviews, setReviews] = useState([])

let [cardNumber, setCardNumber] = useState(1)
let [mainImg, setMainImg] = useState(null)
let [discoundPrestentage, setDiscoundPrestentage] = useState(0)


let { addproduct, addProductToWishlist, setWishlistNumber } = useContext(storeContext)

function Stars() {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    return <FaRegStar size={30}  key={i} color="#ccc" />
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


    
   

async function addToWishlist(productId) {
  let token = localStorage.getItem('token')
  if (token) {
    let response = await addProductToWishlist(token, productId)

    if (response.status == 200) {
      // console.log(response);
      setWishlistNumber(response.data.data.length)
      toast.success(`${response.data.message}`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,

      });

    }





  } else {
    console.log('login first');

  }
}

async function addToCart(productId) {
  setLoadingAddProduct(true)
  let token = localStorage.getItem('token')
  if (token) {
    let response
    for (let index = 0; index < cardNumber; index++) {

      response = await addproduct(token, productId)
    }

    if (response.status == 200) {
      // console.log(response);
      toast.success(`${response.data.message}🛒`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,

      });

    }

    setLoadingAddProduct(false)

  } else {
    toast.error(`please login first`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,

    })
    setLoadingAddProduct(false)

  }
}


function plusProduct() {
  if (cardNumber < quantity) {

    setCardNumber(++cardNumber)
  }
}
function minusProduct() {
  if (!cardNumber == 0) {

    setCardNumber(--cardNumber)
  }


}

const params = useParams()

useEffect(() => {
  GetSpecificProductDetails()
 
  // console.log(productDetails);

}, [])
useEffect(() => {
  if (productDetails?.id) {
    commentsList();
  }
  // console.log(productDetails);

}, [productDetails.id])



useEffect(() => {

  // console.log(productDetails);
  if (productDetails.priceAfterDiscount) {
    getDiscountPercent(productDetails.price, productDetails.priceAfterDiscount)
  }
}, [productDetails])



async function GetSpecificProductDetails() {

  const specificProductId = params.productId

  try {

    const { data } = await axios.get(
      `${BaseUrl}/products/${specificProductId}`
    )

    setProductDetails(data.data)

  } catch (error) {

    console.log(error)
    setApiState(false)

  } finally {

    setTimeout(() => {
      setLoading(false)
    }, 300)

  }
}


function changeMainImg(val) {

  setMainImg(val)

}
function getDiscountPercent(oldPrice, newPrice) {
  setDiscoundPrestentage(Math.round(
    ((oldPrice - newPrice) / oldPrice) * 100
  ))


}








let { imageCover, title, ratingsAverage, ratingsQuantity, quantity,
  price, description, images, priceAfterDiscount = null } = productDetails
let prandName = productDetails?.brand?.slug

 async function commentsList() {
  
  
        await axios.get(`${BaseUrl}/products/${productDetails.id}/reviews`).then((data) => {
            // console.log(data.data.data);
            setReviews(data.data.data)
        }).catch((error) => {
            console.log(error.response.data);
        })    
    }




// console.log(priceAfterDiscount);

// console.log(productDetails);
return (

  <>
    <ToastContainer toastStyle={{ marginTop: "50px" }} autoClose={1000} />
    <div className={`SpinnerScreen ${loading ? '' : 'fadeOut'}`}>
      <span className='loader'></span>
    </div>
    {
      apiState ? (

        <div className='container mt-5'>
          <h1>Error</h1>
          <p>Product not found</p>
        </div>

      ) : (
        <div className='container mt-5 pt-5 user-select-none'>
          <div className='d-flex gap-2'>
            < Link className={` ${style.categoryLink}`} to='/products' >
              <h6 className='grayColor'>{productDetails?.category?.slug}</h6>

            </Link>
            <h6 className='grayColor'> <FaChevronRight /></h6>
            <h6 className='grayColor'>{title}</h6>

          </div>
          <div className="row mt-4 ">
            <div className="col-lg-6">
              <div className="row">
                <div className='col-lg-1 col-md-1 col-2 d-flex flex-column gap-2'>
                  {
                    images?.map((val, index) => {
                      return <img className={`${style.allProductImges} w-100`} key={index} onMouseEnter={() => changeMainImg(val)} src={val} />
                    })
                  }

                </div>
                <div className="col-lg-11 col-md-11 col-10">
                  <InnerImageZoom
                    src={mainImg || imageCover}
                    zoomSrc={mainImg || imageCover}
                    className={style.zoomImage}
                  />
                  {/* <img src={(mainImg==null?imageCover:mainImg)} className='w-100' alt="" /> */}

                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <h6 className='grayColor'>{prandName}</h6>
              <h1>{title}</h1>

              <p className='d-flex align-items-center gap-2'>

                {renderStars(ratingsAverage)}
                <span className='fw-bolder'>{ratingsAverage}</span>
                <span className={`grayColor`}>({ratingsQuantity} reviews)</span>
                <span className='ms-auto fw-bolder inStockBg'>{(quantity > 0 ? "In Stock" : "Out of Stouck")}</span>
              </p>
              <div className='d-flex flex-column gap-1 align-items-start'>
                <div className='d-flex gap-3'>
                  {(discoundPrestentage == 0 ? null : <h3 className='text-danger'>{discoundPrestentage}%</h3>)}

                  <h2 className='blueColor'>${
                    (priceAfterDiscount == null) ? price : priceAfterDiscount



                  }

                  </h2>
                </div>
                {
                  (priceAfterDiscount == null) ? null :
                    <div className='d-flex'>
                      <h5 className={`grayColor `}>List Price:</h5>
                      <h5 className={`grayColor  ${style.discoundNumber}`}>${price}</h5>
                    </div>




                }

              </div>
              <p className=' '>{description}</p>

              <div className={`${style.addQuantatiToCard} d-flex flex-column gap-3`}>

                <h4 className={`user-select-none ${style.widthFilContent}`}  >Quantity</h4>



                <div className='d-flex rounded-3'>
                  <div className={`rounded-start-3 ${style.addAndSubtract}`} onClick={() => minusProduct()}  ><FaMinus color='gray' /></div>

                  <h6 className={`${style.cardNumber} grayColor`}>{cardNumber}</h6>
                  <div className={`rounded-end-3 ${style.addAndSubtract}`} onClick={() => plusProduct()} ><FaPlus color='gray' /></div>



                </div>
                <div className='d-flex gap-3'>
                  <button onClick={() => addToCart(productDetails.id)} className='btn btn-primary w-50 p-3'>

                    {(loadingAddProduct ? <div className="spinner-border text-white" role="status"></div> : 'Add To Card')}





                  </button>
                  <button onClick={() => addToWishlist(productDetails.id)} className={`btn btn-outline-secondary p-3 ${style.heartBtn}`}>
                    <FaHeart className='fs-4' />
                  </button>

                </div>


                <div className={`row bg-transparent shadow rounded-3 mt-5`} data-wow-delay="0.5s">
                  <div className="col-lg-6 col-md-6 col-sm-12 d-flex py-3">

                    <div className='w-100 d-flex justify-content-center align-items-center gap-3'>
                      <div className={`${style.icons} fs-1`}><CiDeliveryTruck /></div>
                      <div className='d-flex flex-column'>
                        <div >Free Shiping</div>
                        <div>on order over $50</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 d-flex py-3">

                    <div className={`${style.borderLeft} w-100 d-flex justify-content-center align-items-center gap-3 `}>
                      <div className={`${style.icons} fs-1`}><RiLoopRightFill /></div>
                      <div className='d-flex flex-column'>
                        <div>Easy Return</div>
                        <div>30 day return policy</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='my-5'>
            <h2 className='mt-5'>Customer Reviews</h2>
            <h5 className='mb-5 grayColor'>See what our customers are saying about this product</h5>
            <AddComment productDetails={productDetails} commentsList={commentsList} />



            <AllComments productDetails={productDetails} commentsList={commentsList} reviews={reviews}/>

          </div>

        </div>

      )
    }

  </>
)
}