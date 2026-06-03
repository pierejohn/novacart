import React, { useEffect, useState } from 'react'
import { IoPerson } from "react-icons/io5";
import style from './Setting.module.css'
import { jwtDecode } from "jwt-decode";
import { MdOutlineEdit } from "react-icons/md";
import axios from 'axios';
import { BaseUrl } from '../utils/baseUrl';
import { header } from 'motion/react-client';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { toast, ToastContainer } from 'react-toastify';
import { IoIosArrowBack } from "react-icons/io";

export default function Settings() {

  let validationSchema = Yup.object(
    {
      name: Yup.string().min(3).max(15).required(),
      email: Yup.string().email().required(),

    }
  )
  let passwordSchema = Yup.object({
    currentPassword: Yup.string().matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character').required(),
    password: Yup.string().matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character').required(),
    rePassword: Yup.string().oneOf([Yup.ref('password')], 'Password must matches').required(),
  });



  const [user, setUser] = useState({})
  const [nameChanging, setNameChanging] = useState(false)
  const [emailChanging, setEmailChanging] = useState(false)
  const [passwordChanging, setPasswordChanging] = useState(false)
  const [changeEmailloading, setChangeEmailloading] = useState(false)
  const [changeNameloading, setChangeNameloading] = useState(false)
  const [changePasswordloading, setChangePasswordloading] = useState(false)



  let nameAndEmailFormik = useFormik({
    initialValues: {
      name: user.name,
      email: user.email
    },
    validationSchema,
    onSubmit: (val) => {


    }
  })

  let passwordFormik = useFormik({
    initialValues: {
      currentPassword: "",
      password: "",
      rePassword: ""
    },
    validationSchema: passwordSchema,
    onSubmit: (val) => {
      changePassword(val)

    }
  })

  useEffect(() => {

    setUser(JSON.parse(localStorage.getItem('user')))
  }, [])

  async function editName() {
    setChangeNameloading(true)

    await nameAndEmailFormik.validateForm();
    if (nameAndEmailFormik.errors.name) return;
    let token = localStorage.getItem('token')
    await axios.put(`${BaseUrl}/users/updateMe/`, {
      name: nameAndEmailFormik.values.name,

    },
      { headers: { token } }
    ).then((data) => {

      localStorage.setItem('user', JSON.stringify(data.data.user))
      setUser(JSON.parse(localStorage.getItem('user')))




    }).catch((error) => {
      console.log(error?.response?.data?.message);

    })
    setChangeNameloading(false)
    setNameChanging(false)
  }



  async function editEmail() {
    setChangeEmailloading(true)
    await nameAndEmailFormik.validateForm();
    if (nameAndEmailFormik.errors.email) return;
    let token = localStorage.getItem('token')
    await axios.put(`${BaseUrl}/users/updateMe/`, {
      email: nameAndEmailFormik.values.email,

    },
      { headers: { token } }
    ).then((data) => {

      localStorage.setItem('user', JSON.stringify(data.data.user))
      setUser(JSON.parse(localStorage.getItem('user')))



    }).catch((error) => {

      toast.error(error?.response?.data.errors.msg)
    })
    setEmailChanging(false)
    setChangeEmailloading(false)

  }

  async function changePassword(val) {
    setChangePasswordloading(true)
    let token = localStorage.getItem('token')
    await axios.put(`${BaseUrl}/users/changeMyPassword`, val,
      { headers: { token } }
    ).then((data) => {


      localStorage.setItem('user', JSON.stringify(data.data.user))
      localStorage.setItem('token', data.data.token)


      toast.success('password has changed successfully')








    }).catch((error) => {
      console.log(error?.response?.data?.message);
      toast.error(error?.response?.data?.message)
    })
    setChangePasswordloading(false)
    setPasswordChanging(false)
    defultPassVal()
  }
  function defultPassVal()
  {
    passwordFormik.values.currentPassword=''
    passwordFormik.values.password=''
    passwordFormik.values.rePassword=''
  }
  return (
    <>
      <ToastContainer toastStyle={{ marginTop: "50px" }} position="top-right" autoClose={3000} />

      <div className='container mt-5'>

        <h2>Account Settings</h2>
        <h5 className='grayColor'>Manage your account information and security</h5>
        <form onSubmit={nameAndEmailFormik.handleSubmit}>
          <div className={`${style.cardStyle} d-flex flex-column gap-3 my-5`}>
            <div className='d-flex align-items-center gap-3'>
              <div className={`${style.iconBox} greenColor`}><IoPerson />
              </div>
              <div>
                <h5>Personal information</h5>
                <h6 className='grayColor'>Update your personal details</h6></div>
            </div>
            <div className='row mt-3'>
              <h6 className='col-4 grayColor'>Full Name</h6>




              {nameChanging ? <h5 className='col-lg-6 col-md-6 col-8 '> <input onChange={nameAndEmailFormik.handleChange} value={nameAndEmailFormik.values.name} onBlur={nameAndEmailFormik.handleBlur} name='name' className='form-control' /> </h5> : <h5 className='col-lg-6 col-md-6 col-8 '>{user.name}</h5>}


              {nameChanging ?
                <h6 className='col-lg-2 col-md-2 col-12 '> <button onClick={() => editName()} className=' btn btn-info w-100' type="button" >
                  {changeNameloading ? <div className="spinner-border text-light" role="status"></div> : 'Submit'}

                </button></h6>

                :

                <h6 className='col-lg-2 col-md-2 col-12 '>
                  <button
                    onClick={() => { setNameChanging(true); nameAndEmailFormik.setFieldValue("name", user.name) }}

                    className={`${style.editBtn} w-100`}><MdOutlineEdit /> Edit</button>
                </h6>}

            </div>
            {nameAndEmailFormik.touched.name && nameAndEmailFormik.errors.name ? <div className='alert alert-danger '>
              {nameAndEmailFormik.errors.name}
            </div> : null}


            <div className='row '>
              <h6 className='col-4 grayColor'>Email</h6>
              {emailChanging ? <h5 className='col-lg-6 col-md-6 col-8 '> <input onChange={nameAndEmailFormik.handleChange} value={nameAndEmailFormik.values.email} onBlur={nameAndEmailFormik.handleBlur} name='email' className='form-control' /> </h5> : <h5 className='col-lg-6 col-md-6 col-8 '>{user.email}</h5>}

              {emailChanging ? <h6 className='col-lg-2 col-md-2 col-12 '> <button
                onClick={() => editEmail()}

                className=' btn btn-info w-100' type="button" >
                {changeEmailloading ? <div className="spinner-border text-light" role="status"></div> : 'Submit'}


              </button></h6> : <h6 className=' col-lg-2 col-md-2 col-12  '>


                <button onClick={() => { setEmailChanging(true); nameAndEmailFormik.setFieldValue("email", user.email) }} className={`${style.editBtn} w-100`}><MdOutlineEdit /> Edit</button>


              </h6>}
              {nameAndEmailFormik.touched.email && nameAndEmailFormik.errors.email ? <div className='alert alert-danger '>
                {nameAndEmailFormik.errors.email}
              </div> : null}

            </div>

          </div>

        </form>

        <form onSubmit={passwordFormik.handleSubmit} >
         
          <div className={`${style.cardStyle} d-flex flex-column gap-3 `}>
 {passwordChanging?
 <>
 <div onClick={()=>
  {
    setPasswordChanging(false)
    defultPassVal()
  }
 } className='greenColor cursor-pointer'> <IoIosArrowBack /> Go back 
</div>
 </>:''}
            <div className='d-flex align-items-center gap-3'>
              <div className={`${style.iconBox} greenColor`}><IoPerson />
              </div>
              <div>
                <h5>Password</h5>
                <h6 className='grayColor'>Update your password</h6>
              </div>

            </div>

            {passwordChanging ? <>
              <div className='row '>
                <h6 className='col-4 grayColor'>Current Password</h6>

                <h5 className='col-8 '>
                  <input className='form-control' value={passwordFormik.values.currentPassword} onChange={passwordFormik.handleChange} onBlur={passwordFormik.handleBlur} name='currentPassword' placeholder='Current Password' type="password" />
                </h5>

                {passwordFormik.touched.currentPassword && passwordFormik.errors.currentPassword ? <div className='alert alert-danger '>
                  {passwordFormik.errors.currentPassword}

                </div> : null}





              </div>
              <div className='row '>
                <h6 className='col-4 grayColor'>New Password</h6>
                <h5 className=' col-8 '>
                  <input className='form-control' value={passwordFormik.values.password} onChange={passwordFormik.handleChange} onBlur={passwordFormik.handleBlur} name='password' placeholder='New Password' type="password" />
                </h5>




                {passwordFormik.touched.password && passwordFormik.errors.password ? <div className='alert alert-danger '>
                  {passwordFormik.errors.password}

                </div> : null}



              </div>
              <div className='row '>
                <h6 className='col-4 grayColor'>Confirm Password</h6>
                <h5 className=' col-8 '>
                  <input className='form-control' value={passwordFormik.values.rePassword} onChange={passwordFormik.handleChange} onBlur={passwordFormik.handleBlur} name='rePassword' placeholder='Confirm Password' type="password" />
                </h5>



                {passwordFormik.touched.rePassword && passwordFormik.errors.rePassword ? <div className='alert alert-danger '>
                  {passwordFormik.errors.rePassword}

                </div> : null}




              </div>
              <h6 className=' col-12  '>


                <button type='submit' className={`${style.editBtn} w-100`}> {changePasswordloading ? <div className={`${style.spinColor} spinner-border `} role="status"></div> : 'Change password'}</button>


              </h6>

            </> :
              <div className='row '>
                <h6 className='col-4 grayColor'>Password</h6>
                <h5 className='col-lg-5 col-md-5 col-8 '>**********</h5>




                <h6 className=' col-lg-3 col-md-3 col-12  '>


                  <button type='button' onClick={() => {
                    setPasswordChanging(true)
                  }} className={`${style.editBtn} w-100`}> Change password</button>


                </h6>



              </div>}

          </div>
        </form>
      </div>
    </>
  )
}
