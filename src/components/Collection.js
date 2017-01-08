export default class Collection {
  constructor() {
    this.values = {};
  }

  /**
   * Store data referenced by the given key
   *
   * @param {mixed}   key   the identifier for the data
   * @param {object}  data  the data to store
   */
  set(key, data) {
    this.values[key] = data;
  }

  /**
   * Retrieve data referenced by the given key
   *
   * @param {mixed}   key   the identifier for the data
   * @returns {mixed} the data
   */
  get(key) {
    return this.values[key];
  }

  /**
   * Indicates whether this collection contains the given key
   *
   * @param   {mixed}   key
   *
   * @returns {boolean} true if the collection has this key, otherwise false
   */
  has(key) {
    return Object.hasOwnProperty.call(this.values, key);
  }
}
