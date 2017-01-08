import Collection from '../../../src/components/Collection';

describe('Collection', () => {
  describe('get(), set() and has()', () => {
    it('should store and retrieve values by a key', () => {
      const collection = new Collection();
      const key = 1;
      const value = {};

      collection.set(key, value);
      expect(collection.get(key)).toBe(value);
      expect(collection.has(key)).toBe(true);
    });

    it('has() should return false if the component does not contain data for the entity', () => {
      const collection = new Collection();
      expect(collection.has(1)).toBe(false);
    });
  });
});
