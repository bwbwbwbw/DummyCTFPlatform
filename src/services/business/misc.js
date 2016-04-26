export default (DI, db) => {

  const miscService = {};

  miscService.enforceRole = (roles) => {
    return (req, res, next) => {
      if (roles.length === 0) {
        next();
      } else {
        if (!req.session.user) {
          next(new PrivilegeError());
        }
        let hasAllRole = true;
        roles.forEach(role => {
          if (req.session.user.roles.indexOf(role) === -1) {
            hasAllRole = false;
          }
        });
        if (!hasAllRole) {
          next(new PrivilegeError());
        } else {
          next();
        }
      }
    };
  };

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
