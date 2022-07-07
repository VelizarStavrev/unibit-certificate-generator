import '../Certificate.scss';
import { useState, useEffect, useContext } from 'react';
import mainClass from '../../../../contexts/mainClassContext';
import CertificateService from '../../../../services/CertificateService';
import { useParams } from 'react-router-dom';
import useAddMessage from '../../../../hooks/useAddMessage';

function Certificate() {
    // Set the class of the main containter to be for this specific page
    const { setClass } = useContext(mainClass);

    useEffect(() => {
        setClass('main-template-component');
    }, [setClass]);

    // Template related functionality
    const [ addMessage ] = useAddMessage();

    // Initial field structure and list
    const { certificateId } = useParams();
    const [certificateURL, setCertificateURL] = useState('');

    // Get the certificates of the current user
    useEffect(() => {
        const certificateResult = CertificateService.getCertificateFile(certificateId);
        
        certificateResult.then(res => {
            if (res.status) {
                setCertificateURL(res.url);

                // Set a new message
                addMessage('success', res.message);
                return;
            }

            // Set a new message
            addMessage('error', res.message ? res.message : 'An error occured.');
        });
    }, [certificateId]);

    return (
        <div className='certificate-container certificate-container-file'>
            {console.log(certificateId)}
            <iframe src={certificateURL} title={'Certificate with ID: ' + certificateId}></iframe>
        </div>
    );
}

export default Certificate;