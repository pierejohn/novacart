import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import Slider from "react-slick"
import { BaseUrl } from '../utils/baseUrl'
import style from './CategorySlider.module.css'

export default function CategorySlider() {

  const [apiArr, setApiarr] = useState([])
  const [slidesToShow, setSlidesToShow] = useState(4)
  const sliderRef = useRef(null)

  function getSlidesToShow() {
    if (typeof window === "undefined") return 4

    const width = window.innerWidth

    if (width <= 500) return 2
    if (width <= 768) return 3
    if (width <= 1024) return 4
    return 6
  }

  const sliderSettings = {
    dots: false,
    infinite: apiArr.length > 1,
    speed: 300,
    slidesToShow,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false
  }

  async function getAllData() {
    const { data } = await axios.get(`${BaseUrl}/categories`)
    setApiarr(data.data)
  }

  useEffect(() => {
    getAllData()
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setSlidesToShow(getSlidesToShow())
    }

    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (apiArr.length > 0) {
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"))
        sliderRef.current?.slickGoTo(0)
      }, 100)
    }
  }, [apiArr])

  return (
    <>
      {apiArr.length > 0 && (
  <div className='container mt-5'>
    <Slider ref={sliderRef} {...sliderSettings}>
      {apiArr.map((val, index) => (
        <div key={val._id || index} className={style.slideItem}>

          <div className={style.card}>
            <img
              src={val.image}
              alt={val.name}
              className={style.carosilImg}
            />

            <p className={style.categoryText}>
              {val.name}
            </p>
          </div>

        </div>
      ))}
    </Slider>
  </div>
)}
    </>
  )
}