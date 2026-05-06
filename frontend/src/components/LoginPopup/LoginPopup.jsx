import React, { useContext, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'

const LoginPopup = ({ setShowLogin }) => {
    const [currState, setCurrState] = useState("Sign Up")
    const [data, setData] = useState({ name: "", email: "", password: "" })
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")

    const { setUser, setToken } = useContext(StoreContext)

    const onChangeHandler = (e) => {
        setData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        setError("")

        const url = currState === "Sign Up"
            ? "http://localhost:8000/api/auth/register/"
            : "http://localhost:8000/api/auth/login/"

        const body = currState === "Sign Up"
            ? { name: data.name, email: data.email, password: data.password }
            : { email: data.email, password: data.password }

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            })
            const result = await res.json()

            if (result.success) {
                localStorage.setItem("token", result.token)
                setToken(result.token)
                setUser(result.user)
                setShowLogin(false)
            } else {
                setError(JSON.stringify(result.message))
            }
        } catch (err) {
            setError("Сервертэй холбогдоход алдаа гарлаа")
        }
    }

    return (
        <div className='login-popup'>
            <form onSubmit={onSubmit} className="login-popup-container">

                {/* Title */}
                <div className="login-popup-title">
                    <h2>{currState}</h2>
                    <img
                        onClick={() => setShowLogin(false)}
                        src={assets.cross_icon}
                        alt="close"
                    />
                </div>

                {/* Inputs */}
                <div className='login-popup-inputs'>
                    {currState === "Sign Up" &&
                        <div className="input-group">
                            <label>Full Name</label>
                            <input
                                name="name"
                                type="text"
                                placeholder="John Doe"
                                value={data.name}
                                onChange={onChangeHandler}
                                required
                            />
                        </div>
                    }
                    <div className="input-group">
                        <label>Email</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="hello@email.com"
                            value={data.email}
                            onChange={onChangeHandler}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <div className="password-wrapper">
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={data.password}
                                onChange={onChangeHandler}
                                required
                            />
                            <span
                                className="toggle-password"
                                onClick={() => setShowPassword(p => !p)}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Error */}
                {error && <p style={{color: 'red', fontSize: '13px'}}>{error}</p>}

                {/* Terms (Sign Up only) */}
                {currState === "Sign Up" &&
                    <div className="login-popup-condition">
                        <input type="checkbox" required />
                        <p>I agree to the <span>Terms of Service</span> and <span>Privacy Policy</span></p>
                    </div>
                }

                {/* Submit */}
                <button type="submit">
                    {currState === "Sign Up" ? "Create Account" : "Login"}
                </button>

                {/* Switch */}
                <div className="login-popup-switch">
                    {currState === "Sign Up"
                        ? <p>Already have an account? <span onClick={() => setCurrState("Login")}>Login</span></p>
                        : <p>Don't have an account? <span onClick={() => setCurrState("Sign Up")}>Sign Up</span></p>
                    }
                </div>
            </form>
        </div>
    )
}

export default LoginPopup