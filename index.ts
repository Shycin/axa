import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import GlobalRouter from './router';

const app = express();
const port = 3000;

app.disable('x-powered-by')


// adding Helmet to enhance your API's security
// app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

app.use('/public', express.static('public'));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});





app.use(GlobalRouter);