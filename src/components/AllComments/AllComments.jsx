import React, { useContext, useEffect, useState } from 'react'
import style from './AllComments.module.css'
import axios from 'axios';
import { BaseUrl } from '../utils/baseUrl';
import { IoPersonSharp } from 'react-icons/io5';
import { FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { BsThreeDotsVertical } from "react-icons/bs";
import { storeContext } from '../../context/StoreContext';
import { input } from 'motion/react-client';
import { useFormik } from 'formik';
import { toast, ToastContainer } from 'react-toastify';

export default function AllComments(props) {

    const { verifyToken } = useContext(storeContext)
    const [userIdState, setUserIdState] = useState('')
    const [isEditing, setIsEditing] = useState(false)
    const [numberOfStars, setNumberOfStars] = useState(0)
    const [idOfComment, setIdOfComment] = useState(null)
    const [cancelDelete, setCancelDelete] = useState(false)
    const [isEditingLoding, setIsEditingLoding] = useState(false)

    let editCommentFormik = useFormik({
        initialValues: {
            review: "",
            rating: numberOfStars
        }
        ,
        onSubmit: ((val) => {




            editComment(val);

        })
    })

    async function editComment(val) {
        setIsEditingLoding(true)
        let token = localStorage.getItem('token')
// console.log(idOfComment);

        await axios.put(`${BaseUrl}/reviews/${idOfComment}`, val, { headers: { token } }).then((data) => {
            // console.log(data);
            props.commentsList()

        }).catch((error) => {
            // console.log(error.response.data.message);
            toast.error(error.response.data.message)
        })

        setIsEditingLoding(false)

    }

    async function deleteComment() {
        let token = localStorage.getItem('token')

        await axios.delete(`${BaseUrl}/reviews/${idOfComment}`, { headers: { token } }).then((data) => {
            // console.log(data);
            props.commentsList()

        }).catch((error) => {
            console.log(error.response.data);
            toast.error(error.response.data.message)
        })


    }


    useEffect(() => {
        setIsEditing(false)
        starsRateEdit(0)
        setCancelDelete(false)
    }, [props.commentsList])

    function starsRateEdit(num) {
        setStarIsClicked(true)
        setNumberOfStars(num)

        editCommentFormik.setFieldValue('rating', num)
    }
    const [starIsClicked, setStarIsClicked] = useState(false)

    let productId
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalf = rating % 1 !== 0;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<FaStar onClick={() => { starsRateEdit(i + 1) }} key={i} color="gold" />);
            } else if (i === fullStars && hasHalf) {
                stars.push(<FaStarHalfAlt onClick={() => { starsRateEdit(i + 1) }} key={i} color="gold" />);
            } else {
                stars.push(<FaRegStar onClick={() => { starsRateEdit(i + 1) }} key={i} color="#ccc" />);
            }
        }

        return stars;
    };

    async function userId() {
        let token = localStorage.getItem('token')

        let response = await verifyToken(token)
        setUserIdState(response);


    }
    useEffect(() => {
        userId()
    }, [])







    return (

        <>

          
            <div className={`${style.deletePage} ${cancelDelete ? '' : style.fade} d-flex align-items-center justify-content-center`}>
                <div className={style.modalBox}>
                    <div className="modal-header border-0 ">
                        <h5 className="modal-title fw-bold">Confirm Delete</h5>
                        <button onClick={() => setCancelDelete(false)}
                            type="button"

                            className="btn-close"
                        />
                    </div>

                    <div className="modal-body text-center">


                        <h6 className="mt-3">
                            Are you sure you want to delete this Comment?

                        </h6>

                        <p className="text-muted small mt-2">
                            This action cannot be undone.
                        </p>
                    </div>

                    <div className="modal-footer border-0 d-flex justify-content-center gap-2">
                        <button onClick={() => setCancelDelete(false)} className="btn btn-light px-4">
                            Cancel
                        </button>

                        <button onClick={() => deleteComment()} className="btn btn-danger px-4">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
            {props.reviews?.map((val, index) => {

                return <div key={index} className={`${style.comment} my-3`} >
                    <div className='d-flex justify-content-between'>
                        <div className='d-flex align-items-center gap-3'>
                            <div className={`${style.reviewerIcon}`}>
                                <IoPersonSharp className=' text-white' />
                            </div>
                            <h6>{val.user.name}</h6>
                        </div>
                        <div>
                            {val.user._id == userIdState ? <div className="dropdown">
                                <BsThreeDotsVertical data-bs-toggle="dropdown" role="button" />

                                <ul className="dropdown-menu">
                                    <li>
                                        <button onClick={() => {
                                            setIsEditing(true); setIdOfComment(val._id); starsRateEdit(val.rating)
                                        }
                                        } className="dropdown-item">Edit</button>
                                    </li>
                                    <li>
                                        <button onClick={() => {setCancelDelete(true);setIdOfComment(val._id)}} className="dropdown-item text-danger">
                                            Delete
                                        </button>
                                    </li>
                                </ul>
                            </div> : ""}


                        </div>
                    </div>
                    <form onSubmit={editCommentFormik.handleSubmit} action="">
                        <div >
                            {isEditing && val.user._id == userIdState ?


                                < >
                                    {starIsClicked ? <div
                                    >{renderStars(numberOfStars)}</div> : [...Array(5)].map((_, index) => (<FaRegStar key={index} name='rating' onClick={() => starsRateEdit(index + 1)} color="#ccc" />

                                    ))} </>



                                : <div className='d-flex gap-3'>
                                    <div>
                                        {renderStars(val.rating)}</div>

                                    <h5 className='fs-5 grayColor '>{val.rating}</h5></div>}


                        </div>
                        <p className='grayColor'>{`Reviewed on ${val.createdAt.slice(0, 10)}`}</p>

                        {isEditing && val.user._id == userIdState ?
                            <input name='review' onChange={editCommentFormik.handleChange} onBlur={editCommentFormik.handleBlur} type="text" value={editCommentFormik.values.review} className='form-control' />
                            : <h6 className= {`${style.commentText}`}>{val.review}</h6>}

                        {isEditing && val.user._id == userIdState ? <div className='d-flex gap-3 mt-3'>
                            <button type="submit" className='btn btn-primary'>
                                
                                
                                 {isEditingLoding ?<div className="spinner-border" role="status">
 
</div>:'save'} 
                                
                                </button>
                            <button


                                type="button" onClick={() => setIsEditing(false)} className='btn btn-light border'>cancel</button>
                        </div> : ""}
                    </form>
                </div>
            })}
            {
            }
        </>
    )
}
