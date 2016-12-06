import Iterator from '../../../src/entities/Iterator';

describe('Entity iterator', () => {
  let componentCollection;
  let components;

  beforeEach(() => {
    components = {
      foo: jasmine.createSpyObj('fooComponent', ['get']),
      bar: jasmine.createSpyObj('barComponent', ['get']),
    };

    componentCollection = jasmine.createSpyObj('componentCollection', ['get']);
    componentCollection.get.and.callFake(name => components[name]);
  });

  describe('getEntityIds', () => {
    it('should include all entity ids for entities that have all the required components');

    it('should not include entities that do not have all the components');
  });

  describe('getData()', () => {
    it('should return an array of arrays, each containing component data for each entity that has all components');

    it('should include an entity proxy as the last value in each array');
  });

  describe('each()', () => {
    it('should call the callback for each entity returned by getData()', () => {
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
