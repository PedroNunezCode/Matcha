const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const PORT = process.env.PORT ||5000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/profile', require('./routes/profile'));
app.use('/api/v1/image', require('./routes/image-upload'));
app.use('/api/v1/chat', require('./routes/chat'));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/public/index.html'));
});

const server = app.listen(PORT, (err) => {
    if (err)
        console.error(err);
    else
    console.log(chalk.green(`API Running on port ${PORT}`));
});

module.exports = server;
