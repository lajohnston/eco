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
   * @param {string[]} components components the filter is concerned with
   * @param {function} [filterFunc] custom filter function that should return
   *  false if a given entity should not be included
   */
  constructor(entities, components, filterFunc) {
    this.entities = entities;

    this.componentMap = Object.create(null);
    components.forEach(component => {
      this.componentMap[component] = true;
    });

    this.criteria = filterFunc
      ? filterFunc
      : entity => arrayFilter(entity, components);

    this.cacheVersion = {};
    this.cached = [];
  }

  /**
   * @type {Array}  array of entities that match the criteria
   */
  get filtered() {
    // Walk versions until a cache-breaking change is found
    while (this.cacheVersion.next) {
      const next = this.cacheVersion.next;

      if (!next.component) break; // an entity has been added or removed
      if (this.componentMap[next.component]) break; // relevant component changed

      this.cacheVersion = next;
    }

    // Refresh cache if version isn't up to date
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
