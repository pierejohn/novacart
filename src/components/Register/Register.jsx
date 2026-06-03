import React, { useState } from 'react'
import style from './Register.module.css'
import { FiUser } from "react-icons/fi";
import { MdOutlineEmail } from "react-icons/md";
import { TbPassword } from "react-icons/tb";
import { Link, useNavigate } from 'react-router';
import { MdLocalOffer } from "react-icons/md";
import { FaPhone } from "react-icons/fa";
import { BiGift } from "react-icons/bi";
import { BiSupport } from "react-icons/bi";
import { useFormik } from 'formik';
import * as Yup from "yup"
import { BaseUrl } from '../utils/baseUrl';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

import { IoEyeOff,IoEye } from "react-icons/io5";


export default function Register() {

const [passVisability, setPassVisability] = useState(false)
const [rePassVisability, setRePassVisability] = useState(false)
  const [Loading, setLoading] = useState(false)
  let navigate = useNavigate()
  let validationSchema = Yup.object(
    {
      name: Yup.string().min(3).max(15).required(),
      email: Yup.string().email().required(),
      password: Yup.string().matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character').required(),
      rePassword: Yup.string().oneOf([Yup.ref('password')], 'Password must matches').required(),
      phone: Yup.string()
        .matches(/^01[0125][0-9]{8}$/, 'Please check the number')
        .required()
    }
  )



  let registerFormik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      rePassword: '',
      phone: ''
    },

    validationSchema,


    onSubmit: (val) => {
      setLoading(true)
      console.log(val);
      axios.post(`${BaseUrl}/auth/signup`, val).then((data) => {
        if (data.status === 201) {
          setLoading(false)
          toast.success("Account created successfully You will be navigate to Login 🎉");
          setTimeout(() => {
            navigate('/login')
          }, 3500);

        }

      }).catch((error) => {

let message=''

        if (error.response.data.message == 'fail') {
           message = error.response.data.errors.msg

        } else {
           message = error.response.data.message
        }




        setLoading(false)
        toast.error(message);



      })


    }



  })




  return (
    <>
      <ToastContainer toastStyle={{ marginTop: "50px" }} position="top-right"  autoClose={3000} />

      <div className={` ${style.bgImg} `}>
        <div className="container pt-5 ">
          <div className="row pt-3">
            <div className={`${style.displayNone} col-lg-6 col-md-6 pt-5`}>
              <h1 className='fw-bold '>Create Account</h1>
              <p className={``}>Join FreshCart today and get access to exclusive <span className='d-block '> deals & offers</span></p>

              <div className='d-flex flex-column gap-3  pt-4 '>

                <div className='d-flex  align-items-center gap-3'>
                  <div className={`${style.icons} fs-3`}><MdLocalOffer /></div>
                  <div>
                    <div className='fw-bold'>Exlusive Deals</div>
                    <div>Spcial offers for members</div>

                  </div>


                </div>
                <div className='d-flex  align-items-center gap-3'>
                  <div className={`${style.icons} fs-3`}><BiGift /></div>
                  <div>
                    <div className='fw-bold'>Member benfits</div>
                    <div>earn points & rewards</div>

                  </div>
                </div>
                <div className='d-flex  align-items-center gap-3'>
                  <div className={`${style.icons} fs-3`}><BiSupport /></div>
                  <div>
                    <div className='fw-bold'>24/7 Support</div>
                    <div>We're here to help you</div>

                  </div>
                </div>


              </div>
            </div>
            <div className="col-lg-6 col-md-6 ">
              <form onSubmit={registerFormik.handleSubmit} className='d-flex flex-column gap-3 bg-white p-5 rounded-5 ' action="">
                <div>
                  <h1>Sign up</h1>
                  <p className='grayColor'>create your acount and start shopping</p>
                </div>
                <div>
                  <label className='bg-transparent fs-5 fw-medium' htmlFor='name' >Full Name</label>
                  <div className='position-relative'>
                    <input onBlur={registerFormik.handleBlur} type="text" value={registerFormik.values.name} onChange={registerFormik.handleChange} name='name' id='name' placeholder='Enter your name' className='form-control py-3 ' />
                    <FiUser className={`${style.iconsPostion} `} color='gray' />
                  </div>


                  {registerFormik.touched.name && registerFormik.errors.name ? <div className='alert alert-danger mt-2'>
                    {registerFormik.errors.name}
                  </div> : null}

                </div>



                <div>
                  <label className='bg-transparent fs-5 fw-medium' htmlFor='email' >Email</label>
                  <div className='position-relative'>
                    <input onBlur={registerFormik.handleBlur} type="email" value={registerFormik.values.email} onChange={registerFormik.handleChange} name='email' id='email' placeholder='Enter your email' className='form-control py-3 ' />
                    <MdOutlineEmail className={`${style.iconsPostion} `} color='gray' />
                  </div>
                </div>

                {registerFormik.touched.email && registerFormik.errors.email ? <div className='alert alert-danger mt-2'>
                  {registerFormik.errors.email}
                </div> : null}


                

                <div>
                  <label className='bg-transparent fs-5 fw-medium' htmlFor='password' >Password</label>
                  <div className='position-relative'>
                    <input type={(passVisability? 'text' :'password')} onBlur={registerFormik.handleBlur} value={registerFormik.values.password} onChange={registerFormik.handleChange} id='password' name='password' placeholder='Enter your password' className='form-control py-3  ' />
                    <div className='cursor-pointer ' onClick={()=>setPassVisability(!passVisability)} >
                      {(passVisability? <IoEye className={`${style.iconsPostion} `} color='gray' />  : <IoEyeOff className={`${style.iconsPostion} `} color='black' />)}
                      
                      
                      </div>
                    
                  </div>
                </div>

                {registerFormik.touched.password && registerFormik.errors.password ? <div className='alert alert-danger mt-2'>
                  {registerFormik.errors.password}
                </div> : null}

               <div>
                  <label className='bg-transparent fs-5 fw-medium' htmlFor='rePassword' >Confirm Password</label>
                  <div className='position-relative'>
                    <input type={(rePassVisability? 'text' :'password')} onBlur={registerFormik.handleBlur} value={registerFormik.values.rePassword} onChange={registerFormik.handleChange} id='rePassword' name='rePassword' placeholder='Enter your password again' className='form-control py-3  ' />
                    <div className='cursor-pointer ' onClick={()=>setRePassVisability(!rePassVisability)} >
                      {(rePassVisability? <IoEye className={`${style.iconsPostion} `} color='gray' />  : <IoEyeOff className={`${style.iconsPostion} `} color='black' />)}
                      
                      
                      </div>
                    
                  </div>
                </div>
                {registerFormik.touched.rePassword && registerFormik.errors.rePassword ? <div className='alert alert-danger mt-2'>
                  {registerFormik.errors.rePassword}
                </div> : null}
                <div>
                  <label className='bg-transparent fs-5 fw-medium' htmlFor='phone' >Phone number</label>
                  <div className='position-relative'>
                    <input onBlur={registerFormik.handleBlur} type="text" value={registerFormik.values.phone} onChange={registerFormik.handleChange} name='phone' id='phone' placeholder='Enter your phone number' className='form-control py-3 ' />
                    <FaPhone className={`${style.iconsPostion} `} color='gray' />
                  </div>
                </div>
                {registerFormik.touched.phone && registerFormik.errors.phone ? <div className='alert alert-danger mt-2'>
                  {registerFormik.errors.phone}
                </div> : null}

                <button type="submit" className={`btn btn-primary py-3 ${(registerFormik.isValid && registerFormik.dirty ? '' : 'disabled')}`}>

                  {(!Loading ? 'Sin Up' : <div className="spinner-border text-light" role="status"></div>)}



                </button>
                <p>Already have an account? <Link className={`${style.removeDecoration}`} to="/login">Log in</Link> </p>
              </form>
            </div>
          </div>
        </div>
      </div>


    </>

  )
}
