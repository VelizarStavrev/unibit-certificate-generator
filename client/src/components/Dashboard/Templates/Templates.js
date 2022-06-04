import './Templates.css';
import { Link } from 'react-router-dom';
import viewIcon from '../../../assets/icons/view.svg';
import editIcon from '../../../assets/icons/edit.svg';
import deleteIcon from '../../../assets/icons/delete.svg';

function Templates() {
    return (
        <div className='dashboard-container'>
            <div className='dashboard-search-and-nav'>
                <input className='dashboard-search' placeholder='Search . . .' />

                <Link className='dashboard-button-link' to='/dashboard/templates/new'>Add New</Link>

                <Link className='dashboard-button-link' to='/dashboard/certificates'>Certificates</Link>
            </div>

            <table className='dashboard-table'>
                <thead>
                    <tr>
                        <th colspan='5' className='dashboard-table-header'>Your certificate templates</th>
                    </tr>
                    
                    <tr>
                        <th className='dashboard-table-number'>№</th>
                        <th className='dashboard-table-name'>Template name</th>
                        <th className='dashboard-table-created'>Date created</th>
                        <th className='dashboard-table-actions'>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td className='dashboard-table-number'>1</td>
                        <td className='dashboard-table-name'>Template Name</td>
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
                        <td className='dashboard-table-name'>Template Name</td>
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
                        <td className='dashboard-table-name'>Template Name</td>
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

export default Templates;