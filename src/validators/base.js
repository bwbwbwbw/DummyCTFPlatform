export default class BaseValidator {
  constructor() {
    this.name = 'None';
    this.id = 'none';
  }
  doRegister() {
    return {
      type: 'pass',
      payload: {
        validated: true,
      },
    };
  }
}
