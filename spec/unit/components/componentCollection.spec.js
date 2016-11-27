import ComponentCollection from '../../../src/components/ComponentCollection';

describe('ComponentCollection', () => {
  let collection;
  let componentFactory;

  beforeEach(() => {
    componentFactory = jasmine.createSpyObj('componentFactory', ['set', 'create']);
    collection = new ComponentCollection(componentFactory);
  });

  it('should define a constructor', () => {
    expect(ComponentCollection).toBeDefined();
    expect(new ComponentCollection()).toBeDefined();
  });

  describe('set() and get()', () => {
    it('should create the definition using the component factory', () => {
      const component = {};
      componentFactory.create.and.returnValue(component);

      const definition = {};
      const result = collection.set('foo', definition);

      expect(componentFactory.create).toHaveBeenCalledWith(definition);
      expect(result).toBe(component);
      expect(collection.get('foo')).toBe(component);
    });
  });

  describe('get()', () => {
    it('should return undefined if the component does not exist and no null component has been set', () => {
      expect(collection.get('foo')).not.toBeDefined();
    });

    it('should return the NullComponent if the component does not exist', () => {
      const nullComponent = {};
      collection.setNullObject(nullComponent);

      expect(collection.get('foo')).toBe(nullComponent);
    });
  });

  describe('has()', () => {
    it('should return true if the component exists in the collection', () => {
      collection.set('foo');
      expect(collection.has('foo')).toBe(true);
    });

    it('should return false if the component does not exist in the collection', () => {
      expect(collection.has('foo')).toBe(false);
    });
  })
});
