export default class ServiceInjector {
  constructor(...args) {
    if (this.constructor.$inject) {
      this.constructor.$inject.forEach((name, idx) => {
        this[name] = args[idx];
      });
    }
  }
}
