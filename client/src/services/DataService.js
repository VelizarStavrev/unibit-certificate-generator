const token = localStorage.getItem('token');

const DataService = {
    // Templates
    createTemplate: function (fieldData) {
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
    
    // Certificates
    createCertificate: function (fieldData) {
        // Send to the BE
        return fetch(`http://localhost:8000/certificate/new`, {
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
    editCertificate: function (certificateId, fieldData) {
        // Send to the BE
        return fetch(`http://localhost:8000/certificate/edit/${certificateId}`, {
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
    deleteCertificate: function (certificateId) {
        // Send to the BE
        return fetch(`http://localhost:8000/certificate/delete/${certificateId}`, {
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
    getCertificate: function (certificateId) {
        // Send to the BE
        return fetch(`http://localhost:8000/certificate/${certificateId}`, {
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
    getCertificates: function () {
        // Send to the BE
        return fetch(`http://localhost:8000/certificates`, {
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
    }
};

export default DataService;