import log4js from 'log4js'
log4js.configure('./log4js.json');

const Logger = log4js.getLogger();
export default Logger;