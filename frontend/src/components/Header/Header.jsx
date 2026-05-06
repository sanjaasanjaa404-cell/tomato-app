import React, { useState, useEffect } from 'react'
import './Header.css'
import { assets } from '../../assets/assets'

const slides = [
    {
        image: assets.header_img,
        title: "Дуртай хоолоо",
        subtitle: "Онлайнаар захиалаарай",
        desc: "Хурдан, амттай, хямд үнэтэй хоол хүргэлт",
        btn: "Меню үзэх"
    },
    {
        image: assets.header_img,
        title: "Шинэ амтууд",
        subtitle: "Танд хүргэж байна",
        desc: "Өдөр бүр шинэ хоол нэмэгдэж байна",
        btn: "Захиалах"
    },
    {
        image: assets.header_img,
        title: "Хурдан хүргэлт",
        subtitle: "30 минутад",
        desc: "Хаана ч байсан хүргэж өгнө",
        btn: "Одоо захиалах"
    },
]

const Header = () => {
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % slides.length)
        }, 4000)
        return () => clearInterval(timer)
    }, [])

    const prev = () => setCurrent(prev => (prev - 1 + slides.length) % slides.length)
    const next = () => setCurrent(prev => (prev + 1) % slides.length)

    return (
        <div className='header'>
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`slide ${index === current ? 'active' : ''}`}
                    style={{backgroundImage: `url(${slide.image})`}}
                >
                    <div className='slide-overlay'></div>
                    <div className='header-contents'>
                        <p className='slide-subtitle'>{slide.subtitle}</p>
                        <h2>{slide.title}</h2>
                        <p className='slide-desc'>{slide.desc}</p>
                        <button>{slide.btn}</button>
                    </div>
                </div>
            ))}

            {/* Controls */}
            <button className='slider-btn prev' onClick={prev}>&#8592;</button>
            <button className='slider-btn next' onClick={next}>&#8594;</button>

            {/* Dots */}
            <div className='slider-dots'>
                {slides.map((_, index) => (
                    <span
                        key={index}
                        className={`dot ${index === current ? 'active' : ''}`}
                        onClick={() => setCurrent(index)}
                    ></span>
                ))}
            </div>

            {/* Counter */}
            <div className='slide-counter'>
                <span>{String(current + 1).padStart(2, '0')}</span>
                <span className='divider'></span>
                <span>{String(slides.length).padStart(2, '0')}</span>
            </div>
        </div>
    )
}

export default Header