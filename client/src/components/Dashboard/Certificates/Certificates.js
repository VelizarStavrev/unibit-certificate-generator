import './Certificates.scss';
import { Link } from 'react-router-dom';
import viewIcon from '../../../assets/icons/view.svg';
import editIcon from '../../../assets/icons/edit.svg';
import deleteIcon from '../../../assets/icons/delete.svg';
import ButtonLink from '../../Shared/ButtonLink/ButtonLink';

function Certificates() {
    return (
        <div className='dashboard-container-certificates'>
            <div className='dashboard-search-and-nav'>
                <input className='dashboard-search' placeholder='Search . . .' />

                <ButtonLink buttonText='Add New' buttonLink='/dashboard/certificates/new' buttonType='Primary' buttonMarginLeft='true' />
                <ButtonLink buttonText='Templates' buttonLink='/dashboard/templates' buttonType='Primary' buttonMarginLeft='true' />
            </div>

            <table className='dashboard-table'>
                <thead>
                    <tr>
                        <th colSpan='5' className='dashboard-table-header'>Your generated certificates</th>
                    </tr>
                    
                    <tr>
                        <th className='dashboard-table-number'>№</th>
                        <th className='dashboard-table-name'>Names on certificate</th>
                        <th className='dashboard-table-template'>Template used</th>
                        <th className='dashboard-table-created'>Date created</th>
                        <th className='dashboard-table-actions'>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td className='dashboard-table-number'>1</td>
                        <td className='dashboard-table-name'>FirstName LastName</td>
                        <td className='dashboard-table-template'>Certificate #1</td>
                        <td className='dashboard-table-created'>12.12.2022</td>
                        <td className='dashboard-table-actions'>
                            <Link className='dashboard-actions-button-link dashboard-actions-item' to='/certificate/id'>
                                <img src={viewIcon} alt='View' />
                            </Link>

                            <Link className='dashboard-actions-button-link dashboard-actions-item' to='/certificate/edit/id'>
                                <img src={editIcon} alt='Edit' />
                            </Link>

                            <button type='button' className='dashboard-actions-item'>
                                <img src={deleteIcon} alt='Delete' />
                            </button>
                        </td>
                    </tr>

                    <tr>
                        <td className='dashboard-table-number'>1</td>
                        <td className='dashboard-table-name'>FirstName LastName</td>
                        <td className='dashboard-table-template'>Certificate #1</td>
                        <td className='dashboard-table-created'>12.12.2022</td>
                        <td className='dashboard-table-actions'>
                            <Link className='dashboard-actions-button-link dashboard-actions-item' to='/certificate/id'>
                                <img src={viewIcon} alt='View' />
                            </Link>

                            <Link className='dashboard-actions-button-link dashboard-actions-item' to='/certificate/edit/id'>
                                <img src={editIcon} alt='Edit' />
                            </Link>

                            <button type='button' className='dashboard-actions-item'>
                                <img src={deleteIcon} alt='Delete' />
                            </button>
                        </td>
                    </tr>

                    <tr>
                        <td className='dashboard-table-number'>1</td>
                        <td className='dashboard-table-name'>FirstName LastName</td>
                        <td className='dashboard-table-template'>Certificate #1</td>
                        <td className='dashboard-table-created'>12.12.2022</td>
                        <td className='dashboard-table-actions'>
                            <Link className='dashboard-actions-button-link dashboard-actions-item' to='/certificate/id'>
                                <img src={viewIcon} alt='View' />
                            </Link>

                            <Link className='dashboard-actions-button-link dashboard-actions-item' to='/certificate/edit/id'>
                                <img src={editIcon} alt='Edit' />
                            </Link>

                            <button type='button' className='dashboard-actions-item'>
                                <img src={deleteIcon} alt='Delete' />
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default Certificates;