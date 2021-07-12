import { APP_NAME} from '../../constants';
import './Navbar.css';

const Navbar = () => {
  return (
    <div className='navbar'>
      <div className='title-div'>
        <h3>{APP_NAME}</h3>
      </div>
    </div>
  );
};

export default Navbar;
