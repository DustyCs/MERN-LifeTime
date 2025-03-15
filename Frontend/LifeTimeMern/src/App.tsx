import { useState } from 'react'
import { Routes, Route } from "react-router-dom";
import './App.css'
import NotFound from './pages/NotFound'
import Layout from './components/Layout';
import Home from './pages/Home';

function App() {
  return (
    <Routes>
      <Route element={<Layout/>}>
        <Route path="/" element={<Home />} />
        <Route path="/schedule" element={<h1>Home</h1>}  />
        <Route path="/activity_list" element={<h1>Home</h1>} />
        <Route path="/performance" element={<h1>Home</h1>} />
        <Route path="/monthly_review" element={<h1>Home</h1>} />
        <Route path="/life_overview" element={<h1>Home</h1>} />
        <Route path="*"  element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
