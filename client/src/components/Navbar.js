import React, {useState} from 'react';
import { Link } from "react-router-dom";
import "./Navbar.css"

function Navbar() {
    const [sign, setSign] = useState(true)
    const onClick = () => {
        setSign((prev) => !prev)
    }
    return (
        <div>
            <ul className="navbar">
                <li><Link to="/">Home</Link></li>
                {sign ? (
                    <li><Link to="/sign_in"><button onClick={onClick}>로그인</button></Link></li>
                    ) : (
                    <li><Link to="/sign_up"><button onClick={onClick}>회원가입</button></Link></li>
                )}      
            </ul>
        </div>
    );
}

export default Navbar;