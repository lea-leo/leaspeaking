import winston from 'winston';
var logger = new (winston.Logger)({
    transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: 'lea.log' })
    ]
});
logger.level = 'debug';
module.exports=logger;



