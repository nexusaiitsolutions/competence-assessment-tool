// src/utils/logger.js
const levels = ['error','warn','info','debug'];
const level = process.env.LOG_LEVEL || 'info';
const activeIndex = levels.indexOf(level);


function logAt(lvl, ...args) {
if (levels.indexOf(lvl) <= activeIndex) {
console[lvl === 'debug' ? 'log' : lvl](`[${new Date().toISOString()}] ${lvl.toUpperCase()}:`, ...args);
}
}


module.exports = {
error: (...a) => logAt('error', ...a),
warn: (...a) => logAt('warn', ...a),
info: (...a) => logAt('info', ...a),
debug: (...a) => logAt('debug', ...a)
};