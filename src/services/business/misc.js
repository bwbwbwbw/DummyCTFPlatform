export default (DI, db) => {

  const miscService = {};

  miscService.enforceCorrectBody = (req, res, next) => {
    const errors = req.validationErrors();
    if (errors) {
      next(new ValidationError(errors));
    } else {
      next();
    }
  };

  return miscService;

};
