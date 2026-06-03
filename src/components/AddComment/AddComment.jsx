import React, { useState } from 'react'
import style from "./AddComment.module.css"
import { FaChevronRight, FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import { useFormik } from 'formik';
import * as Yup from "yup"
import { useParams } from 'react-router';
import axios from 'axios';
import { BaseUrl } from '../utils/baseUrl';
import { toast, ToastContainer } from 'react-toastify';
export default function AddComment(props) {

// console.log(props.productDetails.id);
let productId =props.productDetails.id
let validationSchema = Yup.object({
  review: Yup.string()
    .required("Review is required")
    .min(5, "Review must be at least 5 characters"),
});

function applayRating(reatingNum) {

  setNumberOfStars(reatingNum)
  setStarIsClicked(true)
commentFormik.setFieldValue("rating", reatingNum);



}

    const [numberOfStars, setNumberOfStars] = useState(0)
    const [starIsClicked, setStarIsClicked] = useState(false)
    const [isSubmeting, setIsSubmeting] = useState(false)
  
      let commentFormik = useFormik({
        initialValues:{
        review: "",
        rating: 0
      },
      validationSchema,
      onSubmit:((val)=>
      {

        addComment(val)
        
      })
     })
     const renderStarsForComments = (rating) => {
       const stars = [];
       const fullStars = Math.floor(rating);
       const hasHalf = rating % 1 !== 0;
     
       for (let i = 0; i < 5; i++) {
         if (i < fullStars) {
           stars.push(<FaStar onClick={() => applayRating(i + 1)
           } size={30} key={i} color="gold" />);
         } else if (i === fullStars && hasHalf) {
           stars.push(<FaStarHalfAlt onClick={() => applayRating(i + 1)
           } size={30} key={i} color="gold" />);
         } else {
           stars.push(<FaRegStar onClick={() => applayRating(i + 1)
           } size={30} key={i} color="#ccc" />);
         }
       }
     
       return stars;
     };

 async function addComment(val)
 {
    setIsSubmeting(true)
    let token =localStorage.getItem('token')
    if(token)
    {
        await axios.post(`${BaseUrl}/products/${productId}/reviews`,val,{headers:{token}}).then((data)=>
        {
            // console.log(productId);
            
            commentFormik.values.review=''
             setNumberOfStars(0)
              
            props.commentsList()
            // console.log(data)
            
        }).catch((error)=>
        {
            
            toast.error(error?.response.data.errors.msg)
            
            console.log(error?.response);
            
        })
    }else
    {
        console.log('go login pls')
        
    }
    setIsSubmeting(false)

    
 }

  return (
    <>
    
    <form onSubmit={commentFormik.handleSubmit}
              className={`${style.comment}`}>
              <div className={`d-flex gap-3 w-100`}>

                <div className={`${style.reviewerIcon}`}>
                  <IoPersonSharp size={30} className=' text-white' />
                </div>

                <div className='w-100'>
                  <h3>Write a review</h3>
                  <h4 className='grayColor'>Share your thoughts about this product with other customers</h4>
                  <div className='d-flex align-items-end gap-3 my-3 w-100'>
                    <div >
                      {starIsClicked ? <div
                      >{renderStarsForComments(numberOfStars)}</div> : [...Array(5)].map((_, index) => (
                        <FaRegStar size={30} key={index} onClick={() => applayRating(index + 1)
                        } color="#ccc" />

                      ))} </div>
                    <h6 className='grayColor'>Click to rate</h6>

                  </div>


                  <textarea value={commentFormik.values.review} onBlur={commentFormik.handleChange} onChange={commentFormik.handleChange} className='form-control bg-transparent w-100' name='review' rows={5} placeholder='Write your review'  ></textarea>

                  {commentFormik.errors.review && commentFormik.touched.review ? <div className="alert alert-danger mt-3" role="alert">
                  {commentFormik.errors.review}
                </div> : null}




                  <div>

                  </div>
                </div>

              </div>
              <div className='w-100  d-flex '>
                <button type='submit' className='btn btn-success ms-auto mt-3'>
                   {isSubmeting?<div className="spinner-border" role="status">
 
</div>:'Submit Review'} 
                    
                    
                    
                    
                    </button>
              </div>
            </form></>
  
  )
}
