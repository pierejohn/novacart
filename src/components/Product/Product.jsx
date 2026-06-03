import React, { useContext, useState } from 'react'
import style from './Product.module.css'
import Rating from "react-rating";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { Link } from 'react-router';
import { h3 } from 'motion/react-client';
import { storeContext } from '../../context/StoreContext';
import { ToastContainer, toast } from 'react-toastify';

export default function Product(props) {

 let StoreContext= useContext(storeContext)
const [activeCard, setActiveCard] = useState(null);
async function addproduct(productId){

  let token=localStorage.getItem('token')
  if(token)
  {
    let response= await StoreContext.addproduct(token,productId)
    if(response.status==200)
    {
    // console.log(response);
    toast.success( `${response.data.message}🛒`, {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    
  });

    }
    
    
  }else
  {
    toast.error( `please login first`, {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    
  })
    
  }

}

  const { description, imageCover, title, price, id, ratingsAverage,priceAfterDiscount} = props.oneProduct
  const catName = props.oneProduct.category.name
 



  return (
    <>
    
      <div className={`col-xl-2  col-lg-3 col-md-4 col-sm-6 ${style.productCard} mt-4`} >
        <div className={` ${style.productCardIner}`}>
          <Link className={style.productLink} props={id}  to={`/products-details/${id}`}>
          <img className='w-100 my-2 ' src={imageCover} alt="" />
          <h6 className={`text-main ${style.catName}`}>{catName}</h6>
          <h5>{Array.from(title).length > 15 ? title.slice(0, 12) + '...' : title}</h5>
          <div className='d-flex align-items-baseline justify-content-between '>
            <h6 className={`text-main ${style.price}`}>
              <div className='d-flex align-items-center flex-wrap gap-2'>
              {(priceAfterDiscount==null)?<div>{`$ ${price}`}</div> : <div>{`$ ${priceAfterDiscount}`}</div> }
              {(priceAfterDiscount==null)?null:<div className={`grayColor  ${style.discoundNumber}`}>${price}</div>}
              
              </div>
              
              </h6>
            <h6 className="d-flex align-items-center gap-1 ">
              {/* {renderStars(ratingsAverage)} */}
              <FaStar color="gold" />
              {ratingsAverage}
            </h6>

          </div>
          <div className='w-100 position-relative'>
            <button onClick={(e) => {
              e.preventDefault();
             addproduct(id)

              
              }} className={`btn bg-main text-white w-100 ${style.addToCardBtn}`}> Add to Card</button>
            
          </div>
          </Link>

        </div>

      </div>

    </>
  )
}
