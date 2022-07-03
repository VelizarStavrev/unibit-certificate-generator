import './Templates.scss';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import viewIcon from '../../../assets/icons/view.svg';
import editIcon from '../../../assets/icons/edit.svg';
import deleteIcon from '../../../assets/icons/delete.svg';
import ButtonLink from '../../Shared/ButtonLink/ButtonLink';
import TemplateService from '../../../services/TemplateService';
import useAddMessage from '../../../hooks/useAddMessage';

function Templates() {
    const initialTemplates = {};
    const [templates, setTemplates] = useState(initialTemplates); // empty object or field list
    const [ addMessage ] = useAddMessage();

    // TO DO - add load on scroll for data if it's over a certain amount
    // TO DO - add filters in the header tags to make q request with certain data filtering

    // Get the templates of the current user
    useEffect(() => {
        const templatesResult = TemplateService.getTemplates();
        
        templatesResult.then(res => {
            if (res.status) {
                setTemplates(res.data);
            
                // Set a new message
                addMessage('success', res.message);
                return;
            }

            // Set a new message
            addMessage('error', res.message ? res.message : 'An error occured.');
        });
    }, []);

    function deleteTemplate(templateId, arrayIndex) {
        const templateDeleteResult = TemplateService.deleteTemplate(templateId);
        
        templateDeleteResult.then(res => {
            if (res.status) {
                let allTemplates = structuredClone(templates);
                delete allTemplates[arrayIndex];
                setTemplates(allTemplates);
                
                // Set a new message
                addMessage('success', res.message);
                return;
            }

            // Set a new message
            addMessage('error', res.message ? res.message : 'An error occured.');
        });
    }

    return (
        <div className='dashboard-container-templates'>
            <div className='dashboard-search-and-nav'>
                <input className='dashboard-search' placeholder='Search . . .' />

                <ButtonLink buttonText='Add New' buttonLink='/dashboard/template/new' buttonType='Primary' buttonMarginLeft='true' />
                <ButtonLink buttonText='Certificates' buttonLink='/dashboard/certificates' buttonType='Primary' buttonMarginLeft='true' />
            </div>

            <table className='dashboard-table'>
                <thead>
                    <tr>
                        <th colSpan='4' className='dashboard-table-header'>Your certificate templates</th>
                    </tr>
                    
                    <tr>
                        <th className='dashboard-table-number'>№</th>
                        <th className='dashboard-table-name'>Template name</th>
                        <th className='dashboard-table-created'>Date created</th>
                        <th className='dashboard-table-actions'>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {Object.keys(templates).length > 0 ? Object.entries(templates).map(([key, value]) => {
                        function addZeroForTwoDigits(dateData) {
                            return dateData < 10 ? '0' + dateData : dateData;
                        }
                        
                        const dateInitial = new Date(value.created * 1000);
                        const date = addZeroForTwoDigits(dateInitial.getDate()) + '/' + addZeroForTwoDigits(dateInitial.getMonth() + 1) + '/' + addZeroForTwoDigits(dateInitial.getFullYear());

                        return (
                            <tr key={key}>
                                <td className='dashboard-table-number'>{Number(key) + 1}</td>
                                <td className='dashboard-table-name'>{value.name}</td>
                                <td className='dashboard-table-created'>{date}</td>
                                <td className='dashboard-table-actions'>
                                    <Link className='dashboard-actions-button-link dashboard-actions-item' to={`/dashboard/template/${value.id}`}>
                                        <img src={viewIcon} alt='View' />
                                    </Link>

                                    <Link className='dashboard-actions-button-link dashboard-actions-item' to={`/dashboard/template/edit/${value.id}`}>
                                        <img src={editIcon} alt='Edit' />
                                    </Link>

                                    <button type='button' className='dashboard-actions-item'>
                                        <img src={deleteIcon} alt='Delete' onClick={() => deleteTemplate(value.id, key)} />
                                    </button>
                                </td>
                            </tr>
                        )
                    }) : <tr className='dashboard-table-message' colSpan='4'><td colSpan='4'>No templates were found.</td></tr>}
                </tbody>
            </table>
        </div>
    );
}

export default Templates;