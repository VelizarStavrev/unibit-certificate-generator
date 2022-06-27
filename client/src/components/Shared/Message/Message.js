import './Message.scss';
import { useContext } from 'react';
import messageContext from '../../../contexts/messageContext';

function Message() {
    const { currentMessages } = useContext(messageContext);

    return (
        <div className='message-container'>
            {Object.keys(currentMessages).length > 0 ? Object.entries(currentMessages).map(([key, value]) => {
                let component = '';

                switch (value.messageType) {
                    case 'success':
                        component = <p className='message-success' key={key} onClick={(e) => e.target.remove()}>{value.messageText}</p>
                        break;

                    case 'error':
                        component = <p className='message-success' key={key} onClick={(e) => e.target.remove()}>{value.messageText}</p>
                        break;

                    default:
                        component = '';
                }

                return component;
            }) : ''}
        </div>
    );
}

export default Message;