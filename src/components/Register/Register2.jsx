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
import * as Yup from 'yup';
import { BaseUrl } from '../utils/baseUrl';
import { useFormik } from 'formik';
import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';


export default function Register() {

const [loading, setLoading] = useState(false)
let navigate = useNavigate()


  let validationSchema = Yup.object({

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
      phone: '',
    },

    validationSchema,

    onSubmit: ((val) => {
      setLoading(true)
      console.log(val);


      axios.post(`${BaseUrl}/auth/signup`, val)
        .then((data) => {

        if(data.status === 201) {
      setLoading(false)

           toast.success('Account created successfully You will be navigate to Login 🎉',{
  autoClose: 3500,
})
          setTimeout(() => {
             navigate('/login')
          }, 3000);
           
          
        } 
          

        })
        .catch((error) => {
      setLoading(false)

           toast.error(error.response.data.message,{
  autoClose: 3000,
})
          // console.log(error.response.data.message);

        })

    })
  }


  )






  return (
    <>

 <ToastContainer />
      <div className={` ${style.bgImg}`}>
        <div className="container pt-5">
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
              <form onSubmit={registerFormik.handleSubmit} className='d-flex flex-column gap-3 bg-white p-4 rounded-5 ' action="">
                <div>
                  <h1>Sign up</h1>
                  <p className='grayColor'>create your acount and start shopping</p>
                </div>
                <div>
                  <label className='bg-transparent fs-5 fw-medium' htmlFor='name' >Full Name</label>
                  <div className='position-relative'>
                    <input onBlur={registerFormik.handleBlur} value={registerFormik.values.name} onChange={registerFormik.handleChange} type="text" name='name' id='name' placeholder='Enter your name' className='form-control py-3 ' />
                    <FiUser className={`${style.iconsPostion} `} color='gray' />
                  </div>


                  {registerFormik.errors.name && registerFormik.touched.name ? <div className="alert alert-danger mt-2" role="alert">{registerFormik.errors.name}</div> : ''}





                </div>



                <div>
                  <label className='bg-transparent fs-5 fw-medium' htmlFor='email' >Email</label>
                  <div className='position-relative'>
                    <input value={registerFormik.values.email} onChange={registerFormik.handleChange} type="email" name='email' onBlur={registerFormik.handleBlur} id='email' placeholder='Enter your email' className='form-control py-3 ' />
                    <MdOutlineEmail className={`${style.iconsPostion} `} color='gray' />
                  </div>
                </div>


                {registerFormik.errors.email && registerFormik.touched.email ? <div className="alert alert-danger mt-2" role="alert">{registerFormik.errors.email}</div> : ''}

                <div>
                  <label className='bg-transparent fs-5 fw-medium' htmlFor='Password' >Password</label>
                  <div className='position-relative'>
                    <input onBlur={registerFormik.handleBlur} value={registerFormik.values.password} onChange={registerFormik.handleChange} type="password" name='password' id='Password' placeholder='Enter your password' className='form-control py-3 ' />
                    <TbPassword className={`${style.iconsPostion} `} color='gray' />
                  </div>
                </div>
                {registerFormik.errors.password && registerFormik.touched.password ? <div className="alert alert-danger mt-2" role="alert">{registerFormik.errors.password}</div> : ''}


                <div>
                  <label className='bg-transparent fs-5 fw-medium' htmlFor='password' >Confirm password</label>
                  <div className='position-relative'>
                    <input onBlur={registerFormik.handleBlur} value={registerFormik.values.rePassword} onChange={registerFormik.handleChange} type="password" name='rePassword' id='rePassword' placeholder='Confirm your password' className='form-control py-3 ' />
                    <TbPassword className={`${style.iconsPostion} `} color='gray' />
                  </div>
                </div>

                {registerFormik.errors.rePassword && registerFormik.touched.rePassword ? <div className="alert alert-danger mt-2" role="alert">{registerFormik.errors.rePassword}</div> : ''}


                <div>
                  <label className='bg-transparent fs-5 fw-medium' htmlFor='phone' >Phone number</label>
                  <div className='position-relative'>
                    <input onBlur={registerFormik.handleBlur} value={registerFormik.values.phone} onChange={registerFormik.handleChange} type="text" name='phone' id='phone' placeholder='Enter your phone number' className='form-control py-3 ' />
                    <FaPhone className={`${style.iconsPostion} `} color='gray' />
                  </div>
                </div>
                {registerFormik.errors.phone && registerFormik.touched.phone ? <div className="alert alert-danger mt-2" role="alert">{registerFormik.errors.phone}</div> : ''}



                <button type="submit"  className={`btn btn-primary py-3 ${(registerFormik.dirty && registerFormik.isValid?'':'disabled' )}`}>
{(!loading?'Sin Up':<div class="spinner-border" role="status">
 
</div>)}
                  
                  
                </button>

              </form>
            </div>
          </div>
        </div>
      </div>


    </>

  )
}
