const UserService = {
    userRegisterRequest: function (email, username, password, repassword) {
        const data = {
            email,
            username,
            password,
            repassword
        };

        // Send to the BE
        return fetch(`http://localhost:8000/user/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
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
    userLoginRequest: function (username, password) {
        const data = {
            username,
            password,
        };

        // Send to the BE
        return fetch(`http://localhost:8000/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
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

export default UserService;