import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SPOTIFY_CLIENT_ID, SPOTIFY_AUTH_ENDPOINT, REDIRECT_URI } from '../constants';
import './styles/LoginPage.css';
import './styles/HomePage.css';

const Login = ({ currentUser }) => {
    const navigate = useNavigate();
    
    return (
        <div className="LoginPage">
            <div className='login-page-container'>
                
            </div>
        </div>
    );
};

export default Login;