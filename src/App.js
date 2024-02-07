
import './App.css';
import Signup from "./components/Signup";
import Login from "./components/Login";
import HomePage from "./components/Home";
import { BrowserRouter,Route,Routes,Navigate } from 'react-router-dom';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
         
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
