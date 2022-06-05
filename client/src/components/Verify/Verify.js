import './Verify.css';
import { Link } from 'react-router-dom';
import successIcon from '../../assets/icons/success.svg';
import errorIcon from '../../assets/icons/error.svg';

function successMessageFunc() {
    return (
        <div className='verify-message-container'>
            <img src={successIcon} alt='' />

            <p>No certificates were found with the provided information.</p>
            <p>You can review it at <Link className='verify-message-link' to='/certificate'>THIS LINK</Link>.</p>
        </div>
    );
}

function errorMessageFunc() {
    return (
        <div className='verify-message-container'>
            <img src={errorIcon} alt='' />

            <p>No certificates were found with the provided information.</p>
        </div>
    );
}

const successMessage = successMessageFunc();
const errorMessage = errorMessageFunc();

function Verify() {
    return (
        <div className='verify-container'>
            <p className='verify-help-text'>Please enter a certificate code to validate it’s existence.</p>

            <div className='verify-search-container'>
                <input className='verify-search' placeholder='Search . . .' />

                <button type='button'>Search</button>
            </div>

            {/* TO DO - create a condition for the message generation */}
            {true ? successMessage : errorMessage}
        </div>
    );
}

export default Verify;