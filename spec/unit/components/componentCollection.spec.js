import ComponentCollection from '../../../src/components/ComponentCollection';
import Collection from '../../../src/components/Collection';

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

  it('should inherit from Collection', () => {
    expect(new ComponentCollection() instanceof Collection).toBe(true);
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

  describe('getEntityIds()', () => {
    it('should return an array of unique entity ids that have at least one component', () => {
      const fooComponent = jasmine.createSpyObj('foo', ['getEntityIds']);
      const barComponent = jasmine.createSpyObj('foo', ['getEntityIds']);

      let calls = 0;
      componentFactory.create.and.callFake(() => {
        calls += 1;
        return calls === 1 ? fooComponent : barComponent;
      });

      collection.set('foo');
      collection.set('bar');

      fooComponent.getEntityIds.and.returnValue(['1', '2', '3']);
      barComponent.getEntityIds.and.returnValue(['2', '3', '4']);

      expect(collection.getEntityIds()).toEqual(['1', '2', '3', '4']);
    });
  });

  describe('each()', () => {
    it('should call the callback for each component, with the component name and component object', () => {
      // Create components
      const components = [{}, {}];
      let calls = 0;

      componentFactory.create.and.callFake(() => {
        calls += 1;
        return components[calls - 1];
      });

      collection.set('foo', {});
      collection.set('bar', {});

      const result = {};

      collection.each((name, component) => {
        result[name] = component;
      });

      expect(result.foo).toBe(components[0]);
      expect(result.bar).toBe(components[1]);
    });
  });

  describe('getDataByEntity()', () => {
    it('should return all component data indexed by entity id and component name', () => {
      const fooComponent = jasmine.createSpyObj('foo', ['each']);
      const barComponent = jasmine.createSpyObj('bar', ['each']);

      // Each component
      spyOn(collection, 'each').and.callFake((callback) => {
        callback('foo', fooComponent);
        callback('bar', barComponent);
      });

      fooComponent.each.and.callFake((callback) => {
        callback('1', 'foo1');
        callback('2', 'foo2');
      });

      barComponent.each.and.callFake((callback) => {
        callback('1', 'bar1');
      });

      expect(collection.getDataByEntity()).toEqual({
        1: {
          foo: 'foo1',
          bar: 'bar1',
        },

        2: {
          foo: 'foo2',
        },
      });
    });
  });

  describe('setDataByEntity()', () => {
    it('should set the entity data for each component', () => {
      const data = {
        1: {
          foo: 'foo1',
          bar: 'bar1',
        },

        2: {
          foo: 'foo2',
        },
      };

      const fooComponent = jasmine.createSpyObj('foo', ['set']);
      const barComponent = jasmine.createSpyObj('bar', ['set']);

      // Each component
      spyOn(collection, 'each').and.callFake((callback) => {
        callback('foo', fooComponent);
        callback('bar', barComponent);
      });

      collection.setDataByEntity(data);

      expect(fooComponent.set).toHaveBeenCalledWith('1', 'foo1');
      expect(barComponent.set).toHaveBeenCalledWith('1', 'bar1');

      expect(fooComponent.set).toHaveBeenCalledWith('2', 'foo2');
      expect(barComponent.set).not.toHaveBeenCalledWith('2', 'bar2');
    });
  });
});
