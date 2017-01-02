export default class IteratorFactory {
  /**
   * @param {Function} EntityIterator constructor for an entity iterator
   * @param {Function} FilteredIterator constructor for a filtered iterator
   */
  constructor(EntityIterator, FilteredIterator) {
    this.EntityIterator = EntityIterator;
    this.FilteredIterator = FilteredIterator;
  }

  /**
   * Returns a new instance of an entity iterator
   *
   * @param {Object}  componentCollection collection of components
   * @param {Object}  entityFactory factory that creates entity proxies
   * @param {Array}   components optional array of component names to filter by
   */
  create(componentCollection, entityFactory, components) {
    if (Array.isArray(components)) {
      return new this.FilteredIterator(
        componentCollection,
        entityFactory,
        components
      );
    }

    return new this.EntityIterator(componentCollection, entityFactory);
  }
}
