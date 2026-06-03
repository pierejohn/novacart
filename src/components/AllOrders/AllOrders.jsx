import React, { useContext, useEffect, useState } from 'react'
import { storeContext } from '../../context/StoreContext'
import style from './AllOrders.module.css'
import { GoDotFill } from "react-icons/go";
import { FaAngleRight } from "react-icons/fa6";
import { NavLink } from 'react-router';

export default function AllOrders() {


  let { getUserOrders, isLoadingForAllOrders, setIsLoadingForAllOrders } = useContext(storeContext)
  const [allUserOrders, setAllUserOrders] = useState([])
  const [fourOrders, setFourOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [numberOfPages, setNumberOfPages] = useState(0)
  const [startAndEnd, setstartAndEnd] = useState([{ start: 0 }, { end: 0 }])
const [activePage, setActivePage] = useState(1)
const [numberOfProductInPagination, setnumberOfProductInPagination] = useState(5)

  async function getAllUserOrders(token) {
    let response = await getUserOrders(token)
    setAllUserOrders(response.data)

    // console.log(response);

  }
  useEffect(() => {
    getFourOrders()
    setNumberOfPages(Math.ceil(allUserOrders.length / numberOfProductInPagination))
  }, [allUserOrders])

  function getFourOrders(start = 0, end = numberOfProductInPagination) {
setActivePage(end/numberOfProductInPagination);

    setstartAndEnd([{ start: start }, { end: end }])


    setFourOrders(allUserOrders.slice(start, end))
    setLoading(false)
  }

  function prevPage() {

    if (startAndEnd[0].start - numberOfProductInPagination == -numberOfProductInPagination) {
setActivePage(numberOfPages)
 getFourOrders((numberOfPages - 1) * numberOfProductInPagination,numberOfPages * numberOfProductInPagination)
    } else {
      setActivePage(activePage-1)
      getFourOrders(startAndEnd[0].start - numberOfProductInPagination, startAndEnd[1].end - numberOfProductInPagination)
    }


  }
  function nextPage() {
    if (startAndEnd[1].end > allUserOrders.length) {
      setActivePage(1)
      getFourOrders()
    } else {
      setActivePage(activePage+1)

      getFourOrders(startAndEnd[0].start + numberOfProductInPagination, startAndEnd[1].end + numberOfProductInPagination)
    }

  }

  useEffect(() => {
    setIsLoadingForAllOrders(true)

    let token = localStorage.getItem('token')
    if (token) {
      getAllUserOrders(token)

    }

  }, [])
  return (<>
  {/* allUserOrders.length == 0 */}
    <div className={`SpinnerScreen ${loading ? '' : 'fadeOut'}`}>
      <span className='loader'></span>
    </div>
    <div className=' container px-5 mt-5'>

      {/* {console.log(allUserOrders)
      } */}
      <h2>My Orders</h2>
      <h6 className='grayColor '>Track,view and manage your orders</h6>
      <h6 className='text-primary'>You have made ({allUserOrders.length}) order</h6>
      <h6 className='text-primary'> ({numberOfPages}) page </h6>
      <div  className={`${style.displayNoneInSmallScreen} row border p-3`}>
        <div className="col-lg-3  col-md-3  col-3">ORDER</div>
        <div className="col-lg-2  col-md-2  col-2">DETAILS</div>
        <div className="col-lg-2  col-md-2  col-2">AMOUNT</div>
        <div className="col-lg-3  col-md-3  col-3">STATUS</div>
        <div className="col-lg-2  col-md-2  col-2 d-flex  justify-content-start">ACTION</div>
      </div>
<div className="m-auto w-100">
      {
        (!fourOrders.length > 0 ? '' :
          fourOrders.map((val, index) => {
            // console.log(val);

            return <div key={val.id} className={`${style.orderCart} row p-3`}>
              
              <div className="col-lg-3 col-md-3 col-12">
                <div className='row '>
                  <img className={`${style.imgSize} col-lg-4 col-md-4 col`} src={val?.cartItems[0].product.imageCover} alt="" />

                  <div className={`${style.text} col-lg-8 py-2`}>
                    <h6 className='fw-bold'>Order <span>#{val.id}</span></h6>
                    <h6 className='grayColor'>{val.createdAt.slice(0, 10)}</h6>
                    <h6 className='grayColor'>{val.cartItems.length} {(val.cartItems.length > 1) ? 'items' : 'item'} </h6>
                  </div>
                </div>

              </div>
              <div className={`${style.displayNoneInSmallScreen} col-lg-2  col-md-2  col-6 flex-column d-flex align-items-start justify-content-center`}>
                <h6> {val?.cartItems[0].product.title}</h6>
                <h6 className='grayColor'> <span>Brand</span> {val?.cartItems[0].product.brand.slug}</h6>
                <h6 className='grayColor'> <span>Qty</span> {val?.cartItems[0].count}</h6>

              </div>
              <div className="col-lg-2  col-md-2  col-6 flex-column d-flex align-items-start justify-content-center">
                <h4 >{val.totalOrderPrice}$</h4>
                <h6 className={`${(val.isPaid ? `${style.paid}` : `${style.notPaid}`)}`}>{(val.isPaid ? 'Paid' : 'Not Yet paid')}</h6>


              </div>
              <div className={`${style.displayNoneInSmallScreen} col-lg-3  col-md-3  col-4 d-flex align-items-center justify-content-start`} >
                {(val.isDelivered ? <h6 className={`${style.delivered}`}><GoDotFill color='blue' /> Its Deliver</h6> : <h6 className={`${style.notDelivered}`}> <GoDotFill color='red' /> Its not Deliverd yet</h6>)}

              </div>
              <div className="col-lg-2  col-md-2  col-6 d-flex align-items-center justify-content-start">
                <div className='d-flex'>
                  <NavLink to={`spacificOrder/${val.id}`} state={val}  className={`${style.viewDetilsBtn} text-decoration-none`}>View Details</NavLink>


                </div>
              </div>
            </div>
          }))
      }</div>

{allUserOrders.length > 0?<nav className=''>
        <ul className={`${style.myPagination} py-4`}>
          <li onClick={() => prevPage()} className="cursor-pointer py-2"><a className={`${style.myPrevAndNext}`}>Previous</a></li>
          {
            Array.from({ length: numberOfPages }).map((_, index) => (
              <li onClick={() => getFourOrders(((index + 1) * numberOfProductInPagination) - numberOfProductInPagination, (index + 1) * numberOfProductInPagination)} className='my-1' key={index}>
                
                
                
                <button className={`${style.paginationNum} ${(activePage==(index + 1)?style.activePage:'')} `}>
                  {index + 1}
                </button>
              </li>
            ))
          }

          <li className='cursor-pointer py-2' onClick={() => nextPage()} ><a className={`${style.myPrevAndNext}` }>Next</a></li>
        </ul>
      </nav>:""}
      



    </div>
  </>
  )
}
