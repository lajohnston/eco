export default class ComponentCollection {
  constructor(componentFactory) {
    this.componentFactory = componentFactory;
    this.componentEntities = {};
  }

  /**
   * Adds a component definition
   *
   * @param {string}  name  the unique name for the component
   * @param {mixed}   data  the default data for the component
   *
   * @returns {boolean} true if the component was added successfully,
   *                    or false if it was invalid or already exists
   */
  add(name, data) {
    return this.componentFactory.add(name, data);
  }
}
