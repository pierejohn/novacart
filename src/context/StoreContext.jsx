
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { BaseUrl, BaseUrl2 } from "../components/utils/baseUrl";
import { head } from "motion/react-client";



export let storeContext = createContext(0)


export default function StoreContextprovider({ children }) {

  let [cardNumber, setCardNumber] = useState(0)
  let [wishlistNumber, setWishlistNumber] = useState(0)
  let [addressExist, setAddressExist] = useState(false)
  let [confirmedOrder, setConfirmedOrder] = useState(null)
  const [isLoadingForAllOrders, setIsLoadingForAllOrders] = useState(true)
  let [token, setToken] = useState(null)

  // useEffect(() => {
  //   if (localStorage.getItem('token')) {
  //     token = localStorage.getItem('token')
  //     getUserCard(token)
  //     getUserWishlist(token)   
  //     verifyToken(token)
  //   }

  //   setToken(localStorage.getItem('token'))
  // }, [])
  useEffect(() => {
    const savedToken = localStorage.getItem('token');

    if (savedToken) {
      setToken(savedToken);

      getUserCard(savedToken);
      getUserWishlist(savedToken);
      verifyToken(savedToken);
    }
  }, []);









  function addproduct(token, productId) {
    // console.log(token);
    // console.log(productId);

    return axios.post(`${BaseUrl2}/cart`, { productId }, { headers: { token } }).then((data) => {


      setCardNumber(data.data.numOfCartItems)
      return data

    }).catch((error) => {
      return error.name
    })
  }

  function getUserWishlist(token) {
    return axios.get(`${BaseUrl}/wishlist`, { headers: { token } }).then((data) => {
      setWishlistNumber(data.data.count)
      return data

    }).catch((error) => {
      return error.response?.data

    })
  }

  function deleteproductFromWishlist(token, productId) {
    return axios.delete(`${BaseUrl}/wishlist/${productId}`, { headers: { token } }).then((data) => {

      return data

    }).catch((error) => {
      return error.response?.data

    })
  }


  function addProductToWishlist(token, productId) {
    return axios.post(`${BaseUrl}/wishlist`, { productId }, { headers: { token } }).then((data) => {
      return data

    }).catch((error) => {
      return error.response?.data

    })
  }


  function getUserCard(token) {


    // console.log(token);
    return axios.get(`${BaseUrl2}/cart`, { headers: { token } })
      .then((data) => {
        setCardNumber(data.data.numOfCartItems)
        return data
      }).catch((error) => {
        return error.name
      })


  }


  function DeleteSpecificItem(token, id) {

    return axios.delete(`${BaseUrl2}/cart/${id}`, { headers: { token } })
      .then((data) => {
        // console.log(token);
        // console.log(id);
        return data
      }).catch((error) => {


        return error.response?.data
      })
  }


  function updateQty(token, id, count) {

    return axios.put(`${BaseUrl}/cart/${id}`, { count }, { headers: { token } })
      .then((data) => {
        // console.log(token);
        // console.log(id);
        return data
      }).catch((error) => {


        return error.response?.data
      })
  }


  function getCartNumberNow() {
    setCardNumber(cardNumber)
  }
  function changeCardNum() {
    setCardNumber(cardNumber + 1)
  }

  function deleteAllCart(token) {
    return axios.delete(`${BaseUrl}/cart`, { headers: { token } }).then((data) => {
      return data
    }).catch((error) => {
      return error.response?.data
    })
  }
  function addAddress(val) {
    return axios.post(`${BaseUrl}/addresses`, val, { headers: { token } }).then((data) => {

      return data

    }).catch((error) => {

      return error?.response?.data?.message

    })
  }

  function getAddress(token) {
    return axios.get(`${BaseUrl}/addresses`, { headers: { token } }).then((data) => {

      return data

    }).catch((error) => {

      return error?.response?.data?.message

    })
  }
  function verifyToken(token) {



    return axios.get(`${BaseUrl}/auth/verifyToken`, { headers: { token } }).then((data) => {

      // console.log(data.data.decoded.id)

      return data.data.decoded.id

    }).catch((error) => {

      return error?.response?.data?.message


    })

  }
  async function getUserOrders(token) {

    let id = await verifyToken(token)
    // console.log(id);

    return await axios.get(`${BaseUrl}/orders/user/${id}`, { headers: { token } }).then((data) => {
      setIsLoadingForAllOrders(false)
      return data

    }).catch((error) => {

      return error?.response?.data?.message


    })

  }



  return <storeContext.Provider value={{ cardNumber, changeCardNum, addproduct, getUserCard, DeleteSpecificItem, updateQty, deleteAllCart, token, setToken, setCardNumber, getUserWishlist, addProductToWishlist, wishlistNumber, setWishlistNumber, wishlistNumber, deleteproductFromWishlist, addAddress, getAddress, verifyToken, setConfirmedOrder, confirmedOrder, getUserOrders, isLoadingForAllOrders, setIsLoadingForAllOrders,addressExist, setAddressExist }}>
    {children}
  </storeContext.Provider>
}


