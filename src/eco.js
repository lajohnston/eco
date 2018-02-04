/**
 * Eco API
 *
 * @property {function} [onChange] called whenever an entity has a component
 *  added, removed or changed. Called with: entity, componentName, newValue,
 *  oldValue
 */
export default class Eco {
  /**
   * @param {function}  Entity class to use to create entities
   * @param {Object}    entityCollection collection to hold entities
   * @param {function}  createIterator function that returns an interator instance
   */
  constructor(Entity, entities, createIterator) {
    this.Entity = Entity;
    this.entities = entities;
    this.createIterator = createIterator;

    this.onChange = () => {};
  }

  /**
   * @type {Array} array of all entities
   */
  get all() {
    return this.entities.entities;
  }

  /**
   * Called by entities when they are enabled or disabled
   *
   * @param {Object}  entity the entity whose status has changed
   * @param {boolean} enabled true if the entity has been enabled, otherwise
   *  false
   */
  onEntityStatusChanged(entity, enabled) {
    if (enabled) {
      this.entities.add(entity);
    } else {
      this.entities.remove(entity);
    }
  }

  /**
   * Called by entities when one of their components has changed values
   *
   * @param {Object} entity the entity that was changed
   * @param {string} component the name of the component that was set
   * @param {mixed} newValue the new component value
   * @param {mixed} oldValue the previous component value
   */
  onComponentChanged(entity, component, newValue, oldValue) {
    if (
      (typeof newValue === "undefined" || typeof oldValue === "undefined") &&
      newValue !== oldValue
    ) {
      this.entities.incVersion(entity, component);
    }

    this.onChange(entity, component, newValue, oldValue);
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
    const entity = new this.Entity(this);
    this.entities.add(entity);
    return entity;
  }

  /**
   * Returns a new entity iterator instance
   *
   * @param {string[]} components components the iterator is concerned with
   * @param {function} [filterFunc] custom filter function accepts an entity
   *  and should return false if the entity should be excluded
   *
   * @returns {Iterator}  iterator instance
   */
  iterator(components, filterFunc) {
    return this.createIterator(this.entities, components, filterFunc);
  }
}
