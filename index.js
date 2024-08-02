require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.APP_TOKEN;

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get('/', async (req, res) => {
    const travelDestinations = 'https://api.hubapi.com/crm/v3/objects/2-32852654';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const properties = ["destination_general_name", "attractions", "best_time_to_visit", "destination_country"]
        const resp = await axios.get(travelDestinations, {
            headers : headers,
            params : {
                properties: properties.join(',')
            }
        });
        const data = resp.data.results;
        res.render('homepage', { title: 'Travel Destinations | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', async (req, res) => {
    res.render('updates', { title: 'Update Travel Destinations Form | Integrating With HubSpot I Practicum', data: [] });      
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update-cobj', async (req, res) => {
    console.log(req.body)
    const newObjectData = {
        properties: {
            "destination_general_name": req.body?.destination_general_name,
            "attractions" : req.body?.attractions,
            "best_time_to_visit" : Array.isArray(req.body?.best_time_to_visit) ? req.body?.best_time_to_visit?.join(';') : req.body?.best_time_to_visit,
            "destination_country" : req.body?.destination_country
        }
    }
    console.log(newObjectData)
    const addNewObject = `https://api.hubapi.com/crm/v3/objects/2-32852654`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.post(addNewObject, newObjectData, { headers } );
        res.redirect('/');
    } catch(err) {
        console.error(err);
    }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));