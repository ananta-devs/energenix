const sanitize = require('mongo-sanitize');

const mongoSanitize = (req, res, next) => {
  // Sanitize body
  if (req.body) {
    req.body = sanitize(req.body);
  }

  // Sanitize params
  if (req.params) {
    req.params = sanitize(req.params);
  }

  // Sanitize query
  if (req.query) {
    const sanitizedQuery = sanitize(req.query);
    // Express 5 might make req.query a getter-only property.
    // Instead of reassigning req.query, we update the object in place.
    if (req.query !== sanitizedQuery) {
        // If sanitize returned a new object or we want to ensure we update the existing reference
        Object.keys(req.query).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(sanitizedQuery, key)) {
                delete req.query[key];
            }
        });
        Object.assign(req.query, sanitizedQuery);
    }
  }

  next();
};

module.exports = mongoSanitize;
