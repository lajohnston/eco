import Entity from '../../src/Entity';

describe('Entity', () => {
  let entity;
  let componentCollection;

  beforeEach(() => {
    componentCollection = jasmine.createSpyObj('ComponentCollection', ['getForEntity', 'setForEntity']);
    entity = new Entity(100, componentCollection);
  });

  describe('get()', () => {
    it('should return the component data for the entity', () => {
      const component = {};
      componentCollection.getForEntity.and.returnValue(component);

      const result = entity.get('foo');
      expect(componentCollection.getForEntity).toHaveBeenCalledWith(entity.getId(), 'foo');
      expect(result).toBe(component);
    });
  });

  describe('set()', () => {
    it('should set the component data for the entity', () => {
      const component = {};

      const result = entity.set('foo', component);
      expect(result).toBe(entity);
      expect(componentCollection.setForEntity).toHaveBeenCalledWith(entity.getId(), 'foo', component);
    });
  });
});
