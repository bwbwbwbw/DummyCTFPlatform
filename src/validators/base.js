/*global DI */
export default class BaseValidator {

  constructor() {
    this.name = 'None';
    this.id = 'none';
  }

  async beforeRegister() {
  }

  async afterRegister(reqBody, contestRegistrationId) {
    const contestService = DI.get('contestService');
    await contestService.updateRegistrationMeta(
      contestRegistrationId,
      { validated: true }
    );
  }

}
