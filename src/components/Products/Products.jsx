

import React, { useEffect, useState } from 'react'
import { BaseUrl } from '../utils/baseUrl';
import Product from '../Product/Product';
import axios from 'axios';
import '../SpinnerLoading/SpinnerLoading.css'
import { ToastContainer, toast } from 'react-toastify';
import style from "./Products.module.css"
export default function Products() {

  let[allProducts,setAllProduct]= useState([])
  let[activeCategory,setActiveCategory]= useState('1')
  let[laoding,setLaoding]= useState(true)

async function getAllProduct()
{
 
  const {data}=await axios.get(`${BaseUrl}/products`)
  setAllProduct(data.data)
  setTimeout(() => {
    setLaoding(false)
  }, 500);
   
}
useEffect(()=>
{
  
 setLaoding(true) 
  getAllProduct()
  console.log(activeCategory);
  
},[activeCategory])




const categories = [
  {name:"All-products",id:'1'},
  {name:"Women-Fashion",id:'6439d58a0049ad0b52b9003f'},
  {name:"Men-Fashion",id:'6439d5b90049ad0b52b90048'},
  {name:"Electronics",id:'6439d2d167d9aa4ca970649f'},
  
];

  return (
    <>
    <ToastContainer toastStyle={{ marginTop: "50px" }} autoClose={1000} />
  

<div className={`SpinnerScreen ${laoding ? '' : 'fadeOut'}`}>
        <span className='loader'></span>
</div>

<div className="container mt-5 pt-5">
   {/* <h2 className='mt-5 fw-bolder'>All products</h2> */}
      <div className="row">
        
     <div className='d-flex gap-3 flex-wrap '>
      {categories.map((val,index)=>{ 
        return <h4 key={index} id={val.name} onClick={()=>setActiveCategory(val.id)} className={`${style.items} ${activeCategory==val.id?style.active:''} cursor-pointer`}>{val.name}</h4>
    }
    )}
      {/* <h4 id='All-products' className={`${style.items} ${style.active} cursor-pointer`}>All products</h4>
      <h4 id='Women-Fashion' className={`${style.items} cursor-pointer`}>Women's Fashion</h4>
      <h4 id='Men-Fashion' className={`${style.items} cursor-pointer`}>Men's Fashion</h4>
      <h4 id='Electronics' className={`${style.items} cursor-pointer`}>Electronics</h4> */}
     </div>


    {allProducts.map((val,index)=>
    {
      // console.log(val.category._id);
      // console.log(activeCategory);
      
      if(activeCategory=='1')
      {
       return  <Product key={val.id}  oneProduct={val} index={index}/> 
      }else if(activeCategory==val.category._id){
        return  <Product key={val.id}  oneProduct={val} index={index}/> 
      }
      
    })
    
    
    
  }
    
    
    


    
    </div>
    </div>

   </>
  )
}