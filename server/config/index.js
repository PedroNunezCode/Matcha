if(process.env.NODE_ENV === 'production'){
    module.exports = require('./production.js');
}else{
    module.exports = require('./dev.js');
}