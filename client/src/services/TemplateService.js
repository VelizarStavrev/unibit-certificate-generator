const TemplateService = {
    // Templates
    createTemplate: function (fieldData) {
        const token = localStorage.getItem('token');

        // Send to the BE
        return fetch(`http://localhost:8000/template/new`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(fieldData),
        })
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch((error) => {
            return {
                status: false,
                message: 'An error occured!'
            }
        });
    },
    editTemplate: function (templateId, fieldData) {
        const token = localStorage.getItem('token');

        // Send to the BE
        return fetch(`http://localhost:8000/template/edit/${templateId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(fieldData),
        })
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch((error) => {
            return {
                status: false,
                message: 'An error occured!'
            }
        });
    },
    deleteTemplate: function (templateId) {
        const token = localStorage.getItem('token');

        // Send to the BE
        return fetch(`http://localhost:8000/template/delete/${templateId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        })
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch((error) => {
            return {
                status: false,
                message: 'An error occured!'
            }
        });
    },
    getTemplate: function (templateId) {
        const token = localStorage.getItem('token');

        // Send to the BE
        return fetch(`http://localhost:8000/template/${templateId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        })
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch((error) => {
            return {
                status: false,
                message: 'An error occured!'
            }
        });
    },
    getTemplates: function () {
        const token = localStorage.getItem('token');
        
        // Send to the BE
        return fetch(`http://localhost:8000/templates`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        })
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch((error) => {
            return {
                status: false,
                message: 'An error occured!'
            }
        });
    },
};

export default TemplateService;