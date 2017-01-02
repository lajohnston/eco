import IteratorFactory from '../../../src/entities/IteratorFactory';

describe('IteratorFactory.create', () => {
  it('should return a new instance of the filtered iterator if a component array is given', () => {
    const componentCollection = {};
    const entityFactory = {};
    const components = ['foo', 'bar'];

    function EntityIterator() {
      fail('Did not expect the EntityIterator constructor to be called');
    }

    function FilteredIterator(a, b, c) {
      expect(this instanceof FilteredIterator).toBe(true);
      expect(a).toBe(componentCollection);
      expect(b).toBe(entityFactory);
      expect(c).toBe(components);
    }

    const factory = new IteratorFactory(EntityIterator, FilteredIterator);
    const result = factory.create(componentCollection, entityFactory, components);
    expect(result instanceof FilteredIterator).toBe(true);
  });

  [undefined, true, false, 'string', 1, function foo() {}].forEach((nonArray) => {
    it('should return a new instance of the entity iterator if a component array is not given', () => {
      const componentCollection = {};
      const entityFactory = {};

      function EntityIterator(a, b) {
        expect(this instanceof EntityIterator).toBe(true);
        expect(a).toBe(componentCollection);
        expect(b).toBe(entityFactory);
      }

      const factory = new IteratorFactory(EntityIterator);
      const result = factory.create(componentCollection, entityFactory, nonArray);
      expect(result instanceof EntityIterator).toBe(true);
    });
  });
});
