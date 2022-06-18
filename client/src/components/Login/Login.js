import './Login.scss';
import Button from '../Shared/Button/Button';
import ButtonLink from '../Shared/ButtonLink/ButtonLink';

function Login() {
    return (
        <div className='login-container'>
            <form>
                <h1>Login</h1>

                <label>Username</label>
                <input type='text' name='username' />

                <label>Password</label>
                <input type='password' name='password' />
                <p className='login-error'>Invalid username or password!</p>

                <Button buttonText='Login' buttonType='Primary' buttonMarginTop='true' />
                <ButtonLink buttonText='Forgotten password?' buttonLink='/password-reset' buttonType='Link' />
                <ButtonLink buttonText='Register' buttonLink='/register' buttonType='Secondary' buttonMarginTop='true' />
            </form>
        </div>
    );
}

export default Login;