import express from 'express';
import bodyParser from 'body-parser';
import adaptRequest from './helpers/addapt-requiest';
import handleContactRequest from './contacts';

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => res.json({ msg: 'Hello' }));
app.all('/api/contacts', contactController);
app.get('/api/contacts/:id', contactController);

function contactController(req, res) {
  const httpRequest = adaptRequest(req);
  handleContactRequest(httpRequest)
    .then(({ headers, statusCode, data }) => {
      res.set(headers).status(statusCode).send(data);
    })
    .catch((e) => res.status(500).end());
}

app.listen('1331', () => console.log('Listening on port 1331'));
