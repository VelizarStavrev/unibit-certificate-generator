import './Footer.scss';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer>
            <div className='footer-text-and-link-container'>
                <div></div>

                <p>© 2022 Certificates</p>

                <ul>
                    <li>
                        <Link to='/terms-of-use'>Terms of use</Link>
                    </li>

                    <li>
                        <Link to='/privacy-policy'>Privacy policy</Link>
                    </li>
                </ul>
            </div>
        </footer>
    );
}

export default Footer;