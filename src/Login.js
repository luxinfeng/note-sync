import React, { useState } from 'react';
import './Login.css';
import {useNavigate} from "react-router-dom";

function Login() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false)

    const navigate = useNavigate()

    const handleGetVerificationCode = async () => {
        setIsCodeSent(true)

        // 调用后端API获取验证码
        const response = await fetch('http://127.0.0.1:8000/v1/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone: phoneNumber }),
        });

        // 处理响应
        const data = await response.text(); // 或者 response.json()，根据后端实际返回的内容
        console.log(data);

        setTimeout(() => {
            setIsCodeSent(false)
        }, 120000)
    };

    const handleLogin = async () => {
        // 调用后端API进行登录
        // const response = await fetch('https://www.baidu.com/api/login', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ phone: phoneNumber, code: verificationCode }),
        // });
        //
        // // 处理响应
        // const data = await response.text();
        navigate("/synclist")// 或者 response.json()，根据后端实际返回的内容
        console.log("登陆成功");
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <div className="country-selector">
                </div>
                <h1>注册/登录</h1>
                <input
                    type="text"
                    className="input"
                    placeholder="请输入手机号或邮箱"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <input
                    type="text"
                    className="input"
                    placeholder="请输入验证码"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                />
                <button className="btn" onClick={handleGetVerificationCode} disabled={isCodeSent}>
                    {isCodeSent ? '验证码已发送,请两分钟后重试' : '获取验证码'}
                </button>
                <button className="btn btn-primary" onClick={handleLogin}>登录 / 注册</button>
            </div>
        </div>
    );
}

export default Login;
