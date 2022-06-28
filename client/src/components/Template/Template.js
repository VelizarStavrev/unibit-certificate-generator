import './Template.scss';
import { useState, useEffect, useContext, useRef } from 'react';
import mainClass from '../../contexts/mainClassContext';
import editIcon from '../../assets/icons/edit.svg';
import deleteIcon from '../../assets/icons/delete.svg';
import Button from '../Shared/Button/Button';
import ButtonLink from '../Shared/ButtonLink/ButtonLink';
import DataService from '../../services/DataService';
import { useParams, useNavigate } from 'react-router-dom';

function Template(props) {
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

    function saveTemplate() {
        let fieldList = structuredClone(currentFieldList);

        let data = {
            name: templateName,
            notes: templateNotes,
            orientation: certificateOrientation,
            fields: fieldList
        }

        switch (props.templateType) {
            case 'new':
                const templateNewResult = DataService.createTemplate(data);
        
                templateNewResult.then(res => {
                    // Redirect the user
                    navigate('/dashboard/templates/');
                });
                break;

            case 'edit':
                const templateEditResult = DataService.editTemplate(templateId, data);
        
                templateEditResult.then(res => {
                    // TO DO - give an output to the user
                    console.log(res);
                });
                break;

            default:
                // TO DO
        }
    }

    function resetTemplate() {
        // Different functionalities depending on the template type
        switch (props.templateType) {
            case 'new':
                // Set the initial empty structure
                setTemplateName('');
                setTemplateNotes('');
                setCurrentFieldList(initialFieldStructure);
                setCertificateOrientation('vertical');
                break;

            case 'edit':
                // Call the saved data from the server
                getTemplateById(templateId);
                break;

            default:
                // TO DO
        }
    }

    function deleteTemplate() {
        const templateDeleteResult = DataService.deleteTemplate(templateId);
        
        templateDeleteResult.then(res => {
            if (res.status) {
                navigate('/dashboard/templates/');
            }
        });

        // TO DO - error handling
    }

    function getTemplateById(templateIdReceived) {
        const templateResult = DataService.getTemplate(templateIdReceived);

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

                const dateCreated = getDateAndTimeFromTimestamp(data.created);
                const dateEdited = getDateAndTimeFromTimestamp(data.edited);

                setTemplateName(data.name);
                setTemplateCreatedDate(dateCreated);
                setTemplateEditedDate(dateEdited);
                setTemplateNotes(data.notes);
                setCertificateOrientation(data.orientation);
                setCertificateContainerHeight(certificateContainerRef.current.offsetHeight);
                setCertificateContainerWidth(certificateContainerRef.current.offsetWidth);
                setCertificateContainerHeightOffset(certificateContainerRef.current.offsetTop);
                setCertificateContainerWidthOffset(certificateContainerRef.current.offsetLeft);
                setCurrentFieldList(data.fields);
            }
        });
    }

    // Initial field structure and list
    const { templateId } = useParams();
    const initialFieldStructure = {};
    const [templateName, setTemplateName] = useState(''); // name or empty
    const [templateCreatedDate, setTemplateCreatedDate] = useState(''); // date or empty
    const [templateEditedDate, setTemplateEditedDate] = useState(''); // date or empty
    const [templateNotes, setTemplateNotes] = useState(''); // text or empty

    const [certificateOrientation, setCertificateOrientation] = useState('vertical'); // vertical or horizontal
    const [currentFieldList, setCurrentFieldList] = useState(initialFieldStructure); // empty object or field list

    // Add field menu functionality
    const [fieldAddMenuDisplay, setFieldAddMenuDisplay] = useState('hidden'); // hidden or ''
    const [fieldToCreate, setFieldToCreate] = useState(''); // hidden or ''

    function getCurrentMaxZIndex() {
        const fieldList = structuredClone(currentFieldList);
        const zIndexArray = [];

        // If there are no fields, set a z-index of 1
        if (Object.keys(fieldList).length <= 0) {
            return 1;
        }

        for (const field in fieldList) {
            const currentField = fieldList[field];
            const currentFieldZIndex = currentField.properties.zIndex.value;
            zIndexArray.push(currentFieldZIndex);
        }

        let maxZIndex = Math.max(...zIndexArray);
        return maxZIndex + 1;
    }

    function createField() {
        const timestamp = Date.now();

        if (!fieldToCreate) {
            return;
        }

        const currentField = {
            id: timestamp,
            type: fieldToCreate,
            properties: {}
        };

        // Get current max z-index of all fields
        const zIndex = getCurrentMaxZIndex();

        let currentProperties = {};

        switch (fieldToCreate) {
            case 'Text':
                currentProperties = {
                    'zIndex': {
                        label: 'Layer position',
                        value: zIndex,
                        type: 'text'
                    },
                    'content': {
                        label: 'Text content',
                        value: 'Example text',
                        type: 'text'
                    },
                    'fontSize': {
                        label: 'Font size',
                        value: '16',
                        type: 'text',
                        unit: 'px'
                    },
                    'textAlign': {
                        label: 'Text alignment',
                        value: 'Left',
                        type: 'select',
                        options: ['Left', 'Center', 'Right']
                    },
                    'transform': {
                        label: 'Rotation',
                        value: '0',
                        type: 'text',
                        unit: 'deg'
                    },
                    'color': {
                        label: 'Text color',
                        value: '#000000',
                        type: 'text'
                    },
                    'fontWeight': {
                        label: 'Font weight',
                        value: 'Normal',
                        type: 'select',
                        options: ['Normal', 'Bold']
                    },
                    'fontStyle': {
                        label: 'Font style',
                        value: 'Normal',
                        type: 'select',
                        options: ['Normal', 'Italic']
                    },
                    'textDecoration': {
                        label: 'Text decoration',
                        value: 'None',
                        type: 'select',
                        options: ['None', 'Underline', 'Line-through']
                    },
                    'maxWidth': {
                        label: 'Max width',
                        value: '250',
                        type: 'text',
                        unit: 'px'
                    },
                    'left': {
                        label: 'Position X',
                        value: '50',
                        type: 'text',
                        unit: '%'
                    },
                    'top': {
                        label: 'Position Y',
                        value: '50',
                        type: 'text',
                        unit: '%'
                    },
                    'editable': {
                        label: 'Editable',
                        value: false,
                        type: 'boolean'
                    }
                }
                break;

            case 'Image':
                currentProperties = {
                    'zIndex': {
                        label: 'Layer position',
                        value: zIndex,
                        type: 'text'
                    },
                    'url': {
                        label: 'Image link',
                        value: '/url',
                        type: 'text'
                    },
                    'height': {
                        label: 'Image height',
                        value: '250',
                        type: 'text',
                        unit: 'px',
                        units: ['px', '%']
                    },
                    'width': {
                        label: 'Image width',
                        value: '500',
                        type: 'text',
                        unit: 'px',
                        units: ['px', '%']
                    },
                    'transform': {
                        label: 'Rotation',
                        value: '0',
                        type: 'text',
                        unit: 'deg'
                    },
                    'left': {
                        label: 'Position X',
                        value: '50',
                        type: 'text',
                        unit: '%'
                    },
                    'top': {
                        label: 'Position Y',
                        value: '50',
                        type: 'text',
                        unit: '%'
                    },
                    'editable': {
                        label: 'Editable',
                        value: false,
                        type: 'boolean'
                    }
                };
                break;

            case 'Link':
                currentProperties = {
                    'zIndex': {
                        label: 'Layer position',
                        value: zIndex,
                        type: 'text'
                    },
                    'content': {
                        label: 'Text content',
                        value: 'Example text',
                        type: 'text'
                    },
                    'url': {
                        label: 'Link',
                        value: '/url',
                        type: 'text'
                    },
                    'fontSize': {
                        label: 'Font size',
                        value: '16',
                        type: 'text',
                        unit: 'px'
                    },
                    'textAlign': {
                        label: 'Text alignment',
                        value: 'Left',
                        type: 'select',
                        options: ['Left', 'Center', 'Right']
                    },
                    'transform': {
                        label: 'Rotation',
                        value: '0',
                        type: 'text',
                        unit: 'deg'
                    },
                    'color': {
                        label: 'Text color',
                        value: '#4287f5',
                        type: 'text'
                    },
                    'fontWeight': {
                        label: 'Font weight',
                        value: 'Normal',
                        type: 'select',
                        options: ['Normal', 'Bold']
                    },
                    'fontStyle': {
                        label: 'Font style',
                        value: 'Italic',
                        type: 'select',
                        options: ['Normal', 'Italic']
                    },
                    'textDecoration': {
                        label: 'Text decoration',
                        value: 'Underline',
                        type: 'select',
                        options: ['None', 'Underline', 'Line-through']
                    },
                    'left': {
                        label: 'Position X',
                        value: '50',
                        type: 'text',
                        unit: '%'
                    },
                    'top': {
                        label: 'Position Y',
                        value: '50',
                        type: 'text',
                        unit: '%'
                    },
                    'editable': {
                        label: 'Editable',
                        value: false,
                        type: 'boolean'
                    }
                };
                break;

            default:
                currentProperties = {};
                break;
        }

        currentField.properties = currentProperties;

        // Push the field to the current field list
        let fieldList = structuredClone(currentFieldList);
        fieldList[currentField.id] = currentField;
        setCurrentFieldList(fieldList);

        // Hide the new field menu
        setFieldAddMenuDisplay('hidden');

        // Remove the active status of the field
        setFieldToCreate('');
    }

    // Edit field menu functionality
    const initialFieldSettingsMenuValues = {
        id: '',
        type: '',
        properties: {}
    };

    const [fieldSettingsMenuDisplay, setFieldSettingsMenuDisplay] = useState('hidden'); // hidden or ''
    const [fieldSettingsMenuValues, setFieldSettingsMenuValues] = useState(initialFieldSettingsMenuValues); // object with values or ''
    const [currentFieldListActive, setCurrentFieldListActive] = useState(initialFieldSettingsMenuValues); // field id or ''

    function deleteField(fieldId) {
        let fieldList = structuredClone(currentFieldList);
        delete fieldList[fieldId];
        setCurrentFieldList(fieldList);
        setFieldSettingsMenuDisplay('hidden');
    }

    function editField(fieldId) {
        setFieldSettingsMenuValues(currentFieldList[fieldId]);
        setCurrentFieldListActive(fieldId);
        setFieldSettingsMenuDisplay('');
        setFieldAddMenuDisplay('hidden');
    }

    function updateField(fieldId, fieldPropertyName, fieldPropertyValue) {
        let fieldList = structuredClone(currentFieldList);
        fieldList[fieldId].properties[fieldPropertyName].value = fieldPropertyValue;
        setCurrentFieldList(fieldList);
        setFieldSettingsMenuValues(fieldList[fieldId]);
    }

    function updateFieldUnit(fieldId, fieldPropertyName, fieldUnitValue) {
        let fieldList = structuredClone(currentFieldList);
        fieldList[fieldId].properties[fieldPropertyName].unit = fieldUnitValue;
        setCurrentFieldList(fieldList);
        setFieldSettingsMenuValues(fieldList[fieldId]);
    }

    // Certificate display functionality
    const certificateContainerRef = useRef(null);
    const [certificateContainerHeight, setCertificateContainerHeight] = useState(0);
    const [certificateContainerWidth, setCertificateContainerWidth] = useState(0);
    const [certificateContainerHeightOffset, setCertificateContainerHeightOffset] = useState(0);
    const [certificateContainerWidthOffset, setCertificateContainerWidthOffset] = useState(0);
    const [certificateContainerScrollPosition, setCertificateContainerScrollPosition] = useState(0);

    useEffect(() => {
        setCertificateContainerHeight(certificateContainerRef.current.offsetHeight);
        setCertificateContainerWidth(certificateContainerRef.current.offsetWidth);
        setCertificateContainerHeightOffset(certificateContainerRef.current.offsetTop);
        setCertificateContainerWidthOffset(certificateContainerRef.current.offsetLeft);
    }, []);

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

    function updateFieldPosition(event, fieldId) {
        const fieldEndX = event.pageX;
        const fieldEndY = event.pageY;
        const containerHeight = certificateContainerHeight;
        const containerHeightOffset = certificateContainerHeightOffset;
        const containerWidth = certificateContainerWidth;
        const containerWidthOffset = certificateContainerWidthOffset;
        const fieldX = ((((fieldEndX + certificateContainerScrollPosition) - containerWidthOffset) / containerWidth) * 100).toFixed(2);
        const fieldY = (((fieldEndY - containerHeightOffset) / containerHeight) * 100).toFixed(2);

        let fieldList = structuredClone(currentFieldList);
        fieldList[fieldId].properties.left.value = fieldX;
        fieldList[fieldId].properties.top.value = fieldY;
        setCurrentFieldList(fieldList);
        setFieldSettingsMenuValues(fieldList[fieldId]);
    }

    // Template type functionality
    useEffect(() => {
        switch (props.templateType) {
            case 'new':
                // Nothing
                break;

            case 'edit':
                getTemplateById(templateId);
                break;

            default:
                // TO DO - ERROR
        }
    }, [props.templateType, templateId]);

    return (
        <div className='template-container'>
            <div className='template-container-text-container'>
                <div className='template-text-pair-two-rows'>
                    <p className='template-text-pair-header'>Template name:</p>
                    <input type='text' value={templateName} onChange={(e) => setTemplateName(e.target.value)} />
                </div>

                {props.templateType !== 'new' ? (
                    <div className='template-text-pair-one-row'>
                        <p className='template-text-pair-header'>Created date:</p>
                        <p>{templateCreatedDate}</p>
                    </div>
                ) : ''}

                {props.templateType !== 'new' ? (
                    <div className='template-text-pair-one-row'>
                        <p className='template-text-pair-header'>Last edit date:</p>
                        <p>{templateEditedDate}</p>
                    </div>
                ) : ''}

                <div className='template-text-pair-two-rows'>
                    <p className='template-text-pair-header'>Notes:</p>
                    <textarea value={templateNotes} onChange={(e) => setTemplateNotes(e.target.value)}></textarea>
                </div>
            </div>

            <div className='template-certificate-and-fields-container'>
                <div className='template-certificate-main-container'>
                    {/* The following code is used for a better FE display */}
                    <div className='template-certificate-container-FE' onScroll={(e) => setCertificateContainerScrollPosition(e.target.scrollLeft)}>
                        <div className={certificateOrientation === 'vertical' ? 'template-certificate-container-vertical' : 'template-certificate-container-horizontal'}>
                            {/* The following code is sent entirely to the BE */}
                            <div id='certificate-container' className='template-certificate-container' ref={certificateContainerRef} style={
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

                                    switch (value.type) {
                                        case 'Text':
                                            return (
                                                <div draggable='true' key={key} style={currentFieldStyleSettings}
                                                    onClick={() => editField(key)} className={currentFieldListActive === key ? 'active' : ''}
                                                    onDragEnd={(e) => updateFieldPosition(e, key)}
                                                >
                                                    {value['properties'].content.value}
                                                </div>
                                            );

                                        case 'Image':
                                            return (
                                                <div draggable='true' key={key} style={currentFieldStyleSettings}
                                                    onClick={() => editField(key)} className={currentFieldListActive === key ? 'active' : ''}
                                                    onDragEnd={(e) => updateFieldPosition(e, key)}
                                                >
                                                    <img style={{ height: 'inherit', width: 'inherit' }} src={value['properties'].url.value} alt='' />
                                                </div>
                                            );

                                        case 'Link':
                                            return (
                                                <div draggable='true' key={key} style={currentFieldStyleSettings}
                                                    onClick={() => editField(key)} className={currentFieldListActive === key ? 'active' : ''}
                                                    onDragEnd={(e) => updateFieldPosition(e, key)}
                                                >
                                                    <a style={{ fontSize: 'inherit', color: 'inherit', textDecoration: 'inherit' }} href={value['properties'].url.value}>{value['properties'].content.value}</a>
                                                </div>
                                            );

                                        default:
                                            return null;
                                    }
                                }) : <p className='template-certificate-field-text'>Add field to start.</p>}
                            </div>
                            {/* The previous code is sent entirely to the BE */}
                        </div>
                    </div>
                    {/* The previous code is used for a better FE display */}

                    <div className='template-certificate-button-container'>
                        <div className='template-certificate-button-container-radio'>
                            <label htmlFor='orientation-portrait' className='template-radio-button-container'>
                                <input type='radio' name='orientation' id='orientation-portrait' value='portrait' onChange={() => {
                                    setCertificateOrientation('vertical');
                                    setCertificateContainerHeight(certificateContainerRef.current.offsetWidth);
                                    setCertificateContainerWidth(certificateContainerRef.current.offsetHeight);
                                }}
                                    checked={certificateOrientation === 'vertical' ? true : false} />
                                <span className='checkmark'></span>
                                Portrait
                            </label>

                            <label htmlFor='orientation-landscape' className='template-radio-button-container'>
                                <input type='radio' name='orientation' id='orientation-landscape' value='landscape' onChange={() => {
                                    setCertificateOrientation('horizontal');
                                    setCertificateContainerHeight(certificateContainerRef.current.offsetWidth);
                                    setCertificateContainerWidth(certificateContainerRef.current.offsetHeight);
                                }}
                                    checked={certificateOrientation === 'horizontal' ? true : false} />
                                <span className='checkmark'></span>
                                Landscape
                            </label>
                        </div>

                        <div className='template-certificate-button-container-button'>
                            <Button buttonText='Save template' buttonType='Primary' buttonMarginRight='true' clickFunction={saveTemplate} />
                            <Button buttonText='Reset' buttonType='Secondary' buttonMarginRight='true' clickFunction={resetTemplate} />

                            {props.templateType === 'new' ? (
                                <ButtonLink buttonText='Cancel' buttonLink='/dashboard/templates' buttonType='Secondary' />
                            ) : (
                                <Button buttonText='Delete' buttonType='Error' clickFunction={deleteTemplate} />
                            )}
                        </div>
                    </div>
                </div>

                {/* Fields */}
                <div className='template-certificate-field-management'>
                    {/* Field list */}
                    <div className='template-certificate-field-list'>
                        <div className='template-certificate-field-list-header'>
                            Fields
                        </div>

                        <div id='field-list' className='template-certificate-field-list-content'>
                            {Object.keys(currentFieldList).length > 0 ? Object.entries(currentFieldList).map(([key, value]) => {
                                return (
                                    <div className={'template-certificate-field ' + (currentFieldListActive === key ? 'template-certificate-field-active' : '')} key={key}>
                                        {value.type}

                                        <div className='template-certificate-field-buttons'>
                                            <button type='button' className='button-edit' onClick={() => editField(key)}><img src={editIcon} alt='Edit' /></button>
                                            <button type='button' className='button-delete' onClick={() => deleteField(key)}><img src={deleteIcon} alt='Delete' /></button>
                                        </div>
                                    </div>
                                );
                            }) : <p className='template-certificate-field-text'>No fields.</p>}
                        </div>

                        <div className='template-certificate-field-list-button'>
                            <Button buttonText='Add field' buttonType='Primary'
                                clickFunction={() => {
                                    fieldAddMenuDisplay ? setFieldAddMenuDisplay('') : setFieldAddMenuDisplay('hidden');
                                    setFieldSettingsMenuDisplay('hidden');
                                    setCurrentFieldListActive('');
                                }}
                            />
                        </div>
                    </div>

                    {/* Field settings menu */}
                    <div id='field-settings' className={'template-certificate-field-list template-certificate-field-settings ' + fieldSettingsMenuDisplay}>
                        <div className='template-certificate-field-list-header'>
                            Settings
                        </div>

                        <div className='template-certificate-field-list-content'>
                            {Object.keys(fieldSettingsMenuValues.properties).length > 0 ? Object.entries(fieldSettingsMenuValues.properties).map(([key, value]) => {
                                switch (value.type) {
                                    case 'text':
                                        if (value.unit) {
                                            if (value.units) {
                                                return (
                                                    <div className='template-certificate-field-settings' key={key}>
                                                        <label>{value.label}</label>
                                                        <div className='template-certificate-field-settings-input-with-unit template-certificate-field-settings-input-with-unit-selectable'>
                                                            <input type='text' value={value.value} onChange={(e) => updateField(fieldSettingsMenuValues.id, key, e.target.value)} />
                                                            {value.units.map(currentUnit => {
                                                                return (
                                                                    <div className={'template-certificate-field-settings-unit ' + (value.unit === currentUnit ? 'template-certificate-field-settings-unit-active' : '')}
                                                                        key={currentUnit} onClick={() => updateFieldUnit(fieldSettingsMenuValues.id, key, currentUnit)}>
                                                                        {currentUnit}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            return (
                                                <div className='template-certificate-field-settings' key={key}>
                                                    <label>{value.label}</label>
                                                    <div className='template-certificate-field-settings-input-with-unit'>
                                                        <input type='text' value={value.value} onChange={(e) => updateField(fieldSettingsMenuValues.id, key, e.target.value)} />
                                                        <div className='template-certificate-field-settings-unit'>{value.unit}</div>
                                                    </div>
                                                </div>
                                            );
                                        }

                                        return (
                                            <div className='template-certificate-field-settings' key={key}>
                                                <label>{value.label}</label>
                                                <input type='text' value={value.value} onChange={(e) => updateField(fieldSettingsMenuValues.id, key, e.target.value)} />
                                            </div>
                                        );

                                    case 'select':
                                        return (
                                            <div className='template-certificate-field-settings' key={key}>
                                                <label>{value.label}</label>
                                                <select value={value.value} onChange={(e) => updateField(fieldSettingsMenuValues.id, key, e.target.value)}>
                                                    {value.options.map(currentOption => {
                                                        return (
                                                            <option
                                                                key={currentOption}
                                                                value={currentOption}
                                                            >
                                                                {currentOption}
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                            </div>
                                        );

                                    case 'boolean':
                                        return (
                                            <div className='template-certificate-field-settings' key={key}>
                                                <label>{value.label}</label>
                                                <div className='template-certificate-field-settings-boolean-container'>
                                                    <label htmlFor={'trueBooleanRadioFor' + key} className={value.value ? 'template-certificate-field-settings-boolean-active' : ''}>
                                                        <input type='radio' name={'BooleanRadioFor' + key} id={'trueBooleanRadioFor' + key} onChange={(e) => updateField(fieldSettingsMenuValues.id, key, true)}
                                                            checked={value.value ? true : false}
                                                        />
                                                        True
                                                    </label>

                                                    <label htmlFor={'falseBooleanRadioFor' + key} className={value.value ? '' : 'template-certificate-field-settings-boolean-active'}>
                                                        <input type='radio' name={'BooleanRadioFor' + key} id={'falseBooleanRadioFor' + key} onChange={(e) => updateField(fieldSettingsMenuValues.id, key, false)}
                                                            checked={value.value ? false : true}
                                                        />
                                                        False
                                                    </label>
                                                </div>
                                            </div>
                                        );

                                    default:
                                        return null;
                                }
                            }) : <p className='template-certificate-field-text'>An error occured.</p>}
                        </div>

                        <div className='template-certificate-field-list-button'>
                            <Button buttonText='Done' buttonType='Primary'
                                clickFunction={() => {
                                    setFieldSettingsMenuDisplay('hidden');
                                    setCurrentFieldListActive('');
                                }}
                            />
                        </div>
                    </div>

                    {/* Add field menu */}
                    <div id='field-menu' className={'template-certificate-field-list template-certificate-field-menu ' + fieldAddMenuDisplay}>
                        <div className='template-certificate-field-list-header'>
                            Add field
                        </div>

                        <div className='template-certificate-field-list-content'>
                            <div className={'template-certificate-field template-certificate-field-clickable ' + (fieldToCreate === 'Text' ? 'template-certificate-field-active' : '')}
                                data-field-type='Text' onClick={() => setFieldToCreate('Text')}>
                                Text
                            </div>

                            <div className={'template-certificate-field template-certificate-field-clickable ' + (fieldToCreate === 'Image' ? 'template-certificate-field-active' : '')}
                                data-field-type='Image' onClick={() => setFieldToCreate('Image')}>
                                Image
                            </div>

                            <div className={'template-certificate-field template-certificate-field-clickable ' + (fieldToCreate === 'Link' ? 'template-certificate-field-active' : '')}
                                data-field-type='Link' onClick={() => setFieldToCreate('Link')}>
                                Link
                            </div>
                        </div>

                        <div className='template-certificate-field-list-button'>
                            <Button buttonText='Add' buttonType='Primary' clickFunction={createField} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Template;