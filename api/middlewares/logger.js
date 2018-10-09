const debug = require('debug')('app:req');

function log(req, res, next){
    console.log('\nlogging...');
    console.log(`${req.method} -> ${req.originalUrl}, ${ JSON.stringify(req.body)}`);
    next();
}

module.exports = log;