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
      ['set', 'has', 'getDataByEntity', 'setDataByEntity', 'getEntityIds']
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

  describe('addComponent()', () => {
    it('should add the component to the component collection and return true if it is not already defined', () => {
      const data = {};
      const name = 'foo';

      componentCollection.has.and.returnValue(false);

      expect(eco.addComponent('foo', data)).toBe(true);

      expect(componentCollection.has).toHaveBeenCalledWith(name);
      expect(componentCollection.set).toHaveBeenCalledWith('foo', data);
    });

    it('should return false without adding the component if the name is already defined', () => {
      const name = 'foo';

      componentCollection.has.and.returnValue(true);

      expect(eco.addComponent('foo')).toBe(false);

      expect(componentCollection.has).toHaveBeenCalledWith(name);
      expect(componentCollection.set).not.toHaveBeenCalled();
    });
  });

  describe('filter()', () => {
    it(`should create an iterator using the iterator factory and pass the
      callback to its each() method`,
    () => {
      const iterator = jasmine.createSpyObj('iterator', ['each']);

      iteratorFactory.create.and.returnValue(iterator);

      const callback = () => {};

      eco.filter(['foo', 'bar'], callback);

      expect(iteratorFactory.create).toHaveBeenCalledWith(
        componentCollection,
        entityFactory,
        ['foo', 'bar']
      );

      expect(iterator.each).toHaveBeenCalledWith(callback);
    });

    [undefined, null, true, false, 1, '', {}, function foo() {}].forEach((nonArray) => {
      it('should do nothing if the components list if not an array', () => {
        eco.filter(nonArray, () => { });
        expect(iteratorFactory.create).not.toHaveBeenCalled();
      });
    });
  });

  describe('getEntities()', () => {
    it('should call the callback with an entity proxy for each entity id returned by the componentCollection', () => {
      const entityIds = [1, 5, 10];

      componentCollection.getEntityIds.and.returnValue(entityIds);

      entityFactory.create.and.callFake((id, componentArg) => {
        expect(componentArg).toBe(componentCollection);

        // Just return id for testing purposes
        return id;
      });

      const result = eco.getEntities();

      entityIds.forEach((id) => {
        expect(result).toContain(id);
      });
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
