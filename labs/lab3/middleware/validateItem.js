const HttpError = require('../utils/HttpError');

const VALID_STATUSES = ['in care', 'deceased', 'released'];

const isNonEmptyString = (value) =>
  typeof value === 'string' && value.trim() !== '';

const isValidDate = (value) =>
  typeof value === 'string' &&
  /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  !Number.isNaN(Date.parse(value));

const validateItem = (req, res, next) => {
  const { name, species, admitted, collectionSite, reasonForAdmission, weightKg, status } =
    req.body ?? {};
  const problems = [];

  const textFields = { name, species, collectionSite, reasonForAdmission };
  for (const [field, value] of Object.entries(textFields)) {
    if (!isNonEmptyString(value)) problems.push(`${field} must be a non-empty string`);
  }

  if (!isValidDate(admitted)) problems.push('admitted must be a date in YYYY-MM-DD format');

  if (!VALID_STATUSES.includes(status)) {
    problems.push(`status must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  if (typeof weightKg !== 'number' || !Number.isFinite(weightKg) || weightKg <= 0) {
    problems.push('weightKg must be a positive number');
  }

  if (problems.length > 0) {
    return next(new HttpError(400, 'Invalid patient data', problems));
  }
  next();
};

module.exports = validateItem;