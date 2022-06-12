import './Documentation.scss';
import { useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';

function Documentation(props) {
    const { section, topic } = useParams();

    let DocumentationContent;

    if (section === 'website') {
        switch (topic) {
            case 'getting-started':
                DocumentationContent = () => {
                    return (
                        <div className='documentation-content-container'>
                            <p className='documentation-content-header'>Getting started - Website</p>

                            <p>Example text for the content that would be under the title of the selected document section. That can span on multiple roles and have multiple symbols</p>

                            <img src='' alt='' />

                            <p>Example text for the content that would be under the title of the selected document section. That can span on multiple roles and have multiple symbols</p>
                        </div>
                    );
                }
                break;

                // TO DO - Create other cases and make everything look cleaner
    
            case 'introduction':
            default:
                DocumentationContent = () => {
                    return (
                        <div className='documentation-content-container'>
                            <p className='documentation-content-header'>Introduction - Website</p>

                            <p>Example text for the content that would be under the title of the selected document section. That can span on multiple roles and have multiple symbols</p>

                            <img src='' alt='' />

                            <p>Example text for the content that would be under the title of the selected document section. That can span on multiple roles and have multiple symbols</p>
                        </div>
                    );
                }
        }
    } else { // API
        switch (topic) {
            case 'getting-started':
                DocumentationContent = () => {
                    return (
                        <div className='documentation-content-container'>
                            <p className='documentation-content-header'>Getting started - API</p>

                            <p>Example text for the content that would be under the title of the selected document section. That can span on multiple roles and have multiple symbols</p>

                            <img src='' alt='' />

                            <p>Example text for the content that would be under the title of the selected document section. That can span on multiple roles and have multiple symbols</p>
                        </div>
                    );
                }
                break;

            case 'introduction':
            default:
                DocumentationContent = () => {
                    return (
                        <div className='documentation-content-container'>
                            <p className='documentation-content-header'>Introduction - API</p>

                            <p>Example text for the content that would be under the title of the selected document section. That can span on multiple roles and have multiple symbols</p>

                            <img src='' alt='' />

                            <p>Example text for the content that would be under the title of the selected document section. That can span on multiple roles and have multiple symbols</p>
                        </div>
                    );
                }
        }
    }

    const [websiteLinksActive, setWebsiteLinksActive] = useState(section === 'website' ? 'active' : '');
    const [apiLinksActive, setApiLinksActive] = useState(section === 'api' ? 'active' : '');

    return (
        <div className='documentation-container'>
            <div className='documentation-links-container'>
                <div className='documentation-links-website'>
                    <button type='button' className={'documentation-links-header ' + websiteLinksActive} onClick={() => setWebsiteLinksActive(websiteLinksActive ? '' : 'active')}>Website</button>
                    <div className={'documentation-links ' + websiteLinksActive}>
                        <NavLink className='documentation-link' to='/documentation/website/introduction'>Introduction</NavLink>
                        <NavLink className='documentation-link' to='/documentation/website/getting-started'>Getting started</NavLink>
                        <NavLink className='documentation-link' to='/documentation/website/creating-a-template'>Creating a template</NavLink>
                        <NavLink className='documentation-link' to='/documentation/website/viewing-a-template'>Viewing a template</NavLink>
                        <NavLink className='documentation-link' to='/documentation/website/editing-a-template'>Editing a template</NavLink>
                        <NavLink className='documentation-link' to='/documentation/website/deleting-a-template'>Deleting a template</NavLink>
                        <NavLink className='documentation-link' to='/documentation/website/creating-a-certificate'>Creating a certificate</NavLink>
                        <NavLink className='documentation-link' to='/documentation/website/viewing-a-certificate'>Viewing a certificate</NavLink>
                        <NavLink className='documentation-link' to='/documentation/website/editing-a-certificate'>Editing a certificate</NavLink>
                        <NavLink className='documentation-link' to='/documentation/website/deleting-a-certificate'>Deleting a certificate</NavLink>
                    </div>
                </div>

                <div className='documentation-links-api'>
                    <button type='button' className={'documentation-links-header ' + apiLinksActive} onClick={() => setApiLinksActive(apiLinksActive ? '' : 'active')}>API</button>
                    <div className={'documentation-links ' + apiLinksActive}>
                        <NavLink className='documentation-link' to='/documentation/api/introduction'>Introduction</NavLink>
                        <NavLink className='documentation-link' to='/documentation/api/getting-started'>Getting started</NavLink>
                    </div>
                </div>
            </div>

            <DocumentationContent />
        </div>
    );
}

export default Documentation;