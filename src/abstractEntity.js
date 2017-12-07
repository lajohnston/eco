// Prototype-less components object, improves performance
const Components = Object.create(null, {});

/**
 * Abstract entity class
 * The createComponent function should be extended for the class to be usuable
 */
export default class AbstractEntity {
  constructor() {
    this.components = Object.create(Components, {});
  }

  /**
   * Adds an accessor property to the class for accessing the given component,
   * i.e. component 'foo' is accessible on instances using entity.foo
   *
   * @param {string} name the name of the component
   */
  static defineComponent(name) {
    const prototype = this.prototype;

    Object.defineProperty(prototype, name, {
      enumerable: true,
      configurable: true,
      get: function() {
        return this.components[name];
      },
      set: function(newValue) {
        const oldValue = this.components[name];
        this.components[name] = newValue;
        this.constructor.emit(this, name, newValue, oldValue);
      }
    });
  }

  /**
   * Indicates whether the entity has the given component
   *
   * @param {string} name the component identifier
   * @returns {boolean} true if the entity has the component, otherwise false
   */
  has(name) {
    return typeof this.components[name] !== "undefined";
  }

  /**
   * Removes all the components from this entity
   */
  removeAll() {
    Object.keys(this.components).forEach(name => {
      // Remove via entity property to trigger the event emitter
      this[name] = undefined;
    });

    return this;
  }

  /**
   * Returns an object containing all the entity's components indexed by name
   *
   * @returns {Object} object of components indexed by name
   */
  getComponents() {
    const components = {};
    Object.keys(this.components).forEach(name => {
      components[name] = this.components[name];
    });

    return components;
  }

  /**
   * Abtract method. Called when a component is set or removed
   *
   * @param {Object} entity the entity that has changed
   * @param {string} componentName the name of the component that has changed
   * @param {mixed}  newValue the new component value
   * @param {mixed}  oldValue the previous component value
   */
  static emit(entity, componentName, newValue, oldValue) {} // eslint-disable-line
}
