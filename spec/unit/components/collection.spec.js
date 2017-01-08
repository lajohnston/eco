import Collection from '../../../src/components/Collection';

describe('Collection', () => {
  let collection;

  beforeEach(() => {
    collection = new Collection();
  });

  describe('get(), set() and has()', () => {
    it('should store and retrieve values by a key', () => {
      const key = 1;
      const value = {};

      collection.set(key, value);
      expect(collection.get(key)).toBe(value);
      expect(collection.has(key)).toBe(true);
    });

    it('has() should return false if the collection does not contain the key', () => {
      expect(collection.has(1)).toBe(false);
    });
  });

  describe('get()', () => {
    it('should return undefined if the key is not in the collection and no null value has been set', () => {
      expect(collection.get('foo')).not.toBeDefined();
    });

    it('should return the defined null value if the key does not exist', () => {
      const nullValue = {};
      collection.setNullValue(nullValue);

      expect(collection.get('foo')).toBe(nullValue);
    });
  });

  describe('forEach()', () => {
    it('should call the callback for each component, with the component name and component object', () => {
      collection.set('foo', {});
      collection.set('bar', {});

      const result = {};

      collection.forEach((value, key) => {
        result[key] = value;
      });

      expect(result.foo).toBe(collection.get('foo'));
      expect(result.bar).toBe(collection.get('bar'));
    });
  });

  describe('keys()', () => {
    it('should return the keys in the collection', () => {
      collection.set(1);
      collection.set(2);
      collection.set(3);

      expect(collection.keys()).toEqual(['1', '2', '3']);
    });
  });
});
