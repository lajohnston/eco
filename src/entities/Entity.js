/**
 * An entity, acting as a proxy for the component collection for storage
 * and retrieval of components for a given entity id
 */
export default class Entity {
  /**
   * @param {mixed} id  the unique id, either a string or a number
   * @param {Object}  componentCollection the component collection
   */
  constructor(id, componentCollection) {
    // Convert id to string to match ids used by component collection
    this.id = typeof id === 'number' ? id.toString() : id;
    this.components = componentCollection;
  }

  /**
   * Returns the entity's unique id
   *
   * @returns {string} the unique identifier
   */
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
   * @returns {Object} itself
   */
  add(componentName, data) {
    this.components.get(componentName)
      .set(this.id, data);

    return this;
  }

  /**
   * Indicates whether an entity has a given component
   *
   * @param {string}  componentName the name of the component
   *
   * @returns {boolean} true if the entity has the component, otherwise false
   */
  has(componentName) {
    return this.components.get(componentName)
      .has(this.id);
  }

  /**
   * Removes the specified component data for this entity
   *
   * @param {string}  componentName the name of the component
   *
   * @returns {Object} itself
   */
  remove(componentName) {
    this.components.get(componentName)
      .delete(this.id);

    return this;
  }
}
