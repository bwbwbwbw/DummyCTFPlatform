export default class ServiceInjector {
  constructor(...args) {
    if (this.constructor.$inject) {
      this.constructor.$inject.forEach((name, idx) => {
        if (args[idx] === undefined) {
          throw new Error(`Injected service ${name} not found`);
        } else {
          this[name] = args[idx];
        }
      });
    }
  }
}
