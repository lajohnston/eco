/**
 * Maintains a list of entities
 *
 * @property {Object} version the current version object, which is replaced
 *  whenever a change occurs to the collection
 */
export default class EntityCollection {
  constructor() {
    this.entities = [];
    this.version = new Version();
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
    this.incVersion(entity);
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

    this.incVersion(entity);
  }

  /**
   * Supersedes the current version property with a new version, to mark that
   * a change has occured
   */
  incVersion(entity, component) {
    this.version = this.version.supersede(entity, component);
  }
}

/**
 * Linked list of versions that log entity changes
 */
function Version(entity, component) {
  this.entity = entity;
  this.component = component;
  this.next = undefined;
}

/**
 * Creates a new version and links the previous version to it
 *
 * @param {Entity} entity the entity that has changed
 * @param {string} [component] name of the component that has changed, if any
 * @returns {Version} the new version
 */
Version.prototype.supersede = function(entity, component) {
  const newVersion = new Version(entity, component);
  this.next = newVersion;
  return newVersion;
};
