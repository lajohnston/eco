import EntityIterator from './EntityIterator';

/**
 * Iterates over entities that have all the given components
 */
export default class FilteredIterator extends EntityIterator {
  /**
   * @param {Object}  componentCollection collection of components
   * @param {Object}  entityFactory factory that creates entity proxies
   * @param {Array}   components array of component names to filter by
   */
  constructor(componentCollection, entityFactory, componentNames) {
    super(componentCollection, entityFactory);

    this.components = [];

    if (Array.isArray(componentNames)) {
      componentNames.forEach((componentName) => {
        this.components.push(componentCollection.get(componentName));
      });
    }
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
    if (this.components.length === 0) {
      return [];
    }

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
        this.entityFactory.create(entityId, this.componentCollection)
      );

      data.push(entityData);
    });

    return data;
  }
}
