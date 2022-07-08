import '../Template.scss';
import { useState, useEffect, useContext } from 'react';
import mainClass from '../../../../contexts/mainClassContext';
import TemplateService from '../../../../services/TemplateService';
import { useParams } from 'react-router-dom';
import useAddMessage from '../../../../hooks/useAddMessage';

function Template() {
    const [ addMessage ] = useAddMessage();

    // Set the class of the main containter to be for this specific page
    const { setClass } = useContext(mainClass);

    useEffect(() => {
        setClass('main-template-component');
    }, [setClass]);

    function getTemplateById(templateIdReceived) {
        const templateResult = TemplateService.getTemplate(templateIdReceived);

        templateResult.then(res => {
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
                    const time = addZeroForTwoDigits(dateInitial.getHours()) + ':' + addZeroForTwoDigits(dateInitial.getMinutes()) + ':' + addZeroForTwoDigits(dateInitial.getSeconds());
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
                setCurrentFieldList(data.fields);

                // Set a new message
                addMessage('success', res.message);
                return;
            }

            // Set a new message
            addMessage('error', res.message ? res.message : 'An error occured.');
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

    // Template type functionality
    useEffect(() => {
        getTemplateById(templateId);
    }, [templateId]);

    return (
        <div className='template-container'>
            <div className='template-container-text-container'>
                <h1>{templateName}</h1>

                <div className='template-text-pair-one-row'>
                    <p className='template-text-pair-header'>Created date:</p>
                    <p>{templateCreatedDate}</p>
                </div>

                <div className='template-text-pair-one-row'>
                    <p className='template-text-pair-header'>Last edit date:</p>
                    <p>{templateEditedDate}</p>
                </div>

                <div className='template-text-pair-two-rows'>
                    <p className='template-text-pair-header'>Notes:</p>
                    <p>
                        {templateNotes}
                    </p>
                </div>
            </div>
            
            <div className='template-certificate-and-fields-container'>
                <div className='template-certificate-main-container'>
                    {/* The following code is used for a better FE display */}
                    <div className='template-certificate-container-FE template-certificate-container-FE-view'>
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
                                {Object.keys(currentFieldList).length > 0 ? Object.entries(currentFieldList).map(([key, value]) => {
                                    const currentFieldStyleSettings = getFieldStyles(value.properties);

                                    switch (value.type) {
                                        case 'Text':
                                            return (
                                                <div key={key} style={currentFieldStyleSettings} >
                                                    {value['properties'].content.value}
                                                </div>
                                            );

                                        case 'Image':
                                            return (
                                                <div key={key} style={currentFieldStyleSettings} >
                                                    <img style={{ height: 'inherit', width: 'inherit' }} src={value['properties'].url.value} alt='' />
                                                </div>
                                            );

                                        case 'Link':
                                            return (
                                                <div key={key} style={currentFieldStyleSettings} >
                                                    <a style={{ fontSize: 'inherit', color: 'inherit', textDecoration: 'inherit' }} href={value['properties'].url.value}>{value['properties'].content.value}</a>
                                                </div>
                                            );

                                        default:
                                            return null;
                                    }
                                }) : <p className='template-certificate-field-text'>No fields in this template.</p>}
                            </div>
                            {/* The previous code is sent entirely to the BE */}
                        </div>
                    </div>
                    {/* The previous code is used for a better FE display */}
                </div>
            </div>
        </div>
    );
}

export default Template;