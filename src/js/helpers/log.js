var winston = require('winston');
var logger = new (winston.Logger)({
    transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: 'somefile.log' })
    ]
});
logger.level = 'debug';
module.exports=logger;



