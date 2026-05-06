import React, { useEffect, useState } from 'react'
import './ExploreMenu.css'

const ExploreMenu = ({category, setCategory}) => {
    const [menu_list, setMenuList] = useState([])

    useEffect(() => {
        fetch('http://localhost:8000/api/food/categories/')
            .then(res => res.json())
            .then(data => setMenuList(data))
            .catch(err => console.error('Category fetch error:', err))
    }, [])

    return (
        <div className='explore-menu' id='explore-menu'>
            <div className='explore-menu-sidebar'>
                <h2>Меню</h2>
                <ul>
                    <li
                        className={category === "All" ? "active" : ""}
                        onClick={() => setCategory("All")}
                    >
                        Бүгд
                    </li>
                    {menu_list.map((item, index) => (
                        <li
                            key={index}
                            className={category === item.name ? "active" : ""}
                            onClick={() => setCategory(prev => prev === item.name ? "All" : item.name)}
                        >
                            {item.image && <img src={item.image} alt={item.name} />}
                            {item.name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default ExploreMenu