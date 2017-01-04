export default class Eco {
  constructor(componentCollection, idFactory, entityFactory, iteratorFactory) {
    this.componentCollection = componentCollection;
    this.idFactory = idFactory;
    this.entityFactory = entityFactory;
    this.iteratorFactory = iteratorFactory;
  }

  /**
   * Creates a component definition
   *
   * @param {string}  name  the unique name for the component
   * @param {mixed}   data  the default data for the component
   *
   * @returns {Component} the component object
   */
  createComponent(name, data) {
    return this.componentCollection.set(name, data);
  }

  /**
   * Create a new entity with a unique id
   *
   * @returns {Entity} the new entity instance
   */
  createEntity() {
    return this.entityFactory.create(
      this.idFactory.create(),
      this.componentCollection
    );
  }

  /**
   * Create a new iterator for the entities with all the given components
   *
   * @param   {array} components  the names of the components
   *
   * @returns {Iterator}  the iterator
   */
  createIterator(components) {
    return this.iteratorFactory.create(
      this.componentCollection,
      this.entityFactory,
      components
    );
  }

  /**
   * Returns all data indexed by entity id and component name
   *
   * @returns {Object}  objects indexed by entity id, each containing
   *                    component name: data pairs
   */
  getDataByEntity() {
    return this.componentCollection.getDataByEntity();
  }

  /**
   * Replaces all existing component data with the data provided
   *
   * @param {Object}  data objects indexed by entity id, each containing
   *                       component name: data pairs
   */
  setDataByEntity(data) {
    this.componentCollection.setDataByEntity(data);
  }
}
