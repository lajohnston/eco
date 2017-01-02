import Iterator from '../../../src/entities/FilteredIterator';

describe('Entity filtered iterator', () => {
  let componentCollection;
  let components;
  let entityFactory;

  beforeEach(() => {
    components = {
      foo: jasmine.createSpyObj('fooComponent', ['get', 'has', 'each']),
      bar: jasmine.createSpyObj('barComponent', ['get', 'has', 'each']),
    };

    componentCollection = jasmine.createSpyObj('componentCollection', ['get']);
    componentCollection.get.and.callFake(name => components[name]);

    entityFactory = jasmine.createSpyObj('entityFactory', ['create']);
  });

  describe('getData()', () => {
    it('should return an array of arrays, each containing component data for each entity that has all components', () => {
      // It will iterate through the entities for the first component (foo)
      components.foo.each.and.callFake((callback) => {
        callback(1, 'fooEntity1');
        callback(2, 'fooEntity2');
        callback(3, 'fooEntity3');
      });

      // The second component (bar) will have entities 1 and 2, but not 3
      components.bar.has.and.callFake(entityId => entityId < 3);
      components.bar.get.and.callFake(entityId => `barEntity${entityId}`);

      const iterator = new Iterator(componentCollection, entityFactory, ['foo', 'bar']);
      const result = iterator.getData();

      expect(components.foo.each).toHaveBeenCalled();
      expect(components.bar.get.calls.allArgs()).toEqual([[1], [2]]);
      expect(result.length).toBe(2);

      // Entity 1
      expect(result[0][0]).toBe('fooEntity1');
      expect(result[0][1]).toBe('barEntity1');

      // Entity 2
      expect(result[1][0]).toBe('fooEntity2');
      expect(result[1][1]).toBe('barEntity2');
    });

    it('should include an entity proxy as the last value in each array', () => {
      const entityId = 123;

      components.foo.each.and.callFake((callback) => {
        callback(entityId, {});
      });

      components.bar.has.and.returnValue(true);
      components.bar.get.and.returnValue({});

      const entity = {};
      entityFactory.create.and.returnValue(entity);

      const iterator = new Iterator(componentCollection, entityFactory, ['foo', 'bar']);
      const result = iterator.getData();

      expect(result[0][2]).toBe(entity);
      expect(entityFactory.create).toHaveBeenCalledWith(
        entityId,
        componentCollection
      );
    });

    ['string', 123, {}, function blah() {}, null, true, false, undefined].forEach((nonArray) => {
      it('should return an empty array if no component array has been given to iterate over', () => {
        const iterator = new Iterator(componentCollection, entityFactory, nonArray);
        expect(iterator.getData()).toEqual([]);
      });
    });
  });
});
