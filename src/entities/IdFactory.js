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

  /**
   * Reserves a list of ids so they aren't reassigned in future
   *
   * @param {Array<number>} array of numeric ids
   */
  reserve(ids) {
    let highest = this.nextId;

    ids.forEach((id) => {
      const candidate = parseInt(id, 10);

      if (!isNaN(candidate) && id > highest) {
        highest = candidate + 1;
      }
    });

    this.nextId = highest;
  }
}
