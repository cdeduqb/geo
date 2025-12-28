import fs from 'fs';
import path from 'path';

export const logToFile = (message: string) => {
    try {
        const logPath = path.join(process.cwd(), 'debug.log');
        const timestamp = new Date().toISOString();
        fs.appendFileSync(logPath, `[${timestamp}] ${message}\n`);
    } catch (err) {
        console.error('Failed to write to debug.log:', err);
    }
};

export const logger = {
    info: (msg: string) => {
        console.log(msg);
        logToFile(`INFO: ${msg}`);
    },
    error: (msg: string, err?: any) => {
        const fullMsg = err ? `${msg} - ${err.message || err}` : msg;
        console.error(fullMsg);
        logToFile(`ERROR: ${fullMsg}`);
    },
    warn: (msg: string) => {
        console.warn(msg);
        logToFile(`WARN: ${msg}`);
    }
};
