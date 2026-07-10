import React from 'react'
import Navbar from './components/navbar/Navbar'
import Sidebar from './components/sidebar/Sidebar'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import Support from './pages/Support/Support'
import PromoCodes from './pages/PromoCodes/PromoCodes'
import Dashboard from './pages/Dashboard/Dashboard'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {

  const Url = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  return (
    <div>
      <ToastContainer />
      <Navbar></Navbar>
      <hr />
      <div className="app-content">
        <Sidebar></Sidebar>
        <Routes>
          <Route path="/" element={<Dashboard url={Url} />} />
          <Route path="/add" element={<Add url={Url} />} />
          <Route path="/list" element={<List url={Url} />} />
          <Route path="/orders" element={<Orders url={Url} />} />
          <Route path="/support" element={<Support url={Url} />} />
          <Route path="/promos" element={<PromoCodes url={Url} />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
