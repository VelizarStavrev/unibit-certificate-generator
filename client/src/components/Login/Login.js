import './Login.css';
import { Link } from 'react-router-dom';

function Login() {
    return (
        <div className='login-container'>
            <form>
                <h1>Login</h1>

                <label>Username</label>
                <input type="text" name="username" />

                <label>Password</label>
                <input type="text" name="username" />
                <p className='login-error'>Invalid username or password!</p>

                <button className='login-button' type='button'>Login</button>
                <Link className='login-link' to='/password-reset'>Forgotten password?</Link>

                <Link className='login-button-link' to='/register'>Register</Link>
            </form>
        </div>
    );
}

export default Login;