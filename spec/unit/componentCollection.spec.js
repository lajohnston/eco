import ComponentCollection from '../../src/ComponentCollection';

describe('ComponentCollection', () => {
  let collection;
  let componentFactory;

  beforeEach(() => {
    componentFactory = jasmine.createSpyObj('componentFactory', ['add']);
    collection = new ComponentCollection(componentFactory);
  });

  it('should define a constructor', () => {
    expect(ComponentCollection).toBeDefined();
    expect(new ComponentCollection()).toBeDefined();
  });

  describe('add()', () => {
    it('should add the definition to the component factory', () => {
      const definition = {};
      collection.add('foo', definition);
      expect(componentFactory.add).toHaveBeenCalledWith('foo', definition);
    });

    [true, false].forEach((result) => {
      it('should return the result from the component factory', () => {
        componentFactory.add.and.returnValue(result);
        expect(collection.add('foo', {})).toBe(result);
      });
    });
  });
});
