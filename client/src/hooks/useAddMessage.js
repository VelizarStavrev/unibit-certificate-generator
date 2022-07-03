import { useContext } from 'react';
import messageContext from '../contexts/messageContext';

export default function useAddMessage() {
    const { currentMessages, setCurrentMessages } = useContext(messageContext);

    function addMessage(messageType, messageText) {
        let newCurrentMessages = [...currentMessages];
        newCurrentMessages.push({ messageType, messageText });
        setCurrentMessages(newCurrentMessages);
    }

    return [addMessage];
}
