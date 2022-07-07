import './Certificates.scss';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import viewIcon from '../../../assets/icons/view.svg';
import editIcon from '../../../assets/icons/edit.svg';
import deleteIcon from '../../../assets/icons/delete.svg';
import Button from '../../Shared/Button/Button';
import ButtonLink from '../../Shared/ButtonLink/ButtonLink';
import CertificateService from '../../../services/CertificateService';
import useAddMessage from '../../../hooks/useAddMessage';

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

    return (
        <div className='dashboard-container-certificates'>
            <div className='dashboard-search-and-nav'>
                <input className='dashboard-search' placeholder='Search . . .' />

                <ButtonLink buttonText='Add New' buttonLink='/dashboard/certificate/new' buttonType='Primary' buttonMarginLeft='true' />
                <ButtonLink buttonText='Templates' buttonLink='/dashboard/templates' buttonType='Primary' buttonMarginLeft='true' />
            </div>

            <table className='dashboard-table'>
                <thead>
                    <tr>
                        <th colSpan='5' className='dashboard-table-header'>Your generated certificates</th>
                    </tr>
                    
                    <tr>
                        <th className='dashboard-table-number'>№</th>
                        <th className='dashboard-table-name'>Certificate name</th>
                        <th className='dashboard-table-template'>Template used</th>
                        <th className='dashboard-table-created'>Date created</th>
                        <th className='dashboard-table-actions'>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {Object.keys(certificates).length > 0 ? Object.entries(certificates).map(([key, value]) => {
                        function addZeroForTwoDigits(dateData) {
                            return dateData < 10 ? '0' + dateData : dateData;
                        }
                        
                        const dateInitial = new Date(value.created * 1000);
                        const date = addZeroForTwoDigits(dateInitial.getDate()) + '/' + addZeroForTwoDigits(dateInitial.getMonth() + 1) + '/' + addZeroForTwoDigits(dateInitial.getFullYear());

                        return (
                            <tr key={key}>
                                <td className='dashboard-table-number'>{Number(key) + 1}</td>
                                <td className='dashboard-table-name'>{value.name}</td>
                                <td className='dashboard-table-template'>{value.template_name}</td>
                                <td className='dashboard-table-created'>{date}</td>
                                <td className='dashboard-table-actions'>
                                    <Link className='dashboard-actions-button-link dashboard-actions-item' to={`/certificate/${value.id}`}>
                                        <img src={viewIcon} alt='View' />
                                    </Link>

                                    <Link className='dashboard-actions-button-link dashboard-actions-item' to={`/dashboard/certificate/edit/${value.id}`}>
                                        <img src={editIcon} alt='Edit' />
                                    </Link>

                                    <button type='button' className='dashboard-actions-item'>
                                        <img src={deleteIcon} alt='Delete' onClick={() => deleteCertificate(value.id, key)} />
                                    </button>
                                </td>
                            </tr>
                        )
                    }) : <tr className='dashboard-table-message' colSpan='5'><td colSpan='5'>No certificates were found.</td></tr>}
                </tbody>
            </table>
            
            {remainingCertificates.length <= 0 ? '' : <Button buttonText='Load more' buttonType='Primary' buttonMarginBottom='true' clickFunction={loadMoreCertificates} />}
        </div>
    );
}

export default Certificates;