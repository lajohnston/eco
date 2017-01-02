export default class Component {
  constructor(definition) {
    this.entities = {};
    this.factory = getFactory(definition); // eslint-disable-line no-use-before-define
  }

  /**
   * Get the component data belonging to a given entity
   *
   * @param {number}  entityId  the entity's unique id
   *
   * @returns {mixed} the entity's component data
   */
  get(entityId) {
    return this.entities[entityId];
  }

  /**
   * Returns an array of ids of the entities for which this component stores
   * data
   *
   * @returns {Array} array of entity ids
   */
  getEntityIds() {
    return Object.keys(this.entities);
  }

  /**
   * Set the component data for a given entity
   *
   * @param {number}  entityId  the entity's unique id
   * @param {object}  data  the data to override the defaults
   *
   * @returns {mixed} the entity's component data
   */
  set(entityId, data) {
    this.entities[entityId] = this.factory(data);
  }

  /**
   * Indicates whether the component contains data for the given entity id
   *
   * @param   {number}  entityId  the entity's unique id
   *
   * @returns {boolean} true if the component has data for the entity,
   *                    otherwise false
   */
  has(entityId) {
    return Object.hasOwnProperty.call(this.entities, entityId);
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
    Object.keys(this.entities).forEach((entityId) => {
      callback.call(this, entityId, this.entities[entityId]);
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
