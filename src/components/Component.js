import Collection from './Collection';

export default class Component extends Collection {
  constructor(definition) {
    super();

    this.factory = Component.createFactory(definition);
  }

  /**
   * Set the component data for a given entity
   *
   * @param {mixed}  entityId  the entity's unique id
   * @param {object}  data  the data to override the defaults
   *
   * @returns {mixed} the entity's component data
   */
  set(entityId, data) {
    super.set(entityId, this.factory(data));
  }

  /**
   * Merge two objects, returning the merged data without affecting
   * the originals
   *
   * @param   {object}  defaultData the base default data
   * @param   {object}  data  the data to merge in
   *
   * @returns {object}  the merged data
   */
  static mergeObjects(defaultData, data) {
    const instance = {};

    Object.keys(defaultData).forEach((key) => {
      instance[key] = defaultData[key];
    });

    if (data && typeof data === 'object') {
      Object.keys(data).forEach((key) => {
        instance[key] = data[key];
      });
    }

    return instance;
  }

  /**
   * Return a factory function that will transform data passed to it
   *
   * @param {mixed} definition  the component definition.
   *                  An 'undefined' value will return a factory that
   *                  always returns the value passed to it.
   *
   *                  A function will be returned as-is and act as the
   *                  factory.
   *
   *                  A primitive value will create a factory that always
   *                  returns that value for all instances.
   *
   *                  An object definition will act as a set of default fields
   *                  and values, that will be shallow merged into any object
   *                  passed to it.
   */
  static createFactory(definition) {
    const type = typeof definition;

    if (type === 'function') {
      // Return function as-is
      return definition;
    } else if (type === 'object' && definition !== null) {
      // Return function that shallow merges objects passed to it
      return data => Component.mergeObjects(definition, data);
    } else if (type === 'undefined') {
      // Return function that returns any data passed to it
      return data => data;
    }

    // Primitive value- return function that always returns this value
    return () => definition;
  }
}
