import './Certificate.scss';
import { useState, useEffect, useContext } from 'react';
import mainClass from '../../../contexts/mainClassContext';
import editIcon from '../../../assets/icons/edit.svg';
import Button from '../../Shared/Button/Button';
import ButtonLink from '../../Shared/ButtonLink/ButtonLink';
import TemplateService from '../../../services/TemplateService';
import CertificateService from '../../../services/CertificateService';
import { useParams, useNavigate } from 'react-router-dom';
import messageContext from '../../../contexts/messageContext';

function Certificate(props) {
    // Set the class of the main containter to be for this specific page
    // TO DO - add auto generated fields
    // TO DO - add empty field errors and requirements for all template types
    // TO DO - add image upload
    const { setClass } = useContext(mainClass);

    useEffect(() => {
        setClass('main-template-component');
    }, [setClass]);

    // Template related functionality
    const navigate = useNavigate();
    const { currentMessages, setCurrentMessages } = useContext(messageContext);

    function saveCertificate() {
        let fieldList = structuredClone(currentFieldList);
        let fieldListFinal = {};

        for (const field in fieldList) {
            let currentField = fieldList[field];

            switch (currentField.type) {
                case 'Text':
                case 'Link':
                    if (currentField.properties.editable.value === 1 || currentField.properties.editable.value === '1') {
                        const contentField = currentField.properties.content;
                        fieldListFinal[contentField.field_id] = {
                            id: contentField.field_id,
                            type: contentField.type,
                            name: contentField.name,
                            value: contentField.value
                        };
                    }

                    break;

                case 'Image':
                    // TO DO
                    break

                default:
                    // TO DO
            }
        }

        let data = {
            name: certificateName,
            notes: certificateNotes,
            template_id: templateValue,
            fields: fieldListFinal
        }

        switch (props.certificateType) {
            case 'new':
                const certificateNewResult = CertificateService.createCertificate(data);

                certificateNewResult.then(res => {
                    if (res.status) {
                        let newCurrentMessages = [...currentMessages];
                        newCurrentMessages.push({messageType: 'success', messageText: 'Certificate creation successful!'});
                        setCurrentMessages(newCurrentMessages);

                        // Redirect the user
                        navigate('/dashboard/certificates/');
                        return;
                    }

                    let newCurrentMessages = [...currentMessages];
                    newCurrentMessages.push({messageType: 'error', messageText: 'An error occured when creating the certificate!'});
                    setCurrentMessages(newCurrentMessages);
                });
                break;

            case 'edit':
                const certificateEditResult = CertificateService.editCertificate(certificateId, data);

                certificateEditResult.then(res => {
                    if (res.status) {
                        let newCurrentMessages = [...currentMessages];
                        newCurrentMessages.push({messageType: 'success', messageText: 'Certificate edit successful!'});
                        setCurrentMessages(newCurrentMessages);

                        // Redirect the user
                        navigate('/dashboard/certificates/');
                        return;
                    }

                    let newCurrentMessages = [...currentMessages];
                    newCurrentMessages.push({messageType: 'error', messageText: 'An error occured when editing the certificate!'});
                    setCurrentMessages(newCurrentMessages);
                });
                break;

            default:
                // TO DO
        }
    }

    function resetCertificate() {
        // Different functionalities depending on the template type
        switch (props.certificateType) {
            case 'new':
                // Set the initial empty structure
                setCertificateName('');
                setCertificateNotes('');
                setTemplateValue('');
                setCurrentFieldList(initialFieldStructure);
                setCertificateOrientation('vertical');
                break;

            case 'edit':
                // Call the saved data from the server
                getCertificateById(certificateId);
                break;

            default:
                // TO DO
        }
    }

    function regenerateCertificate() {
        // TO DO
        // Regenerates the file on the BE
    }

    function deleteCertificate() {
        const certificateDeleteResult = CertificateService.deleteCertificate(certificateId);

        certificateDeleteResult.then(res => {
            if (res.status) {
                let newCurrentMessages = [...currentMessages];
                newCurrentMessages.push({messageType: 'success', messageText: res.message});
                setCurrentMessages(newCurrentMessages);

                // Redirect the user
                navigate('/dashboard/certificates/');
                return;
            }

            let newCurrentMessages = [...currentMessages];
            newCurrentMessages.push({messageType: 'error', messageText: res.message});
            setCurrentMessages(newCurrentMessages);
        });
    }

    function getCertificateById(certificateIdReceived) {
        setFieldSettingsMenuDisplay('hidden');
        setCurrentFieldListActive('');
        
        const certificateResult = CertificateService.getCertificate(certificateIdReceived);

        certificateResult.then(res => {
            // TO DO - give an output to the user

            if (res.status) {
                // Set the certificate and template data variables
                let dataCertificate = res.data;
                let data = res.template_data;
                
                // Set the certificate data
                function addZeroForTwoDigits(dateData) {
                    return dateData < 10 ? '0' + dateData : dateData;
                }

                function getDateAndTimeFromTimestamp(currentTimestamp) {
                    const dateInitial = new Date(currentTimestamp * 1000);
                    const date = addZeroForTwoDigits(dateInitial.getDate()) + '/' + addZeroForTwoDigits(dateInitial.getMonth() + 1) + '/' + addZeroForTwoDigits(dateInitial.getFullYear());
                    const time = addZeroForTwoDigits(dateInitial.getHours()) + ':' + addZeroForTwoDigits(dateInitial.getMinutes());
                    const dateFinal = date + ' - ' + time;
                    return dateFinal;
                }

                const dateCreated = getDateAndTimeFromTimestamp(dataCertificate.created);
                const dateEdited = getDateAndTimeFromTimestamp(dataCertificate.edited);

                setCertificateName(dataCertificate.name);
                setCertificateCreatedDate(dateCreated);
                setCertificateEditedDate(dateEdited);
                setCertificateNotes(dataCertificate.notes);
                setTemplateValue(dataCertificate.template_id);

                // Set the certificate data in the template data
                for (let field in dataCertificate.fields) {
                    let currentField = dataCertificate.fields[field];
                    let currentFieldInTemplate = data.fields[field];
                    currentFieldInTemplate.properties[currentField.name].value = currentField.value;
                }

                // Set the template data
                for (let field in data.fields) {
                    let properties = data.fields[field].properties;

                    for (let property in properties) {
                        let currentProperty = properties[property];

                        if (currentProperty.unit === 'NULL') {
                            delete currentProperty.unit;
                        }

                        if (currentProperty.units === 'NULL') {
                            delete currentProperty.units;
                        }

                        if (currentProperty.options === 'NULL') {
                            delete currentProperty.options;
                        }

                        if (currentProperty.units) {
                            currentProperty.units = currentProperty.units.split(', ');
                        }

                        if (currentProperty.options) {
                            currentProperty.options = currentProperty.options.split(', ');
                        }
                    }
                }

                setCertificateOrientation(data.orientation);
                setCurrentFieldList(data.fields);
            }
        });
    }

    function getTemplateById(templateIdReceived) {
        setTemplateValue(templateIdReceived);
        setFieldSettingsMenuDisplay('hidden');
        setCurrentFieldListActive('');
        
        const templateResult = TemplateService.getTemplate(templateIdReceived);

        templateResult.then(res => {
            // TO DO - give an output to the user

            if (res.status) {
                let data = res.data;

                for (let field in data.fields) {
                    let properties = data.fields[field].properties;

                    for (let property in properties) {
                        let currentProperty = properties[property];

                        if (currentProperty.unit === 'NULL') {
                            delete currentProperty.unit;
                        }

                        if (currentProperty.units === 'NULL') {
                            delete currentProperty.units;
                        }

                        if (currentProperty.options === 'NULL') {
                            delete currentProperty.options;
                        }

                        if (currentProperty.units) {
                            currentProperty.units = currentProperty.units.split(', ');
                        }

                        if (currentProperty.options) {
                            currentProperty.options = currentProperty.options.split(', ');
                        }
                    }
                }

                setCertificateOrientation(data.orientation);
                setCurrentFieldList(data.fields);
            }
        });
    }

    // Initial field structure and list
    const [templateValue, setTemplateValue] = useState('');
    const [templates, setTemplates] = useState({}); // empty object or field list
    const { certificateId } = useParams();
    const initialFieldStructure = {};
    const [certificateName, setCertificateName] = useState(''); // name or empty
    const [certificateCreatedDate, setCertificateCreatedDate] = useState(''); // date or empty
    const [certificateEditedDate, setCertificateEditedDate] = useState(''); // date or empty
    const [certificateNotes, setCertificateNotes] = useState(''); // text or empty

    const [certificateOrientation, setCertificateOrientation] = useState('vertical'); // vertical or horizontal
    const [currentFieldList, setCurrentFieldList] = useState(initialFieldStructure); // empty object or field list

    // Edit field menu functionality
    const initialFieldSettingsMenuValues = {
        id: '',
        type: '',
        properties: {}
    };

    const [fieldSettingsMenuDisplay, setFieldSettingsMenuDisplay] = useState('hidden'); // hidden or ''
    const [fieldSettingsMenuValues, setFieldSettingsMenuValues] = useState(initialFieldSettingsMenuValues); // object with values or ''
    const [currentFieldListActive, setCurrentFieldListActive] = useState(initialFieldSettingsMenuValues); // field id or ''

    function editField(fieldId) {
        setFieldSettingsMenuValues(currentFieldList[fieldId]);
        setCurrentFieldListActive(fieldId);
        setFieldSettingsMenuDisplay('');
    }

    function updateField(fieldId, fieldPropertyName, fieldPropertyValue) {
        let fieldList = structuredClone(currentFieldList);
        fieldList[fieldId].properties[fieldPropertyName].value = fieldPropertyValue;
        setCurrentFieldList(fieldList);
        setFieldSettingsMenuValues(fieldList[fieldId]);
    }

    // Certificate display functionality
    function getFieldStyles(properties) {
        let currentProperties = structuredClone(properties);

        for (let property in currentProperties) {
            if (['content', 'url', 'editable', 'unit', 'units'].includes(property)) {
                continue;
            }

            if (property === 'transform') {
                currentProperties[property].value = 'rotate(' + currentProperties[property].value + 'deg)';
            }

            if (['left', 'top', 'maxWidth', 'fontSize', 'height', 'width'].includes(property)) {
                currentProperties[property].value = currentProperties[property].value + currentProperties[property].unit;
            }
        }

        let finalCSSObject = {};

        for (let property in currentProperties) {
            let currentCSSProperty = property;
            let currentCSSValue = currentProperties[property].value;
            finalCSSObject[currentCSSProperty] = currentCSSValue;
        }

        finalCSSObject['position'] = 'absolute';
        return finalCSSObject;
    }

    // Certificate type functionality
    useEffect(() => {
        // Get all templates
        const templatesResult = TemplateService.getTemplates();
        
        templatesResult.then(res => {
            if (res.status) {
                setTemplates(res.data);
            }

            // TO DO
            // Error handling
        });
        
        switch (props.certificateType) {
            case 'new':
                // Nothing
                break;

            case 'edit':
                getCertificateById(certificateId);
                break;

            default:
                // TO DO - ERROR
        }
    }, [props.certificateType, certificateId]);

    return (
        <div className='certificate-container'>
            <div className='certificate-container-text-container'>
                <div className='certificate-text-pair-two-rows'>
                    <p className='certificate-text-pair-header'>Certificate name:</p>
                    <input type='text' value={certificateName} onChange={(e) => setCertificateName(e.target.value)} />
                </div>

                <div className='certificate-text-pair-two-rows'>
                    <p className='certificate-text-pair-header'>Certificate template:</p>

                    <select value={templateValue} onChange={(e) => getTemplateById(e.target.value)}>
                        <option value='' disabled></option>
                        {Object.keys(templates).length > 0 ? Object.entries(templates).map(([key, value]) => {
                            return <option key={key} value={value.id}>{value.name}</option>
                        }) : ''}
                    </select>
                </div>

                {props.certificateType !== 'new' ? (
                    <div className='certificate-text-pair-one-row'>
                        <p className='certificate-text-pair-header'>Created date:</p>
                        <p>{certificateCreatedDate}</p>
                    </div>
                ) : ''}

                {props.certificateType !== 'new' ? (
                    <div className='certificate-text-pair-one-row'>
                        <p className='certificate-text-pair-header'>Last edit date:</p>
                        <p>{certificateEditedDate}</p>
                    </div>
                ) : ''}

                <div className='certificate-text-pair-two-rows'>
                    <p className='certificate-text-pair-header'>Notes:</p>
                    <textarea value={certificateNotes} onChange={(e) => setCertificateNotes(e.target.value)}></textarea>
                </div>
            </div>

            <div className='certificate-certificate-and-fields-container'>
                <div className='certificate-certificate-main-container'>
                    {/* The following code is used for a better FE display */}
                    <div className='certificate-certificate-container-FE'>
                        <div className={certificateOrientation === 'vertical' ? 'certificate-certificate-container-vertical' : 'certificate-certificate-container-horizontal'}>
                            {/* The following code is sent entirely to the BE */}
                            <div id='certificate-container' className='certificate-certificate-container' style={
                                {
                                    width: '100%',
                                    height: '100%',
                                    position: 'relative',
                                    overflow: 'hidden',
                                }
                            }>
                                {/* Display all fields in the certificate window */}
                                {Object.keys(currentFieldList).length > 0 ? Object.entries(currentFieldList).map(([key, value]) => {
                                    const currentFieldStyleSettings = getFieldStyles(value.properties);

                                    if (value.properties.editable.value === 1 || value.properties.editable.value === '1') {
                                        switch (value.type) {
                                            case 'Text':
                                                return (
                                                    <div draggable='true' key={key} style={currentFieldStyleSettings}
                                                        onClick={() => editField(key)} className={currentFieldListActive === key ? 'active' : ''}
                                                    >
                                                        {value['properties'].content.value}
                                                    </div>
                                                );

                                            case 'Image':
                                                return (
                                                    <div draggable='true' key={key} style={currentFieldStyleSettings}
                                                        onClick={() => editField(key)} className={currentFieldListActive === key ? 'active' : ''}
                                                    >
                                                        <img style={{ height: 'inherit', width: 'inherit' }} src={value['properties'].url.value} alt='' />
                                                    </div>
                                                );

                                            case 'Link':
                                                return (
                                                    <div draggable='true' key={key} style={currentFieldStyleSettings}
                                                        onClick={() => editField(key)} className={currentFieldListActive === key ? 'active' : ''}
                                                    >
                                                        <a style={{ fontSize: 'inherit', color: 'inherit', textDecoration: 'inherit' }} href={value['properties'].url.value}>{value['properties'].content.value}</a>
                                                    </div>
                                                );

                                            default:
                                                return null;
                                        }
                                    }

                                    switch (value.type) {
                                        case 'Text':
                                            return (
                                                <div draggable='true' key={key} style={currentFieldStyleSettings}>
                                                    {value['properties'].content.value}
                                                </div>
                                            );

                                        case 'Image':
                                            return (
                                                <div draggable='true' key={key} style={currentFieldStyleSettings}>
                                                    <img style={{ height: 'inherit', width: 'inherit' }} src={value['properties'].url.value} alt='' />
                                                </div>
                                            );

                                        case 'Link':
                                            return (
                                                <div draggable='true' key={key} style={currentFieldStyleSettings}>
                                                    <a style={{ fontSize: 'inherit', color: 'inherit', textDecoration: 'inherit' }} href={value['properties'].url.value}>{value['properties'].content.value}</a>
                                                </div>
                                            );

                                        default:
                                            return null;
                                    }
                                }) : <p className='certificate-certificate-field-text'>No fields were received.</p>}
                            </div>
                            {/* The previous code is sent entirely to the BE */}
                        </div>
                    </div>
                    {/* The previous code is used for a better FE display */}

                    <div className='certificate-certificate-button-container'>
                        <div className='certificate-certificate-button-container-button'>
                            <Button buttonText='Save certificate' buttonType='Primary' buttonMarginRight='true' clickFunction={saveCertificate} />
                            <Button buttonText='Regenerate' buttonType='Secondary' buttonMarginRight='true' clickFunction={regenerateCertificate} />
                            <Button buttonText='Reset' buttonType='Secondary' buttonMarginRight='true' clickFunction={resetCertificate} />

                            {props.certificateType === 'edit' ? (
                                <Button buttonText='Delete' buttonType='Error' buttonMarginRight='true' clickFunction={deleteCertificate} />
                            ) : ''}

                            <ButtonLink buttonText='Cancel' buttonLink='/dashboard/certificates' buttonType='Secondary' />
                        </div>
                    </div>
                </div>

                {/* Fields */}
                <div className='certificate-certificate-field-management'>
                    {/* Field list */}
                    <div className='certificate-certificate-field-list'>
                        <div className='certificate-certificate-field-list-header'>
                            Fields
                        </div>

                        <div id='field-list' className='certificate-certificate-field-list-content'>
                            {Object.keys(currentFieldList).length > 0 ? Object.entries(currentFieldList).map(([key, value]) => {
                                if (value.properties.editable.value === 1 || value.properties.editable.value === '1') {
                                    return (
                                        <div className={'certificate-certificate-field ' + (currentFieldListActive === key ? 'certificate-certificate-field-active' : '')} key={key}>
                                            {value.type}

                                            <div className='certificate-certificate-field-buttons'>
                                                <button type='button' className='button-edit' onClick={() => editField(key)}><img src={editIcon} alt='Edit' /></button>
                                            </div>
                                        </div>
                                    );
                                }

                                return '';
                            }) : <p className='certificate-certificate-field-text'>No fields.</p>}
                        </div>
                    </div>

                    {/* Field settings menu */}
                    <div id='field-settings' className={'certificate-certificate-field-list certificate-certificate-field-settings ' + fieldSettingsMenuDisplay}>
                        <div className='certificate-certificate-field-list-header'>
                            Settings
                        </div>

                        <div className='certificate-certificate-field-list-content'>
                            {Object.keys(fieldSettingsMenuValues.properties).length > 0 ? Object.entries(fieldSettingsMenuValues.properties).map(([key, value]) => {
                                switch (fieldSettingsMenuValues.type) {
                                    case 'Text':
                                    case 'Link':
                                        if (value.name === 'content' && (fieldSettingsMenuValues.properties.editable.value === 1 || fieldSettingsMenuValues.properties.editable.value === '1')) {
                                            return (
                                                <div className='certificate-certificate-field-settings' key={key}>
                                                    <label>{value.label}</label>
                                                    <input type='text' value={value.value} onChange={(e) => updateField(fieldSettingsMenuValues.id, key, e.target.value)} />
                                                </div>
                                            );
                                        }

                                        return '';

                                    case 'Image':
                                        return (
                                            {/* TO DO - add an image case */ }
                                        );

                                    default:
                                        return null;
                                }
                            }) : <p className='certificate-certificate-field-text'>An error occured.</p>}
                        </div>

                        <div className='certificate-certificate-field-list-button'>
                            <Button buttonText='Done' buttonType='Primary'
                                clickFunction={() => {
                                    setFieldSettingsMenuDisplay('hidden');
                                    setCurrentFieldListActive('');
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Certificate;