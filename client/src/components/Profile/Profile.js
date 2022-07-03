import './Profile.scss';
import Button from '../Shared/Button/Button';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import isLogged from '../../contexts/isLoggedContext';
import useAddMessage from '../../hooks/useAddMessage';

function Profile() {
    const { setLogged } = useContext(isLogged);
    let navigate = useNavigate();
    const [ addMessage ] = useAddMessage();

    function userLogout() {
        // Remove the token
        localStorage.removeItem('token');
        setLogged(false);

        // Redirect the user
        navigate('/login');

        // Set a new message
        addMessage('success', 'User logged out successfully!');
    }

    return (
        <div className='profile-container'>
            {/* TO DO - add the other components when they are designed */}
            <Button buttonText='Logout' buttonType='Primary' buttonMarginTop='true' clickFunction={userLogout} />
        </div>
    );
}

export default Profile;