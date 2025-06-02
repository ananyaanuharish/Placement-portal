import 'bootswatch/dist/lux/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard'; 
import Placement from './components/Placement';
import Student from './components/Student';
import Internship from './components/Internship';
import AllData from './components/All';
import View from './components/View'
import Login from './components/Login'
import Register from './components/Register'

const App = () => {
  return (
    <Router>
      <div className="container mt-5">
        <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/placement" element={<Placement />} />
        <Route path="/student" element={<Student />} />
        <Route path="/internship" element={<Internship />} />
        <Route path="/all" element={<AllData />} />
        <Route path="/view" element={<View />} />

        </Routes>
      </div>
    </Router>
  );
};

export default App;