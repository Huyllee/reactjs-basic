import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from '../assets/images/logo192.png';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavLink } from "react-router-dom";
import { toast } from 'react-toastify';
import { UserContext } from '../context/UserContext';
import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { handleLogoutRedux } from '../redux/actions/userAction';

const Header = (props) => {

    // const { logout, user } = useContext(UserContext);
    let navigate = useNavigate();
    const location = useLocation();
    const user = useSelector(state => state.user.account);

    const dispatch = useDispatch();

    const [hideHeader, setHideHeader] = useState(false);

    useEffect(() => {
        if (user && user.auth === false) {
            navigate('/');
            toast.success('Logout success')
        }
    }, [user])

    const handleLogout = () => {
        dispatch(handleLogoutRedux());
        // logout();
    }

    return (
        <>
            <Navbar expand="lg" className="light">
                <Container>
                    <NavLink className='navbar-brand' to='/'>
                        <img
                            src={logo}
                            width='30'
                            height='auto'
                            className='d-inline-block align-top'
                        />
                        <span> Manage System</span>
                    </NavLink>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        {(user && user.auth || location.pathname === '/') &&
                            <>
                                <Nav className="me-auto">
                                    <NavLink className='nav-link' to="/">Home</NavLink>
                                    <NavLink className='nav-link' to="/users">Manage Users</NavLink>
                                </Nav>
                                <Nav>
                                    {user && user.email && <span className='nav-link'>Welcome {user.email}</span>}
                                    <NavDropdown title="Settings" id="basic-nav-dropdown">
                                        {user && user.auth === true ?
                                            <NavDropdown.Item onClick={() => handleLogout()}>Logout</NavDropdown.Item> :
                                            <NavLink className='dropdown-item' to="/login">Login</NavLink>
                                        }
                                    </NavDropdown>
                                </Nav>
                            </>
                        }
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}

export default Header;