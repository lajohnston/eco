/**
 * Creates Entity instances with unique id values
 */
export default class EntityFactory {
  /**
   * @param {Object}  instanceFactory
   *                        object with a 'create' function that returns
   *                        new entity instances
   * @param {Object}  componentCollection the component collection
   */
  constructor(instanceFactory, componentCollection) {
    this.instanceFactory = instanceFactory;
    this.components = componentCollection;
    this.prevId = 0;
  }

  /**
   * Creates a new entity with a unique id
   *
   * @returns {Entity}  the new entity instance
   */
  create() {
    return this.instanceFactory.create(
      this.getNextId(),
      this.components
    );
  }

  /**
   * @returns {Number} an unused unique id
   */
  getNextId() {
    this.prevId = this.prevId + 1;
    return this.prevId;
  }
}
