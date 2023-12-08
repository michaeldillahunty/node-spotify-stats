import React, { useState, useEffect } from 'react';
import { Navigate, Routes, Route } from "react-router-dom"
// import axios from 'axios';
import logo from './logo.svg';
import axios_service from './api/axios.service';
/// Styles
import './App.css';

/// Components
import Home from './components/Home.component';
// import Login from './components/Login.component';

// import { AuthProvider } from './AuthContext';
import ApiService from './api/api.service';

function App() {
   return (
      <div className="App">
         <Routes>
            <Route path='/' element={<Home/>}/>
         </Routes>
      </div>
   );
}

export default App;
