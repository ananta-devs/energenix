const xss = require('xss');

/**
 * Recursive function to sanitize objects
 * @param {any} data - The input data to sanitize
 * @returns {any} - The sanitized data
 */
const clean = (data) => {
  if (!data) return data;

  if (Array.isArray(data)) {
    return data.map(item => clean(item));
  }

  if (typeof data === 'object' && data !== null) {
    Object.keys(data).forEach(key => {
      data[key] = clean(data[key]);
    });
    return data;
  }

  if (typeof data === 'string') {
    return xss(data);
  }

  return data;
};

const xssSanitize = (req, res, next) => {
  // Sanitize body
  if (req.body) {
    req.body = clean(req.body);
  }

  // Sanitize params
  if (req.params) {
    req.params = clean(req.params);
  }

  // Sanitize query
  if (req.query) {
    // In Express 5, req.query is a getter. We must modify the object in place.
    const sanitizedQuery = clean(req.query);
    // clean() modifies objects in place so req.query is already updated if it was an object.
    // However, if clean returned something else (unlikely for an object input), we need to be careful.
    // Since clean updates keys in place for objects, and req.query is an object, strictly speaking we are good.
    // But let's be explicit to match the pattern used in mongoSanitize if we were creating a copy.
    
    // Actually, my clean function modifies in place for objects:
    // data[key] = clean(data[key]);
    // So simply calling clean(req.query) is sufficient for the recursion,
    // but the top level reference `req.query` stays the same.
  }

  next();
};

module.exports = xssSanitize;
