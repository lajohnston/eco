import Collection from './Collection';

export default class Component extends Collection {
  constructor(definition) {
    super();

    this.factory = getFactory(definition); // eslint-disable-line no-use-before-define
  }

  /**
   * Get the component data belonging to a given entity
   *
   * @param {mixed}  entityId  the entity's unique id
   *
   * @returns {mixed} the entity's component data
   */
  get(entityId) {
    return this.values[entityId];
  }

  /**
   * Returns an array of ids of the entities for which this component stores
   * data
   *
   * @returns {Array} array of entity ids
   */
  getEntityIds() {
    return Object.keys(this.values);
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
    this.values[entityId] = this.factory(data);
  }

  /**
   * Removes the data for the given entity
   *
   * @param   {mixed}  entityId  the entity's unique id
   */
  remove(entityId) {
    delete this.values[entityId];
  }

  /**
   * Iterates over each entity with data in this component.
   *
   * @param {Function} callback callback to be called for each entity. The
   *                            first argument will be the entity id, and
   *                            the second will be the component data for
   *                            that entity
   */
  each(callback) {
    Object.keys(this.values).forEach((entityId) => {
      callback.call(this, entityId, this.values[entityId]);
    });
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
}

function getFactory(definition) {
  const type = typeof definition;

  if (type === 'function') {
    return definition;
  } else if (type === 'object' && definition !== null) {
    return data => Component.mergeObjects(definition, data);
  } else if (type === 'undefined') {
    return data => data;
  }

  return () => definition;
}
