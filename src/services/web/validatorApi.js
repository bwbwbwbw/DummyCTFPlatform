export default (DI, app, validator) => {

  validator.getValidators(v => {
    if (v.registerController) {
      v.registerController(app);
    }
  });

};
