import './Table.scss';
import { Link } from 'react-router-dom';
import Button from '../../Shared/Button/Button';
import ButtonLink from '../../Shared/ButtonLink/ButtonLink';
import viewIcon from '../../../assets/icons/view.svg';
import editIcon from '../../../assets/icons/edit.svg';
import deleteIcon from '../../../assets/icons/delete.svg';
import useAddMessage from '../../../hooks/useAddMessage';

function Table(props) {
    const [ addMessage ] = useAddMessage();
    let colSpanValue;
    let buttonLinksTextFirst;
    let buttonLinksLinkFirst;
    let buttonLinksTextSecond;
    let buttonLinksLinkSecond;
    let dashboardHeader;
    let columnName;
    let viewURL;
    let editURL;
    let notFoundMessage;

    switch (props.tableType) {
        case 'template':
            colSpanValue = 4;
            buttonLinksTextFirst = 'Add New';
            buttonLinksLinkFirst = '/dashboard/template/new';
            buttonLinksTextSecond = 'Certificates';
            buttonLinksLinkSecond = '/dashboard/certificates';
            dashboardHeader = 'Your certificate templates';
            columnName = 'Template name';
            viewURL = '/dashboard/template/';
            editURL = '/dashboard/template/edit/';
            notFoundMessage = 'No templates were found.';
            break;

        case 'certificate':
            colSpanValue = 5;
            buttonLinksTextFirst = 'Add New';
            buttonLinksLinkFirst = '/dashboard/certificate/new';
            buttonLinksTextSecond = 'Templates';
            buttonLinksLinkSecond = '/dashboard/templates';
            dashboardHeader = 'Your created certificates';
            columnName = 'Certificate name';
            viewURL = '/certificate/';
            editURL = '/dashboard/certificate/edit/';
            notFoundMessage = 'No certificates were found.';
            break;

        default:
            addMessage('error', 'An error occured.');
            return;
    }

    return (
        <div className='dashboard-container-templates'>
            <div className='dashboard-search-and-nav'>
                {/* TO DO - implement SEARCH */}
                <input className='dashboard-search' placeholder='Search . . .' />

                <ButtonLink buttonText={buttonLinksTextFirst} buttonLink={buttonLinksLinkFirst} buttonType='Primary' buttonMarginLeft='true' />
                <ButtonLink buttonText={buttonLinksTextSecond} buttonLink={buttonLinksLinkSecond} buttonType='Primary' buttonMarginLeft='true' />
            </div>

            <table className='dashboard-table'>
                <thead>
                    <tr>
                        <th colSpan={colSpanValue} className='dashboard-table-header'>{dashboardHeader}</th>
                    </tr>
                    
                    <tr>
                        <th className='dashboard-table-number'>№</th>
                        <th className='dashboard-table-name'>{columnName}</th>
                        <th className='dashboard-table-created'>Date created</th>
                        {props.tableType === 'certificate' ? <th className='dashboard-table-template'>Template used</th> : ''}
                        <th className='dashboard-table-actions'>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {Object.keys(props.tableData).length > 0 ? Object.entries(props.tableData).map(([key, value]) => {
                        function addZeroForTwoDigits(dateData) {
                            return dateData < 10 ? '0' + dateData : dateData;
                        }
                        
                        const dateInitial = new Date(value.created * 1000);
                        const date = addZeroForTwoDigits(dateInitial.getDate()) + '/' + addZeroForTwoDigits(dateInitial.getMonth() + 1) + '/' + addZeroForTwoDigits(dateInitial.getFullYear());

                        return (
                            <tr key={key}>
                                <td className='dashboard-table-number'>{Number(key) + 1}</td>
                                <td className='dashboard-table-name'>{value.name}</td>
                                {props.tableType === 'certificate' ? <td className='dashboard-table-template'>{value.template_name}</td> : ''}
                                <td className='dashboard-table-created'>{date}</td>
                                <td className='dashboard-table-actions'>
                                    <Link className='dashboard-actions-button-link dashboard-actions-item' to={viewURL + value.id}>
                                        <img src={viewIcon} alt='View' />
                                    </Link>

                                    <Link className='dashboard-actions-button-link dashboard-actions-item' to={editURL + value.id}>
                                        <img src={editIcon} alt='Edit' />
                                    </Link>

                                    <button type='button' className='dashboard-actions-item'>
                                        <img src={deleteIcon} alt='Delete' onClick={() => props.deleteFunction(value.id, key)} />
                                    </button>
                                </td>
                            </tr>
                        )
                    }) : <tr className='dashboard-table-message' colSpan={colSpanValue}><td colSpan={colSpanValue}>{notFoundMessage}</td></tr>}
                </tbody>
            </table>

            {props.tableRemainingData.length <= 0 ? '' : <Button buttonText='Load more' buttonType='Primary' buttonMarginBottom='true' clickFunction={props.loadMoreFunction} />}
        </div>
    );
}

export default Table;