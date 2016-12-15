import Eco from '../../src/Eco';

describe('Eco', () => {
  let eco;
  let entityFactory;
  let iteratorFactory;
  let componentCollection;

  beforeEach(() => {
    entityFactory = jasmine.createSpyObj('entityFactory', ['create']);
    iteratorFactory = jasmine.createSpyObj('iteratorFactory', ['create']);
    componentCollection = jasmine.createSpyObj('componentCollection', ['set']);
    eco = new Eco(componentCollection, entityFactory, iteratorFactory);
  });

  describe('createEntity()', () => {
    it('should return a new entity instance from the entity factory', () => {
      const entity = {};

      entityFactory.create.and.returnValue(entity);

      expect(eco.createEntity()).toBe(entity);
      expect(entityFactory.create).toHaveBeenCalled();
    });
  });

  describe('createComponent()', () => {
    it('should add the component to the component collection and return the result', () => {
      const data = {};
      const result = {};

      componentCollection.set.and.returnValue(result);

      expect(eco.createComponent('foo', data)).toBe(result);
      expect(componentCollection.set).toHaveBeenCalledWith('foo', data);
    });
  });

  describe('createIterator()', () => {
    it('should return a new iterator from the iterator factory', () => {
      const iterator = {};

      iteratorFactory.create.and.returnValue(iterator);

      expect(eco.createIterator(['foo', 'bar'])).toBe(iterator);
      expect(iteratorFactory.create).toHaveBeenCalledWith(
        componentCollection,
        entityFactory,
        ['foo', 'bar']
      );
    });
  });
});
