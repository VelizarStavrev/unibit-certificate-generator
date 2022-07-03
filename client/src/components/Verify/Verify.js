import './Verify.scss';
import { useEffect, useContext, useState } from 'react';
import mainClass from '../../contexts/mainClassContext';
import successIcon from '../../assets/icons/success.svg';
import errorIcon from '../../assets/icons/error.svg';
import Button from '../Shared/Button/Button';
import ButtonLink from '../Shared/ButtonLink/ButtonLink';
import CertificateService from '../../services/CertificateService';

function Verify() {
    const { setClass } = useContext(mainClass);

    useEffect(() => {
        setClass('main-verify-component');
    }, [setClass]);

    const [certificateId, setCertificateId] = useState('');
    const [isMessagePositive, setIsMessagePositive] = useState('');

    function verifyCertificate() {
        const certificateNewResult = CertificateService.verifyCertificate(certificateId);

        certificateNewResult.then(res => {
            if (res.status) {
                setIsMessagePositive('success');
                return;
            }

            setIsMessagePositive('error');
        });
    }

    // The possible messages to be displayed
    function successMessageFunc() {
        return (
            <div className='verify-message-container'>
                <img src={successIcon} alt='' />
    
                <p>The certificate was found!</p>
                <p>You can view it at <ButtonLink buttonText='THIS LINK' buttonLink={`/certificate/${certificateId}`} buttonType='Link' />.</p>
            </div>
        );
    }
    
    function errorMessageFunc() {
        return (
            <div className='verify-message-container'>
                <img src={errorIcon} alt='' />
    
                <p>No certificates were found with the provided information.</p>
            </div>
        );
    }
    
    const successMessage = successMessageFunc();
    const errorMessage = errorMessageFunc();

    return (
        <div className='verify-container'>
            <p className='verify-help-text'>Please enter a certificate code to validate it’s existence.</p>

            <div className='verify-search-container'>
                <input className='verify-search' placeholder='Search . . .' value={certificateId} onChange={e => setCertificateId(e.target.value)} />
                
                <Button buttonText='Search' buttonType='Primary' buttonMarginLeft='true' clickFunction={verifyCertificate} />
            </div>

            {isMessagePositive === 'success' ? successMessage : (isMessagePositive === 'error' ? errorMessage : '')}
        </div>
    );
}

export default Verify;