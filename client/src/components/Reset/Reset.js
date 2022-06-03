import './Reset.css';
import { Link } from 'react-router-dom';

function Reset() {
    return (
        <div className='reset-container'>
            <form>
                <h1>Reset</h1>

                <label>E-mail / Username</label>
                <input type="text" name="username" />
                <p className='reset-error'>Invalid username or password!</p>

                <button className='reset-button' type='button'>Reset</button>
                <Link className='reset-link' to='/register'>Don't have an account?</Link>

                <Link className='reset-button-link' to='/login'>Login</Link>
            </form>
        </div>
    );
}

export default Reset;