const express = require('express');
const exphbs = require('express-handlebars');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();

const baseURL = process.env.BASEURL;
const apiKey = process.env.APIKEY;

const app = express();

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
    extended: true
}));

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'SSWS ' +apiKey
};

app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
}));

app.set('view engine', 'hbs');

//  Function to validate the token
function validateToken(data) {
    return new Promise(resolve => {
        axios.post(baseURL +'/authn/recovery/token', data, {
            headers: headers
        })
            .then((res) => {
                let tokenRes = {
                    status : 'validated',
                    subject: res.data._embedded.user.id,
                    email: res.data._embedded.user.profile.login
                };
                resolve(tokenRes);
            })
            .catch((error) => {
                let tokenRes = {
                    status : 'expired',
                    error: error.response.data.errorSummary
                };
                resolve(tokenRes);
            });
    });
}

// Function to set the new password
function setNewPassword(uid, pass) {
    return new Promise(resolve => {
        let data = {
            credentials: {
                password : { value: pass }
            }
        };
        axios.put(baseURL +'/users/' +uid, data, {
            headers: headers
        })
            .then((res) => {
                let response = {
                    success: true,
                    result: 'The new password has been set !'
                };
                resolve(response);
            })
            .catch((error) => {
                let response = {
                    success: false,
                    result: 'Something went wrong',
                    error: error
                };
                resolve(response);
            });
    });
}

// Render set new password form page
app.get('/set-new-password', (req, res) => {
    renderPage(req.query.recoveryToken);
    async function renderPage(data) {
        let token = {recoveryToken: data};
        let response = await validateToken(token);
        if (response.status == 'validated'){
            res.render('home', {
                id: response.subject,
                email: response.email
            })
        } else {
            res.render('error', {
                error: response.error
            })
        }
    }
});

// Render password submitted page
app.post('/submit-password', (req, res) => {
    renderPage(req.body.userId, req.body.password);
    async function renderPage(userId, newPassword) {
        let response = await setNewPassword(userId, newPassword);
        if (response.sucess == true){
            console.log(response);
            res.render('password-submitted', {
                result: response.result
            })
        } else {
            res.render('password-submitted', {
                result: response.result
            })
        }
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log('The web server has started on port 3000');
});
