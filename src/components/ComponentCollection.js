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
    super.set(name, this.componentFactory.create(definition));
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
      component.keys().forEach((id) => {
        ids[id] = true;
      });
    });

    return Object.keys(ids);
  }

  /**
   * Returns all data indexed by entity id and component name
   *
   * @returns {Object}  objects indexed by entity id, which contain
   *                    componentName: data pairs
   */
  getDataByEntity() {
    const entities = {};

    this.forEach((component, componentName) => {
      component.forEach((data, entityId) => {
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
    this.forEach((component, componentName) => {
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
