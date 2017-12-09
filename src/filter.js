/**
 * @param {Entity} entity the entity to check
 * @param {Array} components components names
 *
 * @returns {boolean} true if the entity has all the components, else false
 */
function arrayFilter(entity, components) {
  for (let i = 0; i < components.length; i++) {
    if (!entity.has(components[i])) return false;
  }

  return true;
}

/**
 * Creates a filter to iterate over entities that match a given criteria
 */
export default class Filter {
  /**
   * @param {EntityCollection} entities collection of all entities
   * @param {Array.<string>|function} criteria criteria to filter by, either an
   *  array of component names, or a function that returns true if the entity
   *  matches a custom criteria
   */
  constructor(entities, criteria) {
    this.entities = entities;
    this.criteria = Array.isArray(criteria)
      ? entity => arrayFilter(entity, criteria)
      : criteria;

    this.cacheVersion = null;
    this.cached = [];
  }

  /**
   * @type {Array}  array of entities that match the criteria
   */
  get filtered() {
    if (this.cacheVersion !== this.entities.version) {
      this.cached = this.entities.filter(this.criteria);
      this.cacheVersion = this.entities.version;
    }

    return this.cached;
  }

  /**
   * Iterates through each matching entity
   *
   * @param {function} callback function that will be called with each matching
   *  entity
   */
  forEach(callback) {
    this.filtered.forEach(callback);
  }
}
