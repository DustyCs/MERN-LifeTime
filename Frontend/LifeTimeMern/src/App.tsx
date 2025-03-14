import { useState } from 'react'
import { Routes, Route } from "react-router-dom";
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<h1>Home</h1>} />
      <Route path="/schedule" element={<h1>Home</h1>}  />
      <Route path="/activity_list" element={<h1>Home</h1>} />
      <Route path="/performance" element={<h1>Home</h1>} />
      <Route path="/monthly_review" element={<h1>Home</h1>} />
      <Route path="/life_overview" element={<h1>Home</h1>} />
      <Route path="*"  element={<h1>Home</h1>} />
    </Routes>
  )
}

export default App
