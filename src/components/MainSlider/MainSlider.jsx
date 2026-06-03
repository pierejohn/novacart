import React, { useEffect } from 'react'
import Slider from "react-slick";
import { WOW } from 'wowjs';
import style from './Mainslider.module.css'

import { IoSunny } from "react-icons/io5";
import { CiDeliveryTruck } from "react-icons/ci";
import { RiLoopRightFill } from "react-icons/ri";
import { CiCreditCard2 } from "react-icons/ci";
import { PiHeadsetThin } from "react-icons/pi";
import { motion } from "motion/react"


export default function MainSlider() {


  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,

  }


useEffect(() => {
   const wow = new WOW({
    live: false
  });
}, []);



  return (
    <>
      {/* <Slider {...settings} className='mt-3' autoplaySpeed={5000}>
        {allImgs.map((val, index) => {
          return <img src={val} alt="" />

        })}
      </Slider> */}
      <div className= {`${style.imgBgHome}`}>

        <div className='d-flex align-items-center justify-content-start h-100'>
          
          <div className="container p-5 d-flex flex-column min-vh-100">
            <div className={`${style.mainInSmallDev} row mt-5 wow animate__animated animate__fadeInUp`}>
              <div className="col-lg-6 col-md-9 col-sm-12 d-flex flex-column gap-3">

                <h5 className='d-flex text-main fw-semibold'>Summer Sale <IoSunny className='rating-color' /> </h5>
                <div>
                  <h2 className={`${style.mainText} fw-bolder `}>New Collection</h2>
                  <h2 className={`${style.mainTextDate} text-main fw-bolder`}>2024</h2>
                </div>
                <p className={`${style.descriptionP}`}>Discover the latest trends in fashion, electronics and more. Get up to <span className='text-main fw-bold'>50% off</span> on selected items</p>
                <div className='d-flex gap-3'>
                  <button className='btn btn-primary'> Shop Now</button>
                  <button className='btn btn-light'> Explore Deals</button>
                </div>
              </div>

            </div>
            <div className={`wow animate__animated animate__backInDown  row bg-white rounded shadow ${style.w100InLgw75inSm} ${style.homeInfo} ` } data-wow-delay="0.5s">
              <div className="col-lg-3 col-md-6 col-sm-12 d-flex py-3">

                <div className='w-100 d-flex justify-content-center align-items-center gap-3'>
                  <div className={`${style.icons}`}><CiDeliveryTruck /></div>
                  <div className='d-flex flex-column'>
                    <div>Free Shiping</div>
                    <div>on order over $50</div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-12 d-flex py-3">

                <div className= {`${style.borderLeft} w-100 d-flex justify-content-center align-items-center gap-3 `}>
                  <div className={`${style.icons}`}><RiLoopRightFill /></div>
                  <div className='d-flex flex-column'>
                    <div>Easy Return</div>
                    <div>30 day return policy</div>
                  </div>
                </div>

              </div>
              <div className="col-lg-3 col-md-6 col-sm-12 d-flex py-3">

                <div className= {`${style.borderLeft} ${style.featureBorderMdRemove} w-100 d-flex justify-content-center align-items-center gap-3`}>
                  <div className={`${style.icons}`}><CiCreditCard2/></div>
                  <div className='d-flex flex-column'>
                    <div>Secure Payment</div>
                    <div>100% secure payment</div>
                  </div>
                </div>

              </div>
              <div className="col-lg-3 col-md-6 col-sm-12 d-flex py-3 ">

                <div className= {`${style.borderLeft} w-100 d-flex justify-content-center align-items-center gap-3 `}>
                  <div className={`${style.icons}`}><PiHeadsetThin/></div>
                  <div className='d-flex flex-column'>
                    <div>Free Shiping</div>
                    <div>on order over $50</div>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>



      </div>

    </>
  )
}
