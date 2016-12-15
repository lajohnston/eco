/**
 * Creates incrementing numeric ids
 */
export default class IdFactory {
  /**
   * @param {number} startId  the first id to dispatch and increment from
   */
  constructor(startId) {
    this.nextId = startId || 0;
  }

  /**
   * Returns a unique numeric id
   *
   * @returns {number}  unique id
   */
  create() {
    return this.nextId++; // eslint-disable-line no-plusplus
  }
}
