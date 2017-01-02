export default class EntityIterator {
  /**
   * @param {Object}  componentCollection collection of components
   * @param {Object}  entityFactory factory that creates entity proxies
   */
  constructor(componentCollection, entityFactory) {
    this.componentCollection = componentCollection;
    this.entityFactory = entityFactory;
  }

  /**
   * Returns entity proxies for all active entities, that is, entities that
   * currently contain at least one component
   *
   * @returns {Array} array of entity proxies
   */
  getData() {
    const entities = [];

    this.componentCollection.getEntityIds().forEach((id) => {
      entities.push(
        this.entityFactory.create(id, this.componentCollection)
      );
    });

    return entities;
  }

  /**
   * Calls the given callback for each entity. The arguments passed to the
   * callback are defined by the getData() method
   *
   * @param {Function}  callback  callback to be called for each entity
   */
  each(callback) {
    this.getData().forEach((data) => {
      callback.apply(this, Array.isArray(data) ? data : [data]);
    });
  }
}
