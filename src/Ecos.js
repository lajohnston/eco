export default class Ecos {
  constructor(entityFactory, componentCollection) {
    this.entityFactory = entityFactory;
    this.componentCollection = componentCollection;
  }

  /**
   * Adds a component definition
   *
   * @param {string}  name  the unique name for the component
   * @param {mixed}   data  the default data for the component
   *
   * @returns {boolean} true if the component was added successfully,
   *                    or false if it was invalid or already exists
   */
  addComponent(name, data) {
    return this.componentCollection.set(name, data);
  }

  createEntity(components) {
    return this.entityFactory.create(components);
  }
}
