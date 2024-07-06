const express = require('express');
const { google } = require('googleapis');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;


const allowedOrigins = ['http://localhost:3000', 'https://rupicardassnfrontend-astay6318s-projects.vercel.app'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');

const auth = new google.auth.JWT(
    serviceAccountEmail,
    null,
    privateKey,
    SCOPES
);

async function appendData(auth, data) {
    const sheets = google.sheets({ version: 'v4', auth });

    try {
        const sheet = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
        const sheetId = sheet.data.sheets[0].properties.sheetId;
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Sheet1',
        });
        const nextRow = response.data.values ? response.data.values.length + 1 : 1;
        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: `Sheet1!A${nextRow}:B${nextRow}`,
            valueInputOption: 'RAW',
            resource: {
                values: [data],
            },
        });
        return 'Data appended successfully';
    } catch (error) {
        console.error('Error appending data to sheet:', error);
        throw error;
    }
}

app.post('/submit', async (req, res) => {
    const data = [req.body.name, req.body.number];
    try{
        const response = await appendData(auth, data);
        res.status(200).send(response);
    } catch(error) {
        res.status(500).send('Failed to submit data');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });