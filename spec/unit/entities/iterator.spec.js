import Iterator from '../../../src/entities/Iterator';

describe('Entity iterator', () => {
  let componentCollection;
  let components;

  beforeEach(() => {
    components = {
      foo: jasmine.createSpyObj('fooComponent', ['get', 'has', 'each']),
      bar: jasmine.createSpyObj('barComponent', ['get', 'has', 'each']),
    };

    componentCollection = jasmine.createSpyObj('componentCollection', ['get']);
    componentCollection.get.and.callFake(name => components[name]);
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

      const iterator = new Iterator(componentCollection, ['foo', 'bar']);
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

    it('should include an entity proxy as the last value in each array');
  });

  describe('each()', () => {
    it('should call the callback for each record returned by getData()', () => {
      const iterator = new Iterator(componentCollection, ['foo', 'bar']);
      const data = [
        ['a', 'b', 'c'],
        ['d', 'e', 'f'],
      ];

      spyOn(iterator, 'getData').and.returnValue(data);

      let count = 0;

      iterator.each((arg1, arg2, arg3) => {
        const expected = data[count];

        expect(arg1).toBe(expected[0]);
        expect(arg2).toBe(expected[1]);
        expect(arg3).toBe(expected[2]);

        count += 1;
      });

      expect(count).toBe(2);
    });
  });
});
