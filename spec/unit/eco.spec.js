import Eco from '../../src/Eco';

describe('Eco', () => {
  let eco;
  let componentCollection;
  let idFactory;
  let entityFactory;
  let iteratorFactory;

  beforeEach(() => {
    componentCollection = jasmine.createSpyObj(
      'componentCollection',
      ['set', 'getDataByEntity', 'setDataByEntity']
    );

    idFactory = jasmine.createSpyObj('idFactory', ['create', 'reserve']);
    entityFactory = jasmine.createSpyObj('entityFactory', ['create']);
    iteratorFactory = jasmine.createSpyObj('iteratorFactory', ['create']);

    eco = new Eco(componentCollection, idFactory, entityFactory, iteratorFactory);
  });

  describe('entity()', () => {
    it('should return a new entity instance from the entity factory if no id is given', () => {
      const entity = {};

      idFactory.create.and.returnValue(123);
      entityFactory.create.and.returnValue(entity);

      expect(eco.entity()).toBe(entity);
      expect(entityFactory.create).toHaveBeenCalledWith(
        123,
        componentCollection
      );
    });

    it('should return an entity proxy with the provided id if one is given', () => {
      const entity = {};
      entityFactory.create.and.returnValue(entity);

      const result = eco.entity(100);
      expect(result).toBe(entity);
      expect(entityFactory.create).toHaveBeenCalledWith(100, componentCollection);
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

  describe('setDataByEntity()', () => {
    it('should pass the data to the component collection', () => {
      const data = {};

      eco.setDataByEntity(data);
      expect(componentCollection.setDataByEntity).toHaveBeenCalledWith(data);
    });

    it('should register each id with the id factory to prevent collisions', () => {
      eco.setDataByEntity({
        1: {},
        2: {},
      });

      expect(idFactory.reserve).toHaveBeenCalledWith(['1', '2']);
    });
  });
});
