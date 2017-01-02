import Entity from '../../../src/entities/Entity';

describe('Entity', () => {
  let entity;
  let componentCollection;
  let component;

  beforeEach(() => {
    componentCollection = jasmine.createSpyObj('ComponentCollection', ['get', 'add']);
    component = jasmine.createSpyObj('Component', ['get', 'set', 'has', 'remove']);

    entity = new Entity(100, componentCollection);
  });

  describe('getId()', () => {
    it(
      'should return numeric ids as strings to match the ids used by ' +
      'the componentCollection'
    , () => {
      // this ensures the id matches the string ids used by componentCollection
      expect(entity.getId()).toBe('100');
    });
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

  describe('has()', () => {
    [true, false].forEach((result) => {
      it('should return the result from the component has() method', () => {
        componentCollection.get.and.returnValue(component);
        component.has.and.returnValue(result);

        expect(entity.has('foo')).toBe(result);
        expect(componentCollection.get).toHaveBeenCalledWith('foo');
        expect(component.has).toHaveBeenCalledWith(entity.getId());
      });
    });
  });

  describe('remove()', () => {
    it('should remove the component data for given component and return itself', () => {
      componentCollection.get.and.returnValue(component);

      const result = entity.remove('foo');

      expect(result).toBe(entity);
      expect(componentCollection.get).toHaveBeenCalledWith('foo');
      expect(component.remove).toHaveBeenCalledWith(entity.getId());
    });
  });
});
