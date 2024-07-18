import "./App.css";
import Home from "./screens/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./screens/Login";
import SignUp from "./screens/SignUp";
import "../node_modules/bootstrap-dark-5/dist/css/bootstrap-dark.min.css";
// import "../node_modules/bootstrap/dist/js/bootstrap.bundle";
import { CartProvide } from "./components/ContextReducer";
import MyOrder from "./screens/MyOrder";
// import '../node_modules/bootstrap/dist/js/bootstrap.bundle.main.js';

function App() {
  return (
    <CartProvide>
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/createuser" element={<SignUp />} />
          <Route exact path="/signup" element={<SignUp />} />
          <Route exact path="/myOrder" element={<MyOrder />} />


        </Routes>
      </div>
    </Router>
    </CartProvide>
  );
}

export default App;
