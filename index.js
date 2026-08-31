require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

// Sostituisci con il nome/ID del tuo custom object (es. 'p1234567_pets' o il type ID numerico)
const CUSTOM_OBJECT_TYPE = '2-252664067';

// ROUTE 1 - Homepage: recupera i record del custom object e li mostra in tabella
app.get('/', async (req, res) => {
    const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}?properties=name,faction,primary_color`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const resp = await axios.get(url, { headers });
        const data = resp.data.results;
        res.render('homepage', { title: 'Custom Object Data | Integrating With HubSpot I Practicum', data });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching custom object data');
    }
});

// ROUTE 2 - Form per creare/aggiornare un record del custom object
app.get('/update-cobj', async (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// ROUTE 3 - Gestisce l'invio del form, crea il record, reindirizza alla homepage
app.post('/update-cobj', async (req, res) => {
    const create = {
        properties: {
            "name": req.body.name,
            "faction": req.body.faction,
            "primary_color": req.body.primary_color
        }
    };

    const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        await axios.post(url, create, { headers });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating custom object record');
    }
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));