const chalk = require('chalk');
const mongoose = require('mongoose');

const config = require('./config');
const server = require('./server');

mongoose.set('useCreateIndex', true);
mongoose.connect(config.DB_URI, {useNewUrlParser: true,  useUnifiedTopology: true })
    .then(() => console.log(chalk.green('Database Initialized')))
    .catch((err) => console.log(chalk.red(err)));

const SocketChatService = require('./socket');
new SocketChatService(server);
