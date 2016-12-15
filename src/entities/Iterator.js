/**
 * Iterates over entities that have all the given components
 */
export default class Iterator {
  constructor(componentCollection, entityFactory, components) {
    this.componentsCollection = componentCollection;
    this.entityFactory = entityFactory;
    this.components = [];

    components.forEach((componentName) => {
      this.components.push(componentCollection.get(componentName));
    });
  }

  /**
   * Returns an array of arrays, each representing an entity that contains all
   * the components defined in the constructor. Each array contains the
   * component data for that entity, in the order defined in the constructor,
   * followed by a proxy object for the entity as the last value
   *
   * @returns {Array} array of arrays, each containing data for a matching
   *                  entity
   */
  getData() {
    const data = [];

    this.components[0].each((entityId, firstComponentData) => {
      const entityData = [firstComponentData];

      // Check for entity in all the other components
      for (let i = 1; i < this.components.length; i += 1) {
        const checkComponent = this.components[i];

        if (!checkComponent.has(entityId)) {
          return; // next entity
        }

        entityData.push(checkComponent.get(entityId));
      }

      // Add an entity proxy as the last value
      entityData.push(
        this.entityFactory.create(entityId, this.componentsCollection)
      );

      data.push(entityData);
    });

    return data;
  }

  /**
   * Calls the given callback for each entity containing all the components
   * defined for this iterator. The arguments passed to the callback are
   * defined by the getData() method
   *
   * @param {Function}  callback  callback to be called for each entity
   */
  each(callback) {
    this.getData().forEach((set) => {
      callback.apply(this, set);
    });
  }
}
