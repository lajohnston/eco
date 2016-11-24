/**
 * An entity, acting as a proxy for the component collection for storage
 * and retrieval of components for a given entity id
 */
export default class Entity {
  constructor(id, componentCollection) {
    this.id = id;
    this.components = componentCollection;
  }

  getId() {
    return this.id;
  }

  /**
   * Get the component with the given name
   *
   * @param {string}  componentName the name of the component
   *
   * @returns {mixed} the component data, or null if it does not exist
   */
  get(componentName) {
    return this.components.get(componentName)
      .get(this.id);
  }

  /**
   * Add a component to the entity
   *
   * @param {string}  componentName the name of the component
   * @param {mixed}   data the data to set for the component
   *
   * @returns {Entity} itself
   */
  add(componentName, data) {
    this.components.get(componentName)
      .set(this.id, data);

    return this;
  }
}
