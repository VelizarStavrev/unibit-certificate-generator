import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import viewIcon from '../../../assets/icons/view.svg';
import editIcon from '../../../assets/icons/edit.svg';
import deleteIcon from '../../../assets/icons/delete.svg';
import Button from '../../Shared/Button/Button';
import ButtonLink from '../../Shared/ButtonLink/ButtonLink';
import CertificateService from '../../../services/CertificateService';
import useAddMessage from '../../../hooks/useAddMessage';
import Table from '../../Shared/Table/Table';

function Certificates() {
    const initialCertificates = [];
    const [certificates, setCertificates] = useState(initialCertificates); // empty array or field list
    const [remainingCertificates, setRemainingCertificates] = useState([]); // empty array or field list
    const certificateLimit = 15;
    const [ addMessage ] = useAddMessage();

    // TO DO - add filters in the header tags to make q request with certain data filtering

    // Get the certificates of the current user
    useEffect(() => {
        const certificatesResult = CertificateService.getCertificates();
        
        certificatesResult.then(res => {
            if (res.status) {
                let certificatesToShow = [];
                let certificatesToRemain = [];
                let dataArray = structuredClone(res.data);

                let loopLimit = dataArray.length > certificateLimit ? certificateLimit : dataArray.length;
                
                for (let i = 0; i < loopLimit; i++) {
                    let currentCertificate = dataArray.shift();
                    certificatesToShow.push(currentCertificate);
                }

                certificatesToRemain = dataArray;

                setCertificates(certificatesToShow);
                setRemainingCertificates(certificatesToRemain);

                // Set a new message
                addMessage('success', res.message);
                return;
            }

            // Set a new message
            addMessage('error', res.message ? res.message : 'An error occured.');
        });
    }, []);

    function deleteCertificate(certificateId, arrayIndex) {
        const certificateDeleteResult = CertificateService.deleteCertificate(certificateId);

        certificateDeleteResult.then(res => {
            if (res.status) {
                let allCertificates = structuredClone(certificates);
                delete allCertificates[arrayIndex];
                setCertificates(allCertificates);

                // Set a new message
                addMessage('success', res.message);
                return;
            }

            // Set a new message
            addMessage('error', res.message ? res.message : 'An error occured.');
        });
    }

    // On scroll display for the certificates
    function loadMoreCertificates() {
        let certificatesToShow = [...certificates];
        let certificatesToRemain = [...remainingCertificates];

        let loopLimit = certificatesToRemain.length > certificateLimit ? certificateLimit : certificatesToRemain.length;

        for (let i = 0; i < loopLimit; i++) {
            let currentCertificate = certificatesToRemain.shift();
            certificatesToShow.push(currentCertificate);
        }

        setCertificates(certificatesToShow);
        setRemainingCertificates(certificatesToRemain);
    }

    function searchCertificate() {
        // TO DO
        console.log('Search certificates');
    }

    return (
        <Table  
            tableType={'certificate'} 
            tableData={certificates} 
            tableRemainingData={remainingCertificates}
            deleteFunction={deleteCertificate} 
            searchFunction={searchCertificate} 
            loadMoreFunction={loadMoreCertificates}
        />
    );
}

export default Certificates;