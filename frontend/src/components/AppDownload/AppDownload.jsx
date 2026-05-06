import React from 'react'
import './AppDownload.css'
import { assets } from '../../assets/assets'

const AppDownload = () => {
  return (
    <div className="app-download" id='app-download'>
        <div className="app-download-content">
            <div className="app-download-text">
                <span className="app-tag">АППЛИКЕЙШН</span>
                <h2>Томато аппыг <br/><span>татаж аваарай</span></h2>
                <p>Хаанаас ч захиалах боломжтой. Хурдан, хялбар, аюулгүй.</p>
                <div className="app-download-platforms">
                    <img src={assets.play_store} alt="Google Play" />
                    <img src={assets.app_store} alt="App Store" />
                </div>
            </div>
            <div className="app-download-visual">
                <div className="app-circle">
                    <div className="app-circle-inner">
                        <span>🍕</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AppDownload