/**
 * Iterates over entities that have all the given components
 */
export default class Iterator {
  constructor(components) {
    this.components = components;
  }

  /**
   * Returns an array of arrays, each representing an entity that contains all
   * the components defined in the constructor. Each array contains the
   * component data for that entity, in the order defined in the constructor,
   * followed by a proxy object for the entity as the last value
   *
   * @returns {Array} array of arrays, each containing data for a matching
   *                  entity
   */
  getData() {
    return [];
  }

  /**
   * Calls the given callback for each entity containing all the components
   * defined for this iterator. The arguments passed to the callback are
   * defined by the getData() method
   *
   * @param {Function}  callback  callback to be called for each entity
   */
  each(callback) {
    this.getData().forEach((set) => {
      callback.apply(this, set);
    });
  }
}
