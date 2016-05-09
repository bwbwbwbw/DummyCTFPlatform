import BaseValidator from './base';

export default class TongjiValidator extends BaseValidator {
  constructor(DI) {
    super(DI);
    this.name = 'Tongji University Mail Validation';
    this.id = 'tongji';
  }
}
