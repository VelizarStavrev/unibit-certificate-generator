import './Header.css';
import { Link, NavLink } from 'react-router-dom';

function Header() {
    return (
        <header>
            <nav>
                <Link className='link-home' to='/'>certificates</Link>

                <ul>
                    <li>
                        <NavLink to='/login'>Login</NavLink>
                    </li>

                    <li>
                        <NavLink to='/Register'>Register</NavLink>
                    </li>

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