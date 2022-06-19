import './Register.scss';
import { useState } from 'react';
import Button from '../Shared/Button/Button';
import ButtonLink from '../Shared/ButtonLink/ButtonLink';
import UserService from '../../services/UserService';

function Register() {
    // Form fields
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRepassword] = useState('');

    function userRegister() {
        const registerResult = UserService.userRegisterRequest(email, username, password, repassword);

        registerResult.then(res => {
            console.log(res);

            // TO DO
            // Add success message on registration
            // Add error handling
            if (res.status) {
                setFormError('');
                return;
            }

            setFormError(res.message);
        });
    }

    // Errors
    const [formError, setFormError] = useState(''); // empty or string

    return (
        <div className='register-container'>
            <form>
                <h1>Register</h1>

                <label>E-mail</label>
                <input type='text' name='email' value={email} onChange={e => setEmail(e.target.value)} />
                <p className='register-error'>Invalid e-mail!</p>

                <label>Username</label>
                <input type='text' name='username' value={username} onChange={e => setUsername(e.target.value)} />
                <p className='register-error'>Invalid username!</p>

                <label>Password</label>
                <input type='password' name='password' value={password} onChange={e => setPassword(e.target.value)} />
                <p className='register-error'>Invalid password!</p>

                <label>Repeat Password</label>
                <input type='password' name='repassword' value={repassword} onChange={e => setRepassword(e.target.value)} />
                <p className='register-error'>Passwords do not match!</p>
                <p className='register-error'>{formError}</p>
                
                <Button buttonText='Register' buttonType='Primary' buttonMarginTop='true' clickFunction={userRegister} />
                <ButtonLink buttonText='Login' buttonLink='/login' buttonType='Secondary' buttonMarginTop='true' />
            </form>
        </div>
    );
}

export default Register;