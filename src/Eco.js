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
   * Create an entity proxy with the given id
   *
   * @param {mixed} id  (optional) id. If none is given then a unique id will
   *                    be generated for the entity
   *
   * @returns {Entity} the new entity instance
   */
  entity(id) {
    const entityId = typeof id === 'undefined' ?
      this.idFactory.create() : id;

    return this.entityFactory.create(entityId, this.componentCollection);
  }

  /**
   * Create a new iterator for the entities with all the given components
   *
   * @param   {Array} components  the names of the components
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
   * Iterates through each entity that contains the given set of components
   *
   * @param   {Array} components  the names of the components
   * @param   {Function} callback
   *              the callback to be called for each entity, with the entity's
   *              matching component data passed as arguments in the order
   *              specified. The last argument is a proxy to the entity itself
   */
  filter(components, callback) {
    if (!Array.isArray(components)) {
      return;
    }

    this.createIterator(components).each(callback);
  }

  /**
   * Get all entities that currently have at least one component
   *
   * @returns {Array} array of entity proxies
   */
  getEntities() {
    return this.componentCollection.getEntityIds().map(
      id => this.entity(id)
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
    this.idFactory.reserve(Object.keys(data));
  }
}
