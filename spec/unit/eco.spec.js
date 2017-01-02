import Eco from '../../src/Eco';

describe('Eco', () => {
  let eco;
  let componentCollection;
  let idFactory;
  let entityFactory;
  let iteratorFactory;

  beforeEach(() => {
    componentCollection = jasmine.createSpyObj('componentCollection', ['set', 'getDataByEntity']);
    idFactory = jasmine.createSpyObj('idFactory', ['create']);
    entityFactory = jasmine.createSpyObj('entityFactory', ['create']);
    iteratorFactory = jasmine.createSpyObj('iteratorFactory', ['create']);

    eco = new Eco(componentCollection, idFactory, entityFactory, iteratorFactory);
  });

  describe('createEntity()', () => {
    it('should return a new entity instance from the entity factory', () => {
      const entity = {};

      idFactory.create.and.returnValue(123);
      entityFactory.create.and.returnValue(entity);

      expect(eco.createEntity()).toBe(entity);
      expect(entityFactory.create).toHaveBeenCalledWith(
        123,
        componentCollection
      );
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

  describe('getDataByEntity()', () => {
    it('should return the entity data from the component collection', () => {
      const data = {};
      componentCollection.getDataByEntity.and.returnValue(data);

      expect(eco.getDataByEntity()).toBe(data);
    });
  });
});
