import './Register.scss';
import Button from '../Shared/Button/Button';
import ButtonLink from '../Shared/ButtonLink/ButtonLink';

function Register() {
    return (
        <div className='register-container'>
            <form>
                <h1>Register</h1>

                <label>E-mail</label>
                <input type='text' name='email' />
                <p className='register-error'>Invalid e-mail!</p>

                <label>Username</label>
                <input type='text' name='username' />
                <p className='register-error'>Invalid username!</p>

                <label>Password</label>
                <input type='password' name='password' />
                <p className='register-error'>Invalid username or password!</p>

                <label>Repeat Password</label>
                <input type='password' name='repassword' />
                <p className='register-error'>Invalid username or password!</p>
                
                <Button buttonText='Register' buttonType='Primary' buttonMarginTop='true' />
                <ButtonLink buttonText='Login' buttonLink='/login' buttonType='Secondary' buttonMarginTop='true' />
            </form>
        </div>
    );
}

export default Register;