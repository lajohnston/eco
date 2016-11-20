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
    this.componentCollection = componentCollection;
    this.prevId = 0;
  }

  /**
   * @param   {object}  components  componentName: data pairs to give to the entity
   * @returns {Entity}  entity instance
   */
  create(components) {
    const entity = this.instanceFactory.create(
      this.getNextId(),
      this.componentCollection
    );

    if (components) {
      Object.keys(components).forEach((component) => {
        entity.add(component, components[component]);
      });
    }

    return entity;
  }

  /**
   * @returns {Number} an unused unique id
   */
  getNextId() {
    this.prevId = this.prevId + 1;
    return this.prevId;
  }
}
