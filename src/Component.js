export default class Component {
  constructor() {
    this.entities = {};
  }

  /**
   * Get the component data belonging to a given entity
   *
   * @param {number}  entityId  the entity's unique id
   *
   * @returns {mixed} the entity's component data
   */
  get(entityId) {
    return this.entities[entityId];
  }

  /**
   * Set the component data for a given entity
   *
   * @param {number}  entityId  the entity's unique id
   * @param {object}  data  the data to override the defaults
   *
   * @returns {mixed} the entity's component data
   */
  set(entityId, data) {
    this.entities[entityId] = data;
  }
}
