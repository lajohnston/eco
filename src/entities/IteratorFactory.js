export default class IteratorFactory {
  /**
   * @param {function} FilteredIterator constructor for a filtered iterator
   */
  constructor(FilteredIterator) {
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
    return new this.FilteredIterator(
      componentCollection,
      entityFactory,
      components
    );
  }
}
