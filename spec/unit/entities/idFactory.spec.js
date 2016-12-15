import IdFactory from '../../../src/entities/IdFactory';

describe('IdFactory', () => {
  [1, 5, 100].forEach((startId) => {
    it('should return an incrementing id starting with the given value', () => {
      const idFactory = new IdFactory(startId);

      expect(idFactory.create()).toBe(startId);
      expect(idFactory.create()).toBe(startId + 1);
    });
  });

  it('should default with a starting id of 0', () => {
    const idFactory = new IdFactory();

    expect(idFactory.create()).toBe(0);
    expect(idFactory.create()).toBe(1);
  });
});
