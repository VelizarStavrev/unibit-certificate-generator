import './Reset.scss';
import Button from '../Shared/Button/Button';
import ButtonLink from '../Shared/ButtonLink/ButtonLink';

function Reset() {
    return (
        <div className='reset-container'>
            <form>
                <h1>Reset</h1>

                <label>E-mail / Username</label>
                <input type='text' name='username' />
                <p className='reset-error'>Invalid username or password!</p>

                <Button buttonText='Reset' buttonType='Primary' buttonMarginTop='true' />
                <ButtonLink buttonText="Don't have an account?" buttonLink='/register' buttonType='Link' />
                <ButtonLink buttonText='Login' buttonLink='/login' buttonType='Secondary' buttonMarginTop='true' />
            </form>
        </div>
    );
}

export default Reset;