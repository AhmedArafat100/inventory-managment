const {clearHash} = require('../utils/cache');

const cleanProductCache = async (req, res, next) => {
    await next();

    clearHash(req.params.id);
};

module.exports = cleanProductCache;