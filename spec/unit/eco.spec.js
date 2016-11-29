import Eco from '../../src/Eco';

describe('Eco', () => {
  let eco;
  let entityFactory;
  let componentCollection;

  beforeEach(() => {
    entityFactory = jasmine.createSpyObj('entityFactory', ['create']);
    componentCollection = jasmine.createSpyObj('componentCollection', ['set']);
    eco = new Eco(entityFactory, componentCollection);
  });

  describe('createEntity', () => {
    it('should return a new entity instance from the entity factory', () => {
      const entity = {};

      entityFactory.create.and.returnValue(entity);

      expect(eco.createEntity()).toBe(entity);
      expect(entityFactory.create).toHaveBeenCalled();
    });
  });

  describe('addComponent', () => {
    it('should add the component to the component collection and return the result', () => {
      const data = {};
      const result = {};

      componentCollection.set.and.returnValue(result);

      expect(eco.addComponent('foo', data)).toBe(result);
      expect(componentCollection.set).toHaveBeenCalledWith('foo', data);
    });
  });
});
