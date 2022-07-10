import { useEffect, useState } from 'react';
import TemplateService from '../../../services/TemplateService';
import useAddMessage from '../../../hooks/useAddMessage';
import Table from '../../Shared/Table/Table';

function Templates() {
    const initialTemplates = [];
    const [templates, setTemplates] = useState(initialTemplates); // empty array or field list
    const [remainingTemplates, setRemainingTemplates] = useState([]); // empty array or field list
    const templateLimit = 15;
    const [ addMessage ] = useAddMessage();

    // TO DO - add filters in the header tags to make q request with certain data filtering

    // Get the templates of the current user
    useEffect(() => {
        const templatesResult = TemplateService.getTemplates();
        
        templatesResult.then(res => {
            if (res.status) {
                let templatesToShow = [];
                let templatesToRemain = [];
                let dataArray = structuredClone(res.data);

                let loopLimit = dataArray.length > templateLimit ? templateLimit : dataArray.length;
                
                for (let i = 0; i < loopLimit; i++) {
                    let currentTemplate = dataArray.shift();
                    templatesToShow.push(currentTemplate);
                }

                templatesToRemain = dataArray;

                setTemplates(templatesToShow);
                setRemainingTemplates(templatesToRemain);

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

    // On scroll display for the templates
    function loadMoreTemplates() {
        let templatesToShow = [...templates];
        let templatesToRemain = [...remainingTemplates];

        let loopLimit = templatesToRemain.length > templateLimit ? templateLimit : templatesToRemain.length;

        for (let i = 0; i < loopLimit; i++) {
            let currentTemplate = templatesToRemain.shift();
            templatesToShow.push(currentTemplate);
        }

        setTemplates(templatesToShow);
        setRemainingTemplates(templatesToRemain);
    }

    function searchTemplate() {
        // TO DO
        console.log('Search templates');
    }

    return (
        <Table  
            tableType={'template'} 
            tableData={templates} 
            tableRemainingData={remainingTemplates}
            deleteFunction={deleteTemplate} 
            searchFunction={searchTemplate} 
            loadMoreFunction={loadMoreTemplates}
        />
    );
}

export default Templates;