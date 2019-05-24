const express = require('express');
const app = express();
const mapToRes = require('./middlewares/mapToRes');

app.use(mapToRes);

app.listen(3000, () => console.log('listening.\n'));
