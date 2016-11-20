export default class ComponentCollection {
  constructor(componentFactory) {
    this.componentFactory = componentFactory;
    this.components = {};
  }

  /**
   * Adds a component definition
   *
   * @param {string}  name  the unique name for the component
   * @param {mixed}   definition  the default data for the component
   *
   * @returns {boolean} true if the component was added successfully,
   *                    or false if it was invalid or already exists
   */
  set(name, definition) {
    const component = this.componentFactory.create(definition);

    this.components[name] = component;

    return component;
  }

  /**
   * Get a component with the given name
   *
   * @param {string}  name  the name of the component
   * @returns {object}  the component object, or undefined
   */
  get(name) {
    return this.components[name];
  }
}
