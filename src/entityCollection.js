export default class EntityCollection {
  constructor() {
    this.entities = [];
  }

  /**
   * @type {function}
   */
  get filter() {
    return this.entities.filter.bind(this.entities);
  }

  /**
   * Adds an entity to the collection
   *
   * @param {Object} entity
   */
  add(entity) {
    this.entities.push(entity);
  }

  /**
   * Removes an entity from the collection
   *
   * @param {Object} entity the entity to remove
   */
  remove(entity) {
    this.entities = this.entities.filter(test => {
      return test !== entity;
    });
  }
}
