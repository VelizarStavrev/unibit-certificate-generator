import './Register.css';
import { Link } from 'react-router-dom';

function Register() {
    return (
        <div className='register-container'>
            <form>
                <h1>Register</h1>

                <label>E-mail</label>
                <input type="text" name="username" />
                <p className='register-error'>Invalid e-mail!</p>

                <label>Username</label>
                <input type="text" name="username" />
                <p className='register-error'>Invalid username!</p>

                <label>Password</label>
                <input type="text" name="username" />
                <p className='register-error'>Invalid username or password!</p>

                <label>Repeat Password</label>
                <input type="text" name="username" />
                <p className='register-error'>Invalid username or password!</p>
                
                <button className='register-button' type='button'>Register</button>

                <Link className='register-button-link' to='/login'>Login</Link>
            </form>
        </div>
    );
}

export default Register;