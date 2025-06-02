import { Link } from 'react-router-dom';
import 'bootswatch/dist/lux/bootstrap.min.css';
import image1 from '../assets/rvce.logo.png';
import image2 from '../assets/rvce.write.png';

const Dashboard = () => {
  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
      {/* Add the left logo */}
      <div style={{ position: 'absolute', top: '15px', left: '15px' }}>
        <img src={image1} alt="RVCE Logo" style={{ width: '130px' }} />
      </div>
      {/* Add the right logo */}
      <div style={{ position: 'absolute', top: '10px', right: '15px' }}>
        <img src={image2} alt="RVCE" style={{ width: '300px' }} />
      </div>

      {/* Add margin top for spacing */}
      <h2 className="text-center mb-4">Placement Portal</h2> {/* Center the text and add margin bottom */}
      <nav className="text-center">
        <Link to="/login" className="btn btn-primary me-2">
          Login
        </Link>{' '}
        {/* Add button styles */}
        <Link to="/register" className="btn btn-success">
          Register
        </Link>{' '}
        {/* Add button styles */}
      </nav>
    </div>
  );
};

export default Dashboard;
