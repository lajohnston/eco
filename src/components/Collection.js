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
   * @returns {mixed} the data if it exists. If the data does not exist, will
   *                  either return the null value defined by setNullValue(),
   *                  or undefined if it has not been set
   */
  get(key) {
    if (this.has(key)) {
      return this.values[key];
    }

    return this.nullValue;
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

  /**
   * Iterates through the data in the collection
   *
   * @param {Function}  callback  the callback to be called for each element,
   *                              with value, key args
   */
  forEach(callback) {
    Object.keys(this.values).forEach((key) => {
      callback(this.values[key], key);
    });
  }

  /**
   * Sets the null value to return when retreiving data that does not exist.
   * By default the collection will return undefined
   *
   * @param {mixed}  nullValue  the null value to return from get() when a key
   *                            does not exist in the collection
   */
  setNullValue(nullValue) {
    this.nullValue = nullValue;
  }
}
