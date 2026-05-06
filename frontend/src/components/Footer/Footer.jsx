import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
        <div className='footer-top'>
            <div className='footer-brand'>
                <img src={assets.logo} alt="" />
                <p>Хамгийн амттай хоолыг хамгийн хурдан хүргэж өгдөг онлайн захиалгын систем. Танд үргэлж шилдэг үйлчилгээ үзүүлэх нь бидний зорилго.</p>
                <div className="footer-social-icons">
                    <a href="#"><img src={assets.facebook_icon} alt="Facebook" /></a>
                    <a href="#"><img src={assets.twitter_icon} alt="Twitter" /></a>
                    <a href="#"><img src={assets.linkedin_icon} alt="LinkedIn" /></a>
                </div>
            </div>

            <div className="footer-links">
                <h3>Компани</h3>
                <ul>
                    <li>Нүүр хуудас</li>
                    <li>Бидний тухай</li>
                    <li>Хүргэлт</li>
                    <li>Нууцлалын бодлого</li>
                </ul>
            </div>

            <div className="footer-links">
                <h3>Холбоо барих</h3>
                <ul>
                    <li>
                        <span>📞</span>
                        +976 9918-3491
                    </li>
                    <li>
                        <span>✉️</span>
                        sanjaasanjaa404@gmail.com
                    </li>
                    <li>
                        <span>📍</span>
                        Тэнгис кино театрын чанх ард байрлах Tomato ресторан
                    </li>
                </ul>
            </div>

            <div className="footer-links">
                <h3>Цагийн хуваарь</h3>
                <ul>
                    <li><span>🕐</span> Даваа — Баасан</li>
                    <li className='time'>09:00 — 22:00</li>
                    <li><span>🕐</span> Бямба — Ням</li>
                    <li className='time'>10:00 — 23:00</li>
                </ul>
            </div>
        </div>

        <div className='footer-bottom'>
            <p>© 2026 <span>Tomato</span> — Бүх эрх хуулиар хамгаалагдсан</p>
            <div className='footer-bottom-links'>
                <span>Нууцлал</span>
                <span>Үйлчилгээний нөхцөл</span>
                <span>Cookie</span>
            </div>
        </div>
    </div>
  )
}

export default Footer