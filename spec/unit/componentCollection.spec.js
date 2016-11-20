import ComponentCollection from '../../src/components/ComponentCollection';

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

  describe('set()', () => {
    it('should create the definition using the component factory', () => {
      const component = {};
      componentFactory.create.and.returnValue(component);

      const definition = {};

      expect(collection.set('foo', definition)).toBe(component);
      expect(componentFactory.create).toHaveBeenCalledWith(definition);
      expect(collection.get('foo')).toBe(component);
    });
  });
});
