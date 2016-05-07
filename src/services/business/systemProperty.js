export default (DI, eventBus, db) => {

  const SystemProperty = db.SystemProperty;

  const systemPropertyService = {};

  /**
   * Get a property value
   * @return {Any}
   */
  systemPropertyService.get = async (key, defaultValue = null) => {
    const prop = await SystemProperty.findOne({ key });
    if (prop === null) {
      return defaultValue;
    } else {
      return prop.value;
    }
  };

  /**
   * Set a property value
   */
  systemPropertyService.set = async (key, value) => {
    await SystemProperty.findOneAndUpdate(
      { key },
      { $set: { value } },
      { upsert: true }
    );
  };

  return systemPropertyService;

};
