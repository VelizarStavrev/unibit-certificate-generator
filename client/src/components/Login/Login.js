import './Login.scss';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Shared/Button/Button';
import ButtonLink from '../Shared/ButtonLink/ButtonLink';
import UserService from '../../services/UserService';
import isLogged from '../../contexts/isLoggedContext';

function Login() {
    const { setLogged } = useContext(isLogged);
    let navigate = useNavigate();

    function userLogin() {
        const loginResult = UserService.userLoginRequest(username, password);
        
        loginResult.then(res => {
            if (res.status) {
                if (res.token) {
                    // Log the user in - update the app state to logged in
                    localStorage.setItem('token', res.token);
                    setLogged(true);

                    // Redirect the user
                    navigate('/dashboard/certificates');
                }

                setFormError('');
                return;
            }
    
            setFormError(res.message ? res.message : 'An error occured.');
        });
    }

    // Errors
    const [usernameError, setUsernameError] = useState(''); // empty or string
    const [passwordError, setPasswordError] = useState(''); // empty or string
    const [formError, setFormError] = useState(''); // empty or string

    // Form fields
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // TO DO - fix error handling length bug
    function verifyUsername() {
        if (username.length < 3) {
            setUsernameError('The username must be with a length of 3 symbols or higher.');
            return;
        }

        setUsernameError('');
    }

    function verifyPassword() {
        if (password.length < 6) {
            setPasswordError('The password must be with a length of 6 symbols or higher.');
            return;
        }

        setPasswordError('');
    }

    return (
        <div className='login-container'>
            <form>
                <h1>Login</h1>

                <label>Username</label>
                <input type='text' name='username' value={username} onChange={e => {
                        setUsername(e.target.value);
                        verifyUsername();
                    }}
                />
                <p className='login-error'>{usernameError}</p>

                <label>Password</label>
                <input type='password' name='password' value={password} onChange={e => {
                        setPassword(e.target.value);
                        verifyPassword();
                    }} 
                />
                <p className='login-error'>{passwordError}</p>
                <p className='login-error'>{formError}</p>

                <Button buttonText='Login' buttonType='Primary' buttonMarginTop='true' clickFunction={userLogin} />
                <ButtonLink buttonText='Forgotten password?' buttonLink='/password-reset' buttonType='Link' />
                <ButtonLink buttonText='Register' buttonLink='/register' buttonType='Secondary' buttonMarginTop='true' />
            </form>
        </div>
    );
}

export default Login;