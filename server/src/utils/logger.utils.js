const pino = require('pino');
const dayjs = require('dayjs')

const logger = pino({
    transport: {
        target: 'pino-pretty',
        base: {
            pid: false,
        },
        timestamp: () => `,"time":"${dayjs().format()}"`,
        options: {
            colorize: true
        }
    },
});
module.exports = logger;