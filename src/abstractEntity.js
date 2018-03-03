// Prototype-less components object to extend from, improves performance
const Components = Object.create(null);

/**
 * Abstract entity class. Should be extended for each Eco instance so each can
 * define its own components
 */
export default class AbstractEntity {
  /**
   * @param {Eco} eco the eco instance that manages the entity
   */
  constructor(eco) {
    this.eco = eco;
    this.components = Object.create(Components);
    this._enabled = true;
  }

  /**
   * Returns a reference to this entity to allow it to be accessed with destructuring
   *
   * @type {Entity} the entity
   */
  get entity() {
    return this;
  }

  /**
   * @type {boolean} true if the entity is enabled, otherwise false
   */
  get enabled() {
    return this._enabled;
  }

  set enabled(status) {
    const oldStatus = this._enabled;
    const newStatus = status ? true : false;

    if (oldStatus !== newStatus) {
      this._enabled = newStatus;
      this.eco.onEntityStatusChanged(this, this._enabled);
    }
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
        const oldValue = this.components[name];
        this.components[name] = newValue;

        if (this._enabled) {
          this.eco.onComponentChanged(this, name, newValue, oldValue);
        }
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
}
