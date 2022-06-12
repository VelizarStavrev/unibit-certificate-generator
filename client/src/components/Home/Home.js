import './Home.scss';
import { Link } from 'react-router-dom';
import arrow from '../../assets/icons/arrow.svg';

function Home() {
    return (
        <div className='home-container'>
            <div className='home-header-container'>
                <h1>DESIGN. CREATE. SHARE.</h1>
                <h1>YOUR CERTIFICATES.</h1>
            </div>

            <div className='home-card-container'>
                <Link className='home-card' to='/register'>
                    <p className='home-card-title'>Register</p>
                    <p className='home-card-description'>Register to start creating and sharing certificates!</p>
                    <p className='home-card-arrow'>REGISTER <img src={arrow} alt='' /></p>
                </Link>

                <Link className='home-card' to='/verify'>
                    <p className='home-card-title'>Verify</p>
                    <p className='home-card-description'>Verify that a certificate is exists and is valid!</p>
                    <p className='home-card-arrow'>Verify <img src={arrow} alt='' /></p>
                </Link>

                <Link className='home-card' to='/documentation'>
                    <p className='home-card-title'>Documentation</p>
                    <p className='home-card-description'>View the documentation for users or developers.</p>
                    <p className='home-card-arrow'>Documentation <img src={arrow} alt='' /></p>
                </Link>

                <Link className='home-card' to='/contacts'>
                    <p className='home-card-title'>Contacts</p>
                    <p className='home-card-description'>Contact us if you require assistance or information!</p>
                    <p className='home-card-arrow'>Contacts<img src={arrow} alt='' /></p>
                </Link>
            </div>
        </div>
    );
}

export default Home;