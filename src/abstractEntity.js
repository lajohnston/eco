/**
 * Abstract entity class
 * The createComponent function should be extended for the class to be usuable
 */
export default class AbstractEntity {
  constructor() {
    this.components = {};
  }

  /**
   * Creates a component instance and adds it to this entity
   *
   * @param {string} componentName the name of the component to add
   * @param {...mixed} args the arguments to pass to the component factory
   *
   * @returns {Object} self
   */
  add(componentName, ...args) {
    this.components[componentName] = this.constructor.createComponent(
      componentName,
      ...args
    );

    return this;
  }

  /**
   * Indicates whether the entity has the given component
   *
   * @param {string} componentName the component identifier
   * @returns {boolean} true if the entity has the component, otherwise false
   */
  has(componentName) {
    return this.components.hasOwnProperty(componentName);
  }

  /**
   * Adds an accessor property to the class for accessing the given component,
   * i.e. component 'foo' is accessible on instances using entity.foo
   *
   * @param {string} name the name of the component
   */
  static defineComponent(name) {
    Object.defineProperty(this.prototype, name, {
      enumerable: true,
      configurable: true,
      get: function() {
        return this.components[name];
      },
      set: function(newValue) {
        this.components[name] = newValue;
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
  static createComponent(name, ...args) {}
}
