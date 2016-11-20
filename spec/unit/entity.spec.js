import Entity from '../../src/Entity';

describe('Entity', () => {
  let entity;
  let componentCollection;
  let component;

  beforeEach(() => {
    componentCollection = jasmine.createSpyObj('ComponentCollection', ['get', 'add']);
    component = jasmine.createSpyObj('Component', ['get', 'set']);

    entity = new Entity(100, componentCollection);
  });

  describe('get()', () => {
    it('should return the component data for the entity', () => {
      const data = {};
      componentCollection.get.and.returnValue(component);
      component.get.and.returnValue(data);

      const result = entity.get('foo');
      expect(componentCollection.get).toHaveBeenCalledWith('foo');
      expect(component.get).toHaveBeenCalledWith(entity.getId());

      expect(result).toBe(data);
    });
  });

  describe('add()', () => {
    it('should set the component data for the entity and return itself', () => {
      const data = {};
      componentCollection.get.and.returnValue(component);

      const result = entity.add('foo', data);

      expect(result).toBe(entity);
      expect(componentCollection.get).toHaveBeenCalledWith('foo');
      expect(component.set).toHaveBeenCalledWith(entity.getId(), data);
    });
  });
});
