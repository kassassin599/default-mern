import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./View/Home/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Counter } from "./View/Counter";
// import 'sweetalert2/src/sweetalert2.scss'

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/* <Login /> */}
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
