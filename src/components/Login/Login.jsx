import React, { useContext, useState } from 'react'
import style from './Login.module.css'
import { FiUser } from 'react-icons/fi'
import { MdLocalOffer, MdOutlineEmail } from 'react-icons/md'
import { TbPassword } from 'react-icons/tb'
import { Link, useNavigate } from 'react-router'
import { BiGift, BiSupport } from 'react-icons/bi'
import * as Yup from "yup"
import { AiOutlineSafety } from "react-icons/ai";
import { CiDeliveryTruck } from "react-icons/ci";
import { FaRegStar } from "react-icons/fa";
import { useFormik } from 'formik'
import axios from 'axios'
import { BaseUrl } from '../utils/baseUrl'
import { toast, ToastContainer } from 'react-toastify';
import { storeContext } from '../../context/StoreContext'
import { IoEyeOff, IoEye } from "react-icons/io5";
import { IoArrowBackSharp } from "react-icons/io5";
import { header } from 'motion/react-client'

export default function Login() {


  let validationSchema = Yup.object(
    {
      email: Yup.string().email().required(),
      password: Yup.string().matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character').required(),
    }

  )

  let navigate = useNavigate()
  const [Loading, setLoading] = useState(false)


  const [togleForPassReset, setTogleForPassReset] = useState(true)
  const [togleForCode, setTogleForCode] = useState(true)
  const [isReadyForUpdate, setIsReadyForUpdate] = useState(false)
  const [passVisability, setPassVisability] = useState(false)

  let { token, setToken, getUserCard, getUserWishlist } = useContext(storeContext)


  let loginFormik = useFormik({
    initialValues:
    {
      email: '',
      password: '',
      code: ''
    },

    validationSchema,

    onSubmit: (val) => {

      setLoading(true)
      axios.post(`${BaseUrl}/auth/signin`, val).then((data) => {

        setLoading(false)
        // console.log(data.data);

        if (data.status == 200) {

          localStorage.setItem('token', data.data.token)
          
          localStorage.setItem('user', JSON.stringify(data.data.user))


          toast.success(`welcome back ${data.data.user.name}`);
          setTimeout(() => {
            setToken(data.data.token)
            getUserCard(data.data.token)
            getUserWishlist(data.data.token)

            navigate('/')
          }, 3500);
        }
      }).catch((error) => {

        setLoading(false)
        if (error.response.status == 401) {
          const message = error?.response?.data?.message
          toast.error(message);
        }
      }

      )

    }
  })


  async function sendVerificationCode() {


    let email = loginFormik.values.email
    setLoading(true)
    // console.log(email);
    await axios.post(`${BaseUrl}/auth/forgotPasswords`, { email }).then((data) => {
      // console.log(data);
      setTogleForCode(!togleForCode)

      toast.success('Pls check your Email')


    }).catch((error) => {


      toast.error(error?.response?.data?.message)


    })
    setLoading(false)
  }


  async function confirmCode(resetCode) {



    setLoading(true)

    await axios.post(`${BaseUrl}/auth/verifyResetCode`, {
      resetCode: resetCode.trim()
    }).then((data) => {
      // console.log(data.data.status);
      if (data.data.status == 'Success') {
        
        loginFormik.setFieldValue("password","");
        loginFormik.setFieldValue("code","");
        setIsReadyForUpdate(true)
      }




    }).catch((error) => {


      toast.error(error?.response?.data?.message)


    })

    setLoading(false)

  }

  async function updatePassword() {



    if (loginFormik.errors.password) {
      return;
    } else {
      await axios.put(`${BaseUrl}/auth/resetPassword`,
        {
          "email": loginFormik.values.email,
          "newPassword": loginFormik.values.password
        }
      ).then((data) => {
        toast.success('Password Updated Successfully')
        defult()

      }).catch((error) => {


        toast.error(error?.response?.data?.message)


      })


    }


  }

  function defult()
 {
  setTogleForPassReset(true)
  setTogleForCode(true)
  setIsReadyForUpdate(false)
 }

  return (
    <>
      <ToastContainer toastStyle={{ marginTop: "50px" }} position="top-right" autoClose={3000} />

      <div className={` ${style.bgImg}`}>
        <div className="container pt-5">
          <div className="row pt-3">

            <div className={`${style.displayNone} col-lg-6 col-6 pt-5`}>
              <h1 className='fw-bold '>Welcome Back!</h1>
              <p className={``}>Login to your account and continue shopping<span className='d-block '> the best products</span></p>

              <div className='d-flex flex-column gap-3  pt-4 '>

                <div className='d-flex  align-items-center gap-3'>
                  <div className={`${style.icons} fs-3`}><AiOutlineSafety /></div>
                  <div>
                    <div className='fw-bold'>Secure & Safe</div>
                    <div>Your data is protected</div>

                  </div>


                </div>
                <div className='d-flex  align-items-center gap-3'>
                  <div className={`${style.icons} fs-3`}><CiDeliveryTruck /></div>
                  <div>
                    <div className='fw-bold'>Fast Delivery</div>
                    <div>Get your orders quicjly</div>

                  </div>
                </div>
                <div className='d-flex  align-items-center gap-3'>
                  <div className={`${style.icons} fs-3`}><FaRegStar /></div>
                  <div>
                    <div className='fw-bold'>Best Quality</div>
                    <div>Premium products only</div>

                  </div>
                </div>


              </div>

            </div>

            <div className="col-lg-6 col-md-6">
              <form onSubmit={loginFormik.handleSubmit} className={`${(togleForPassReset ? 'd-flex' : 'd-none')} d-flex flex-column gap-3 bg-white p-5 rounded-5`} action="">
                <div>
                  <h1>Log in</h1>
                  <p className='grayColor'>Welcome back! Please login to your account</p>
                </div>

                <div>
                  <label className='bg-transparent fs-5 fw-medium' htmlFor='email' >Email</label>
                  <div className='position-relative'>
                    <input type="email" onBlur={loginFormik.handleBlur} value={loginFormik.values.email} onChange={loginFormik.handleChange} id='email' name='email' placeholder='Enter your email' className='form-control py-3 ' />
                    <MdOutlineEmail className={`${style.iconsPostion} `} color='gray' />
                  </div>
                </div>

                {loginFormik.errors.email && loginFormik.touched.email ? <div className="alert alert-danger" role="alert">
                  {loginFormik.errors.email}
                </div> : null}


                <div>
                  <label className='bg-transparent fs-5 fw-medium' htmlFor='password' >Password</label>
                  <div className='position-relative'>
                    <input type={(passVisability ? 'text' : 'password')} onBlur={loginFormik.handleBlur} value={loginFormik.values.password}  onChange={loginFormik.handleChange}  id='password' name='password' placeholder='Enter your password' className='form-control py-3  ' />
                    <div className='cursor-pointer ' onClick={() => setPassVisability(!passVisability)} >
                      {(passVisability ? <IoEye className={`${style.iconsPostion} `} color='gray' /> : <IoEyeOff className={`${style.iconsPostion} `} color='black' />)}


                    </div>

                  </div>
                </div>
                {loginFormik.errors.password && loginFormik.touched.password ? <div className="alert alert-danger" role="alert">
                  {loginFormik.errors.password}
                </div> : null}

                <div onClick={() => setTogleForPassReset(!togleForPassReset)} className={`blueColor text-end fw-bold cursor-pointer`} >Forget password ?</div>
                <button type="submit" className={`btn btn-primary py-3`}>

                  {(!Loading ? 'Log In' : <div className="spinner-border text-light " role="status"></div>)}



                </button>



                <p className='text-center'>Dont have an account?  <Link className={`${style.removeDecoration} blueColor`} to="/register">Sign up</Link> </p>
              </form>

              <form className={`${(!togleForPassReset ? 'd-flex' : 'd-none')} d-flex flex-column gap-3 bg-white p-5 rounded-5`}>
                <h5 onClick={() => defult()} className='blueColor cursor-pointer'><IoArrowBackSharp /><span className='fs-6'> Back to login</span></h5>

                <div>
                  <label className='bg-transparent fs-5 fw-medium' htmlFor='email' >Email</label>
                  <div className='position-relative'>
                    <input type="email" onBlur={loginFormik.handleBlur} value={loginFormik.values.email} onChange={loginFormik.handleChange} readOnly={!togleForCode} id='email' name='email' placeholder='Enter your email' className='form-control py-3 ' />
                    <MdOutlineEmail className={`${style.iconsPostion} `} color='gray' />
                  </div>
                </div>
                {loginFormik.errors.email && loginFormik.touched.email ? <div className="alert alert-danger" role="alert">
                  {loginFormik.errors.email}
                </div> : null}




                <button onClick={() => sendVerificationCode()} type='button' className={`${togleForCode ? '' : 'd-none'} btn btn-primary`}>
                  {(!Loading ? 'Sent reset code' : <div className="spinner-border text-light " role="status"></div>)}





                </button>


                <div className={`${isReadyForUpdate ? 'd-none' : ''}`}>

                  <div className={`${!togleForCode ? '' : 'd-none'}`}>

                    <div className=''>
                      <input 
                        onChange={loginFormik.handleChange} type="text" id='code' name='code' placeholder='Enter code sent to your Email' className='form-control py-3 ' />

                    </div>
                  </div>

                  <button onClick={() => confirmCode(loginFormik.values.code)} type='button' className={`${!togleForCode ? '' : 'd-none'} btn btn-primary w-100 mt-3`}>


                    {(!Loading ? 'Confirm the code' : <div className="spinner-border text-light " role="status"></div>)}


                  </button>

                </div>


                <div className={`${isReadyForUpdate ? '' : 'd-none'}`}>
                  <div>
                    <label className='bg-transparent fs-5 fw-medium' htmlFor='password' >Enter the New Password</label>

                    <div className='position-relative mt-3'>
                      <input type={(passVisability ? 'text' : 'password')}  autoComplete="new-password" onBlur={loginFormik.handleBlur}   onChange={loginFormik.handleChange} id='password' name='password' autoComplete="new-password" placeholder='Enter the new password'  className='form-control py-3  ' />
                      <div className='cursor-pointer ' onClick={() => setPassVisability(!passVisability)} >
                        {(passVisability ? <IoEye className={`${style.iconsPostion} `} color='gray' /> : <IoEyeOff className={`${style.iconsPostion} `} color='black' />)}


                      </div>

                    </div>
                  </div>
                  {loginFormik.errors.password && loginFormik.touched.password ? <div className="alert alert-danger" role="alert">
                    {loginFormik.errors.password}
                  </div> : null}

                  <button onClick={updatePassword} type='button' className={`${!togleForCode ? '' : 'd-none'} btn btn-primary w-100 mt-3`}>


                    {(!Loading ? 'Update Password' : <div className="spinner-border text-light " role="status"></div>)}


                  </button>

                </div>


              </form>
            </div>

          </div>
        </div>
      </div>


    </>
  )
}
