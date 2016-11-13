/**
 * An entity, acting as a proxy for the component collection for storage
 * and retrieval of components for a given entity id
 */
export default class Entity {
  constructor(id, componentCollection) {
    this.id = id;
    this.componentCollection = componentCollection;
  }

  getId() {
    return this.id;
  }

  /**
   * Get the component with the given name
   *
   * @param {string}  the name of the component
   * @param {mixed}   the component data, or null if it does not exist
   */
  get(componentName) {
    return this.componentCollection.getForEntity(this.id, componentName);
  }

  /**
   * Set the data for a given component
   *
   * @param {string}  the name of the component
   * @param {mixed}   the data to set for the component
   */
  set(componentName, data) {
    this.componentCollection.setForEntity(this.id, componentName, data);
    return this;
  }
}
