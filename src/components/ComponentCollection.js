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
   * @param   {string}  componentName  the name of the component
   * @returns {object}  the component object, or undefined
   */
  get(componentName) {
    if (this.has(componentName)) {
      return this.components[componentName];
    }

    return this.nullComponent;
  }

  /**
   * Returns an array of ids for entities that have at least one component
   *
   * @returns {Array} Array of entity ids
   */
  getEntityIds() {
    const ids = {};

    Object.keys(this.components).forEach((componentName) => {
      const component = this.components[componentName];
      component.getEntityIds().forEach((id) => {
        ids[id] = true;
      });
    });

    return Object.keys(ids);
  }

  /**
   * Indicates whether the collection contains a component with the given name
   *
   * @param   {string}  name  the component's unique name
   *
   * @returns {boolean} true if the component exists, otherwise false
   */
  has(name) {
    return Object.hasOwnProperty.call(this.components, name);
  }

  /**
   * Sets the null value to return if a component does not exist
   *
   * @param {mixed}  nullComponent the null value to return
   */
  setNullObject(nullComponent) {
    this.nullComponent = nullComponent;
  }
}
