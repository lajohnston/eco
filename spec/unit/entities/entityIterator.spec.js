import EntityIterator from '../../../src/entities/EntityIterator';

describe('EntityIterator', () => {
  let iterator;
  let componentCollection;
  let entityFactory;

  beforeEach(() => {
    componentCollection = jasmine.createSpyObj('ComponentCollection', ['getEntityIds']);
    entityFactory = jasmine.createSpyObj('EntityFactory', ['create']);

    iterator = new EntityIterator(componentCollection, entityFactory);
  });

  describe('getData()', () => {
    it('should return an array of entity proxies for each entity id in the component collection', () => {
      componentCollection.getEntityIds.and.returnValue([1, 2, 3]);
      entityFactory.create.and.callFake(id => ({ id }));

      const result = iterator.getData();

      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
      expect(result[2].id).toBe(3);
    });
  });

  describe('each()', () => {
    it('should call the callback for each record returned by getData()', () => {
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

      expect(count).toBe(data.length);
    });

    it('should call the callback for each record returned by getData() if each item is not an array', () => {
      const data = [
        'foo',
        'bar',
      ];

      spyOn(iterator, 'getData').and.returnValue(data);

      let count = 0;

      iterator.each((arg1) => {
        expect(arg1).toBe(data[count]);
        count += 1;
      });

      expect(count).toBe(data.length);
    });
  });
});
