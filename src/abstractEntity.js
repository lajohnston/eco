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
   * Creates a component instance and adds it to this entity
   *
   * @param {string} name the identifier of the component to add
   * @param {...mixed} args the arguments to pass to the component factory
   *
   * @returns {Object} self
   */
  add(name, ...args) {
    this[name] = this.constructor.createComponent(name, ...args);
    return this;
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
   * Removes the component with the given name from this entity
   *
   * @param {string} name the component identifier
   * @returns {Object} self
   */
  remove(name) {
    this[name] = undefined;
    return this;
  }

  /**
   * Removes all the components from this entity
   */
  removeAll() {
    Object.keys(this.components).forEach(name => {
      this.remove(name);
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
   * Abtract method. Returns a new component instance
   *
   * @param {string} name the name of the component
   * @param {...args} args arguments to pass to the component factory
   * @returns {mixed} component instance
   */
  static createComponent(name, ...args) {} // eslint-disable-line

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
