import React, { useContext, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'

const Navbar = ({setShowLogin}) => {
  const [menu, setMenu] = useState("home")
  const [showDropdown, setShowDropdown] = useState(false)
  const { getTotalCartAmount, user, logout } = useContext(StoreContext);

  return (
    <div className='navbar'>
      <Link to='/'><img src={assets.logo} alt="" className='logo'/></Link>
      <ul className='navbar-menu'>
        <Link to='/' onClick={()=>setMenu("home")} className={menu==="home"?"active":""}>Нүүр</Link>
        <a href='#explore-menu' onClick={()=>setMenu("menu")} className={menu==="menu"?"active":""}>Меню</a>
        <a href='#app-download' onClick={()=>setMenu("mobile-app")} className={menu==="mobile-app"?"active":""}>Апп</a>
        <a href='#footer' onClick={()=>setMenu("contact-us")} className={menu==="contact-us"?"active":""}>Холбоо барих</a>
      </ul>
      <div className='navbar-right'>
        <img src={assets.search_icon} alt="" />
        <div className='navbar-search-icon'>
          <Link to='/cart'><img src={assets.basket_icon} alt="" /></Link>
          <div className={getTotalCartAmount()===0?"":"dot"}></div>
        </div>
        {user ? (
          <div className='navbar-profile' onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}>
            <img src={assets.profile_icon} alt="profile" />
            {showDropdown && (
              <ul className='nav-profile-dropdown'>
                <li><img src={assets.bag_icon} alt=""/><Link to='/myorders'>Захиалгууд</Link></li>
                <hr/>
                <li onClick={logout}><img src={assets.logout_icon} alt=""/><p>Гарах</p></li>
              </ul>
            )}
          </div>
        ) : (
          <button onClick={() => setShowLogin(true)}>Нэвтрэх</button>
        )}
      </div>
    </div>
  )
}

export default Navbar