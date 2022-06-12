import './Template.css';
import { useState, useEffect, useContext } from 'react';
import mainClass from '../../contexts/mainClassContext';
import editIcon from '../../assets/icons/edit.svg';
import deleteIcon from '../../assets/icons/delete.svg';

function Template() {
    // Set the class of the main containter to be for this specific page
    const { setClass } = useContext(mainClass);

    useEffect(() => {
        setClass('main-template-component');
    }, [setClass]);

    // Template buttons
    // Used to change the state of the certificate orientation
    const [certificateOrientation, setCertificateOrientation] = useState('vertical'); // vertical or horizontal

    function saveTemplate() {
        // TO DO - get the data with a request
        // TO DO - set the template orientation in the saved data
        // TO DO - make specific fields to have the option to be editable
        // TO DO - add dropdown field options for specific fields
        // TO DO - add field unit clarity (is it px, %, none, etc.)
        // TO DO - add field dropdowns for unit selection
        console.log('Save the template!');
    }

    function resetTemplate() {
        // TO DO - get the data with a request
        console.log('Reset the template!');
    }

    function deleteTemplate() {
        // TO DO - delete the data with a request
        console.log('Delete the template!');
    }

    // Initial field structure and list
    // TO DO - get the saved fields
    const initialFieldStructure = {};

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
        
        switch(fieldToCreate) {
            case 'Text':
                currentProperties = {
                    'zIndex': {
                        label: 'Layer position',
                        value: zIndex
                    },
                    'content': {
                        label: 'Text content',
                        value: 'Example text'
                    },
                    'fontSize': {
                        label: 'Font size',
                        value: '16'
                    },
                    'textAlign': {
                        label: 'Text alignment',
                        value: 'Left'
                    },
                    'transform': {
                        label: 'Rotation',
                        value: '0'
                    },
                    'color': {
                        label: 'Text color',
                        value: '#000000'
                    },
                    'fontWeight': {
                        label: 'Font weight',
                        value: 'Bold'
                    },
                    'fontStyle': {
                        label: 'Font style',
                        value: 'Italic'
                    },
                    'maxWidth': {
                        label: 'Max width',
                        value: '250'
                    },
                    'left': {
                        label: 'Position X',
                        value: '50'
                    },
                    'top': {
                        label: 'Position Y',
                        value: '50'
                    }
                }
                break;

            case 'Image':
                currentProperties = {
                    'zIndex': {
                        label: 'Layer position',
                        value: zIndex
                    },
                    'url': {
                        label: 'Image link',
                        value: '/url'
                    },
                    'height': {
                        label: 'Image height',
                        value: '250px'
                    },
                    'width': {
                        label: 'Image width',
                        value: '500px'
                    },
                    'transform': {
                        label: 'Rotation',
                        value: '0'
                    },
                    'left': {
                        label: 'Position X',
                        value: '50'
                    },
                    'top': {
                        label: 'Position Y',
                        value: '50'
                    }
                };
                break;
            
            case 'Link':
                currentProperties = {
                    'zIndex': {
                        label: 'Layer position',
                        value: zIndex
                    },
                    'content': {
                        label: 'Text content',
                        value: 'Example text'
                    },
                    'url': {
                        label: 'Link',
                        value: '/url'
                    },
                    'fontSize': {
                        label: 'Font size',
                        value: '16'
                    },
                    'textAlign': {
                        label: 'Text alignment',
                        value: 'Left'
                    },
                    'transform': {
                        label: 'Rotation',
                        value: '0'
                    },
                    'color': {
                        label: 'Text color',
                        value: '#4287f5'
                    },
                    'fontWeight': {
                        label: 'Font weight',
                        value: 'Bold'
                    },
                    'fontStyle': {
                        label: 'Font style',
                        value: 'italic'
                    },
                    'left': {
                        label: 'Position X',
                        value: '50'
                    },
                    'top': {
                        label: 'Position Y',
                        value: '50'
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

    function deleteField(fieldId) {
        let fieldList = structuredClone(currentFieldList);
        delete fieldList[fieldId];
        setCurrentFieldList(fieldList);
    }

    function editField(fieldId) {
        setFieldSettingsMenuValues(currentFieldList[fieldId]);
        setFieldSettingsMenuDisplay('');
        setFieldAddMenuDisplay('hidden');
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
            // let currentPropertyValue = currentProperties[property].value;

            if (property === 'content' || property === 'url') {
                continue;
            }

            if (property === 'transform') {
                currentProperties[property].value = 'rotate(' + currentProperties[property].value + 'deg)';
            }

            if (property === 'left' || property === 'top') {
                currentProperties[property].value = currentProperties[property].value + '%';
            }

            if (property === 'maxWidth') {
                currentProperties[property].value = currentProperties[property].value + 'px';
            }

            if (property === 'fontSize') {
                currentProperties[property].value = currentProperties[property].value + 'px';
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

    return (
        <div className='template-container'>
            <h1>TEMPLATE NAME</h1>

            <div className='template-text-pair-one-row'>
                <p className='template-text-pair-header'>Created date:</p>
                <p>20.02.2022</p>
            </div>
            
            <div className='template-text-pair-one-row'>
                <p className='template-text-pair-header'>Last edit date:</p>
                <p>20.02.2022</p>
            </div>

            <div className='template-text-pair-two-rows'>
                <p className='template-text-pair-header'>Notes:</p>
                <p>
                    Text of the notes that could help the future author / editor to remember what and what.
                    Text of the notes that could help the future author / editor to remember what and what.
                    Text of the notes that could help the future author / editor to remember what and what.
                </p>
            </div>

            <div className='template-certificate-and-fields-container'>
                <div className='template-certificate-main-container'>
                    {/* The following code is used for a better FE display */}
                    <div className='template-certificate-container-FE'>
                        <div className={certificateOrientation === 'vertical' ? 'template-certificate-container-vertical' : 'template-certificate-container-horizontal'}>
                            {/* The following code is sent entirely to the BE */}
                            <div id='certificate-container' className='template-certificate-container' style={
                                {
                                    width: '100%',
                                    height: '100%',
                                    position: 'relative',
                                    overflow: 'hidden',
                                }
                            }>
                                {/* Display all fields in the certificate window */}
                                { Object.keys(currentFieldList).length > 0 ? Object.entries(currentFieldList).map(([key, value]) => {
                                    const currentFieldStyleSettings = getFieldStyles(value.properties);

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
                                                    <img style={{height: 'inherit', width: 'inherit'}} src={value['properties'].url.value} alt='' />
                                                </div>
                                            );

                                        case 'Link':
                                            return (
                                                <div draggable='true' key={key} style={currentFieldStyleSettings}>
                                                    <a style={{fontSize: 'inherit', color: 'inherit'}} href={value['properties'].url.value}>{value['properties'].content.value}</a>
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
                                <input type='radio' name='orientation' id='orientation-portrait' value='portrait' onChange={() => setCertificateOrientation('vertical')}
                                    checked={certificateOrientation === 'vertical' ? true : false} />
                                <span className='checkmark'></span>
                                Portrait
                            </label>

                            <label htmlFor='orientation-landscape' className='template-radio-button-container'>
                                <input type='radio' name='orientation' id='orientation-landscape' value='landscape' onChange={() => setCertificateOrientation('horizontal')}
                                    checked={certificateOrientation === 'horizontal' ? true : false} />
                                <span className='checkmark'></span>
                                Landscape
                            </label>
                        </div>
    
                        <div className='template-certificate-button-container-button'>
                            <button className='button-primary' type='button' onClick={saveTemplate}>Save template</button>
                            <button className='button-secondary' type='button' onClick={resetTemplate}>Reset</button>
                            <button className='button-error' type='button' onClick={deleteTemplate}>Delete</button>
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
                            { Object.keys(currentFieldList).length > 0 ? Object.entries(currentFieldList).map(([key, value]) => {
                                return (
                                    <div className='template-certificate-field' key={key}>
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
                            <button id='new-field-button' type='button' className='button-primary' onClick={() => {
                                        fieldAddMenuDisplay ? setFieldAddMenuDisplay('') : setFieldAddMenuDisplay('hidden');
                                        setFieldSettingsMenuDisplay('hidden');
                                    }
                                }>Add field</button>
                        </div>
                    </div>

                    {/* Field settings menu */}
                    <div id='field-settings' className={'template-certificate-field-list template-certificate-field-settings ' + fieldSettingsMenuDisplay}>
                        <div className='template-certificate-field-list-header'>
                            Settings
                        </div>

                        <div className='template-certificate-field-list-content'>
                            { Object.keys(fieldSettingsMenuValues.properties).length > 0 ? Object.entries(fieldSettingsMenuValues.properties).map(([key, value]) => {
                                return (
                                    <div className='template-certificate-field-settings' key={key}>
                                        <label>{value.label}</label>
                                        <input type='text' value={value.value} onChange={(e) => updateField(fieldSettingsMenuValues.id, key, e.target.value)} />
                                    </div>
                                );
                            }) : <p className='template-certificate-field-text'>An error occured.</p>}
                        </div>

                        <div className='template-certificate-field-list-button'>
                            <button id='save-field-button' type='button' className='button-primary' onClick={() => setFieldSettingsMenuDisplay('hidden')}>Done</button>
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
                            <button id='add-field-button' type='button' className='button-primary' onClick={createField}>Add</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Template;