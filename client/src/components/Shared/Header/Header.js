import './Header.scss';
import { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import isLogged from '../../../contexts/isLoggedContext';

function Header() {
    const { logged } = useContext(isLogged);
    
    return (
        <header>
            <nav>
                <Link className='link-home' to='/'>certificates</Link>
                
                <ul>
                    {logged ? (
                        <li>
                            <NavLink to='/dashboard'>Dashboard</NavLink>
                        </li>
                    ) : (
                        <li>
                            <NavLink to='/login'>Login</NavLink>
                        </li>
                    )}

                    {logged ? (
                        <li>
                            <NavLink to='/profile'>Profile</NavLink>
                        </li>
                    ) : (
                        <li>
                            <NavLink to='/register'>Register</NavLink>
                        </li>
                    )}

                    <li>
                        <NavLink to='/verify'>Verify</NavLink>
                    </li>

                    <li>
                        <NavLink to='/documentation'>Documentation</NavLink>
                    </li>

                    <li>
                        <NavLink to='/contacts'>Contacts</NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;