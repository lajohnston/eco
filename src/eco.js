/**
 * Eco API
 */
export default class Eco {
  /**
   * @param {function} Entity prototype to create entities
   * @param {function} Entity.defineComponent function that takes a component
   *  name
   */
  constructor(Entity) {
    this.Entity = Entity;
    this.components = Object.create(null, {});
  }

  /**
   * Defines a new component type
   *
   * @param {string} name the component identifier
   * @param {function} factory function that returns a component instance
   */
  component(name, factory) {
    this.components[name] = factory;
    this.Entity.defineComponent(name);
  }

  /**
   * Return s a new component instance
   *
   * @param {string} name the component identifier
   * @param {...*} args arguments to pass to the component factory
   * @returns {mixed} the component
   */
  createComponent(name, ...args) {
    const factory = this.components[name];
    return factory ? factory(...args) : undefined;
  }

  /**
   * Returns a new entity instance
   *
   * @returns {Entity} the entity
   */
  entity() {
    return new this.Entity();
  }
}
