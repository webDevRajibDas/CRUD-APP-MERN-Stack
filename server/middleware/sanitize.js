// middleware/sanitize.js
const sanitize = (obj) => {
    if (obj === null || obj === undefined) {
        return obj;
    }

    if (typeof obj === 'object') {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                // Remove MongoDB operators
                if (key.startsWith('$')) {
                    delete obj[key];
                } else if (typeof obj[key] === 'object') {
                    sanitize(obj[key]);
                }
            }
        }
    }
    return obj;
};

const mongoSanitize = () => {
    return (req, res, next) => {
        ['body', 'query', 'params'].forEach((key) => {
            if (req[key]) {
                sanitize(req[key]);
            }
        });
        next();
    };
};

module.exports = mongoSanitize;