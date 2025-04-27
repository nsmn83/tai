import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Layout from './pages/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import RideDetails from './pages/RideDetails';
import MyRides from "./pages/MyRides.jsx";

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Layout/>}>
      <Route index element={<Home/>}/>
      <Route path="login" element={<Login/>}/>
      <Route path="register" element={<Register/>}/>
      <Route path="/przejazd/:id" element={<RideDetails />}/>
      <Route path="/myrides" element={<MyRides />}/>

      
      
      </Route>

    </Routes>
    </BrowserRouter>
  )
}

export default App
