import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Home from '../pages/Student/Home'


const StudentRouterHome = () => {
  return (  
          <Routes >
            <Route path="/" element={<Home />}></Route>
          </Routes>
 
  )
}

export default StudentRouterHome