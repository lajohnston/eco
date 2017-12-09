/**
 * Linked versioning
 */
function Version() {
  this.next = undefined;
}

Version.prototype.supersede = function() {
  const newVersion = new Version();
  this.next = newVersion;
  return newVersion;
};

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
    this.incVersion();
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

    this.incVersion();
  }

  /**
   * Supersedes the current version property with a new version, to mark that
   * a change has occured
   */
  incVersion() {
    this.version = this.version.supersede();
  }
}
