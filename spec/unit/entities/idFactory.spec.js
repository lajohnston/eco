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

  describe('reserve()', () => {
    [
      { currentNext: 1, reserve: [2, 100, 45], expectedNext: 101 },
      { currentNext: 1, reserve: ['2', '100', '45'], expectedNext: 101 },
      { currentNext: 102, reserve: [2, 101, 45], expectedNext: 102 },
      { currentNext: 1, reserve: [1.2], expectedNext: 2 },
    ].forEach((scenario) => {
      it('should ensure the next id assigned is one higher than the highest out of the the reserve list or current next id', () => {
        const idFactory = new IdFactory(scenario.currentNext);
        idFactory.reserve(scenario.reserve);
        expect(idFactory.create()).toBe(scenario.expectedNext);
      });
    });

    it('should ignore non-integer values', () => {
      const firstId = 1;
      const idFactory = new IdFactory(firstId);

      idFactory.reserve([
        '', 'string', null, false, true, {}, function foo() {},
      ]);

      expect(idFactory.create()).toBe(firstId);
    });
  });
});
