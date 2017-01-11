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
   * Adds a component definition with the given name
   *
   * @param {string}  name  the unique name for the component
   * @param {mixed}   factoryDefinition an optional definition that will used to
   *                  transform data when adding a component to an entity.
   *
   *                  An undefined value will store the entity data as-is
   *
   *                  A function will have instance data passed to it and the
   *                  returned value will be stored for the entity
   *
   *                  A primitive value will create a component that always
   *                  returns that value as a constant
   *
   *                  An object definition will act as a set of default fields
   *                  and values that will be shallow merged into any object
   *                  passed to it
   *
   * @returns {boolean} false if a component with that name already exists,
   *                    otherwise true
   */
  addComponent(name, factoryDefinition) {
    if (this.componentCollection.has(name)) {
      return false;
    }

    this.componentCollection.set(name, factoryDefinition);

    return true;
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

    this.iteratorFactory.create(
      this.componentCollection,
      this.entityFactory,
      components
    ).each(callback);
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
