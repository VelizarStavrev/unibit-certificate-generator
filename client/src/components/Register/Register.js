import './Register.scss';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Shared/Button/Button';
import ButtonLink from '../Shared/ButtonLink/ButtonLink';
import UserService from '../../services/UserService';
import successIcon from '../../assets/icons/success.svg';
import useAddMessage from '../../hooks/useAddMessage';

function Register() {
    const navigate = useNavigate();
    const [ addMessage ] = useAddMessage();

    function userRegister() {
        const isFormValid = checkFormValidity();

        if (!isFormValid) {
            return;
        }

        const registerResult = UserService.userRegisterRequest(email, username, password, repassword);

        registerResult.then(res => {
            if (res.status) {
                // Clear the form error
                setFormError('');

                // Show the success message
                setFormSuccessDisplay('');

                // Set a new message
                addMessage('success', res.message);

                // Redirect the user
                navigate('/login');
                return;
            }

            switch (res.type) {
                case 'exists-email':
                    setEmailError('E-mail already exists!');
                    break;

                case 'exists-username':
                    setUsernameError('Username already exists!');
                    break;

                case 'error':
                    setFormError('An error occured.');
                    break;
                
                default:
                    break;
            }

            setFormError(res.message ? res.message : 'An error occured.');

            // Set a new message
            addMessage('error', res.message ? res.message : 'An error occured.');
        });
    }

    function checkFormValidity() {
        let isFormValid = true;

        // Check normal requirements
        const emailPattern = /^[A-Za-z0-9]{2,}[._]*[A-Za-z0-9]*@[A-Za-z]{2,}\.[A-Za-z]{2,}$/;

        if (!emailPattern.test(email)) {
            setEmailError('The e-mail must be of a valid format!');
            isFormValid = false;
        }

        if (username.length < 3) {
            setUsernameError('The username must be with a length of 3 symbols or higher.');
            isFormValid = false;
        }

        if (password.length < 6) {
            setPasswordError('The password must be with a length of 6 symbols or higher.');
            isFormValid = false;
        }

        if (repassword !== password) {
            setRepasswordError('The password and repassword must match.');
            isFormValid = false;
        }

        // Check if empty
        if (email.length < 1) {
            setEmailError('Please enter an e-mail!');
            isFormValid = false;
        }

        if (username.length < 1) {
            setUsernameError('Please enter a username!');
            isFormValid = false;
        }

        if (password.length < 1) {
            setPasswordError('Please enter a password!');
            isFormValid = false;
        }

        if (repassword.length < 1) {
            setRepasswordError('Please repeat your password!');
            isFormValid = false;
        }

        return isFormValid;
    }

    // Errors
    const [formError, setFormError] = useState(''); // empty or string
    const [emailError, setEmailError] = useState(''); // empty or string
    const [usernameError, setUsernameError] = useState(''); // empty or string
    const [passwordError, setPasswordError] = useState(''); // empty or string
    const [repasswordError, setRepasswordError] = useState(''); // empty or string

    // Form fields
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRepassword] = useState('');

    function verifyField(e, fieldType) {
        const currentValue = e.target.value;

        switch (fieldType) {
            case 'email':
                setEmail(currentValue);
                const emailPattern = /^[A-Za-z0-9]{2,}[._]*[A-Za-z0-9]*@[A-Za-z]{2,}\.[A-Za-z]{2,}$/;

                if (!emailPattern.test(currentValue)) {
                    setEmailError('The e-mail must be of a valid format!');
                    return;
                }

                setEmailError('');
                break;

            case 'username':
                setUsername(currentValue);

                if (currentValue.length < 3) {
                    setUsernameError('The username must be with a length of 3 symbols or higher.');
                    return;
                }

                setUsernameError('');
                break;

            case 'password':
                setPassword(currentValue);

                if (currentValue !== repassword) {
                    setRepasswordError('The password and repassword must match.');
                }

                if (currentValue.length < 6) {
                    setPasswordError('The password must be with a length of 6 symbols or higher.');
                    return;
                }

                setPasswordError('');
                break;

            case 'repassword':
                setRepassword(currentValue);

                if (currentValue !== password) {
                    setRepasswordError('The password and repassword must match.');
                    return;
                }

                setRepasswordError('');
                break;
            
            default:
                return;
        }
    }

    // Success message
    const [formSuccessDisplay, setFormSuccessDisplay] = useState('hidden');

    return (
        <div className='register-container'>
            <form>
                <h1>Register</h1>

                <div className={formSuccessDisplay ? '' : 'hidden'}>
                    <label>E-mail</label>
                    <input type='text' name='email' value={email} onChange={e => verifyField(e, 'email')} />
                    <p className='register-error'>{emailError}</p>

                    <label>Username</label>
                    <input type='text' name='username' value={username} onChange={e => verifyField(e, 'username')} />
                    <p className='register-error'>{usernameError}</p>

                    <label>Password</label>
                    <input type='password' name='password' value={password} onChange={e => verifyField(e, 'password')} />
                    <p className='register-error'>{passwordError}</p>

                    <label>Repeat Password</label>
                    <input type='password' name='repassword' value={repassword} onChange={e => verifyField(e, 'repassword')} />
                    <p className='register-error'>{repasswordError}</p>
                    <p className='register-error'>{formError}</p>
                    
                    <Button buttonText='Register' buttonType='Primary' buttonMarginTop='true' clickFunction={userRegister} />
                    <ButtonLink buttonText='Login' buttonLink='/login' buttonType='Secondary' buttonMarginTop='true' />
                </div>

                <div className={'register-success ' + (formSuccessDisplay ? 'hidden' : '')}>
                    <img src={successIcon} alt='' />
                    
                    <p>You have successfully registered!</p>
                    <p>You can <ButtonLink buttonText='log in' buttonLink='/login' buttonType='Link' /> with your new account.</p>
                </div>
            </form>
        </div>
    );
}

export default Register;