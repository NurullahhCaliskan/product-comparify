import { createLogger, format, transports } from 'winston';
import 'winston-mongodb';
import { formatDate } from './dayUtility.js';
import { __dirname } from '../static/paths.js';

const { combine, timestamp, printf } = format;
const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp}  ${level}: ${message}`;
});

// @ts-ignore
const mongoDbLog = new transports.MongoDB({
    level: 'error',
    //mongo database connection link
    db: process.env.DBHOST,
    options: {
        useUnifiedTopology: true,
    },
    // A collection to save json formatted logs
    collection: 'server_logs_shopify',
    tryReconnect: true,
    format: format.combine(
        format.timestamp(),
        // Convert logs to a json format
        format.json()
    ),
});

// @ts-ignore
const myWinstonOptions = {
    format: combine(
        //label({ label: __filename }),
        timestamp(),
        myFormat
    ),

    exitOnError: false,
    transports:
        process.env.NODE_ENV !== 'production'
            ? [new transports.Console(), new transports.File({ filename: __dirname + '/../../logs/exceptions/' + formatDate() + '.log', handleExceptions: true }), new transports.File({ filename: __dirname + '/../../logs/' + formatDate() + '.log' }), mongoDbLog]
            : [new transports.File({ filename: __dirname + '/../../logs/error/' + formatDate() + '.log', level: 'error' }), new transports.File({ filename: __dirname + '/../../logs/' + formatDate() + '.log' }), mongoDbLog],
};

// @ts-ignore
export function logRequest(req, res, next) {
    logger.info(req.url);
    next();
}

// @ts-ignore
export function logError(err, req, res, next) {
    logger.error(err);
    next();
}

// @ts-ignore
export const logger = new createLogger(myWinstonOptions);
