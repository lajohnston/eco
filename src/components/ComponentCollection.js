import Collection from './Collection';

export default class ComponentCollection extends Collection {
  constructor(componentFactory) {
    super();

    this.componentFactory = componentFactory;
  }

  /**
   * Adds a component definition
   *
   * @param {string}  name  the unique name for the component
   * @param {mixed}   definition  the default data for the component
   *
   * @returns {boolean} true if the component was added successfully,
   *                    or false if it was invalid or already exists
   */
  set(name, definition) {
    const component = this.componentFactory.create(definition);

    this.values[name] = component;

    return component;
  }

  /**
   * Returns an array of ids for entities that have at least one component
   *
   * @returns {Array} Array of entity ids
   */
  getEntityIds() {
    const ids = {};

    Object.keys(this.values).forEach((componentName) => {
      const component = this.values[componentName];
      component.getEntityIds().forEach((id) => {
        ids[id] = true;
      });
    });

    return Object.keys(ids);
  }

  /**
   * Calls the callback for each component in the collection, with the
   * component's name as the first argument and the component itself
   * as the second argument
   *
   * @param {Function}  callback called for each component in the collection
   *
   */
  each(callback) {
    Object.keys(this.values).forEach((componentName) => {
      const component = this.values[componentName];
      callback.call(this, componentName, component);
    });
  }

  /**
   * Returns all data indexed by entity id and component name
   *
   * @returns {Object}  objects indexed by entity id, which contain
   *                    componentName: data pairs
   */
  getDataByEntity() {
    const entities = {};

    this.each((componentName, component) => {
      component.each((entityId, data) => {
        if (typeof entities[entityId] === 'undefined') {
          entities[entityId] = {};
        }

        entities[entityId][componentName] = data;
      });
    });

    return entities;
  }

  /**
   * Reset all component data to the data provided
   *
   * @param {object} data entityId: componentData pairs, with the componentData
   *                      containing componentName: data pairs
   */
  setDataByEntity(data) {
    // Each component
    this.each((componentName, component) => {
      // Each entity in the data
      Object.keys(data).forEach((entityId) => {
        const entityData = data[entityId];

        if (Object.hasOwnProperty.call(entityData, componentName)) {
          component.set(entityId, entityData[componentName]);
        }
      });
    });
  }
}
