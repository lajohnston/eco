export default class Eco {
  constructor(componentCollection, entityFactory, iteratorFactory) {
    this.componentCollection = componentCollection;
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
    return this.entityFactory.create();
  }

  /**
   * Create a new iterator for the entities with all the given components
   *
   * @param   {array} components  the names of the components
   *
   * @returns {Iterator}  the iterator
   */
  createIterator(components) {
    return this.iteratorFactory.create(components);
  }
}
