import IteratorFactory from '../../../src/entities/IteratorFactory';

describe('IteratorFactory.create', () => {
  it('should return a new instance of the filtered iterator if a component array is given', () => {
    const componentCollection = {};
    const entityFactory = {};
    const components = ['foo', 'bar'];

    function FilteredIterator(a, b, c) {
      expect(this instanceof FilteredIterator).toBe(true);
      expect(a).toBe(componentCollection);
      expect(b).toBe(entityFactory);
      expect(c).toBe(components);
    }

    const factory = new IteratorFactory(FilteredIterator);
    const result = factory.create(componentCollection, entityFactory, components);
    expect(result instanceof FilteredIterator).toBe(true);
  });
});
