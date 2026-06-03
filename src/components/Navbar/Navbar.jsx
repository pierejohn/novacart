import React, { useContext, useState, useRef, useEffect } from 'react'
import LogoImg from '../../images/logo.png'
import { FaShoppingCart, FaHeart } from "react-icons/fa"
import { BsThreeDotsVertical } from "react-icons/bs"
import './Navbar.css'
import { Link, NavLink, useNavigate } from 'react-router'
import { storeContext } from '../../context/StoreContext'

export default function Navbar() {

  const navigate = useNavigate()
  const cardNum = useContext(storeContext)

  const [menuOpen, setMenuOpen] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const menuRef = useRef(null)

  function signOut() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    cardNum.setToken(null)
    cardNum.setCardNumber(0)
    navigate('/')
  }

  const toggleMenu = () => {
    setMenuOpen(prev => !prev)
  }

  const closeMenu = () => {
    setMenuOpen(false)
  }

  const toggleNav = () => {
    setNavOpen(prev => !prev)
  }

  const closeNav = () => {
    setNavOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className="navbar navbar-expand-lg bg-white fixed-top">
      <div className="container">

        {/* LOGO */}
        <Link className="navbar-brand" to="/" onClick={closeNav}>
          <img src={LogoImg} alt="logo" width="100" />
        </Link>

        {/* TOGGLER */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNav}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* COLLAPSE */}
        <div className={`collapse navbar-collapse ${navOpen ? "show" : ""}`}>

          {/* LEFT SIDE */}
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" onClick={closeNav}>Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/Products" onClick={closeNav}>Products</NavLink>
            </li>
          </ul>

          {/* RIGHT SIDE */}
          <ul className="navbar-nav ms-auto gap-2 text-lg-end rightNavFix">

            {cardNum.token ? (
              <>
                <li className="nav-item position-relative me-3">
                  <NavLink className="nav-link" to="/cart" onClick={closeNav}>
                    Cart <FaShoppingCart />
                  </NavLink>

                  {cardNum.cardNumber > 0 && (
                    <div className="circle cardNumber">
                      {cardNum.cardNumber}
                    </div>
                  )}
                </li>

                <li className="nav-item position-relative me-3">
                  <NavLink className="nav-link" to="/wishlist" onClick={closeNav}>
                    Wishlist <FaHeart />
                  </NavLink>

                  {cardNum.wishlistNumber > 0 && (
                    <div className="circle cardNumber">
                      {cardNum.wishlistNumber}
                    </div>
                  )}
                </li>

                <li className="nav-item position-relative" ref={menuRef}>

                  <button
                    className="btn border-0 bg-transparent p-0"
                    onClick={toggleMenu}
                  >
                    <BsThreeDotsVertical />
                  </button>

                  {menuOpen && (
                    <div className="smallMenu">

                      <button
                        className="menuItem"
                        onClick={() => {
                          signOut()
                          closeMenu()
                          closeNav()
                        }}
                      >
                        Sign Out
                      </button>

                      <Link
                        className="menuItem"
                        to="/settings"
                        onClick={() => {
                          closeMenu()
                          closeNav()
                        }}
                      >
                        Settings
                      </Link>

                    </div>
                  )}

                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/register" onClick={closeNav}>Sign Up</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login" onClick={closeNav}>Log In</Link>
                </li>
              </>
            )}

          </ul>

        </div>
      </div>
    </nav>
  )
}