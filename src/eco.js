/**
 * Eco API
 *
 * @property {function} [onChange] called whenever an entity has a component
 *  added, removed or changed. Called with: entity, componentName, newValue,
 *  oldValue
 */
export default class Eco {
  /**
   * @param {function} Entity class to use to create entities
   * @param {function} Entity.defineComponent function that takes a component
   *  name
   */
  constructor(Entity, createFilter) {
    this.Entity = Entity;
    this.createFilterInstance = createFilter;

    this.entities = [];
    this.onChange = () => {};
  }

  /**
   * Defines one or more component identifiers. This sets up components so they
   * can be accessed on the entities using standard dot notation
   *
   * @param {Array.<string>} names the component identifiers
   */
  defineComponents(names) {
    names.forEach(name => {
      this.Entity.defineComponent(name);
    });
  }

  /**
   * Returns a new entity instance
   *
   * @returns {Entity} the entity
   */
  entity() {
    const entity = new this.Entity();
    this.entities.push(entity);
    return entity;
  }

  /**
   * Returns a new entity filter instance
   *
   * @param {Array<string>|function} criteria an array of component
   *  identifiers, or a function that returns true if a given entity should be
   *  included
   *
   * @returns {Filter}  filter instance
   */
  createFilter(criteria) {
    return this.createFilterInstance(this.entities, criteria);
  }

  /**
   * Returns a function that when called, will call the given function for each
   * matching entity. The entity will be the first argument passed to the each
   * function, followed by any additional arguments passed to the system
   *
   * @param {Array<string>|function} criteria an array of component
   *  identifiers, or a function that returns true if a given entity should be
   *  included
   * @param {function} each function to call for each matching entity
   *
   * @returns {function} update function
   */
  system(criteria, each) {
    const filter = this.createFilter(criteria);
    return function(...args) {
      filter.forEach(entity => {
        each(entity, ...args);
      });
    };
  }
}
