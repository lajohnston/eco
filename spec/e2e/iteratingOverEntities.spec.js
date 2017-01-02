describe('Iterating over entities', () => {
  let eco;

  beforeEach(() => {
    eco = new window.Eco();

    eco.createComponent('foo');
    eco.createComponent('bar');
    eco.createComponent('baz');
  });

  describe('each()', () => {
    it('should call the callback with the component data for each entity that has all the given components', () => {
      const entities = [
        eco.createEntity().add('foo', {}).add('bar', {}),
        eco.createEntity().add('foo', {}).add('bar', {}),
      ];

      const iter = eco.createIterator(['foo', 'bar']);

      let count = 0;

      iter.each((foo, bar, entity) => {
        const expectedEntity = entities[count];

        expect(foo).toBe(expectedEntity.get('foo'));
        expect(bar).toBe(expectedEntity.get('bar'));
        expect(entity.getId()).toBe(expectedEntity.getId());

        count += 1;
      });

      expect(count).toBe(entities.length);
    });

    it('should return all the entities for a component if only one component has been given', () => {
      const entities = [
        eco.createEntity().add('foo', {}),
        eco.createEntity().add('foo', {}),
      ];

      const iter = eco.createIterator(['foo']);

      let count = 0;

      iter.each((foo, entity) => {
        const expectedEntity = entities[count];

        expect(foo).toBe(expectedEntity.get('foo'));
        expect(entity.getId()).toBe(expectedEntity.getId());

        count += 1;
      });

      expect(count).toBe(entities.length);
    });

    it('should iterate over all entities that have at least one component, if no filter components are specified', () => {
      const entities = [
        eco.createEntity().add('foo', {}).add('bar'),
        eco.createEntity().add('bar', {}),
        eco.createEntity().add('baz', {}),
      ];

      eco.createEntity(); // entity with no components

      const iter = eco.createIterator();

      let count = 0;

      iter.each((entity) => {
        const expectedEntity = entities[count];
        expect(entity.getId()).toBe(expectedEntity.getId());

        count += 1;
      });

      expect(count).toBe(entities.length);
    });

    it('should ignore entities that do not have all the components', () => {
      eco.createEntity()
        .add('foo', {});

      const iter = eco.createIterator(['foo', 'bar']);

      iter.each(() => {
        fail('Iterator callback was not expected to be called');
      });
    });

    it('should ignore entities that have had a required component removed since the last iteration', () => {
      const entity = eco.createEntity()
        .add('foo', {});

      const iter = eco.createIterator(['foo']);

      let firstCount = 0;

      iter.each(() => {
        firstCount += 1;
      });

      expect(firstCount).toBe(1);

      entity.remove('foo');

      iter.each(() => {
        fail('Iterator callback was not expected to be called');
      });
    });

    it('should include entities that have had a component added since the last iteration and now qualify', () => {
      const entity = eco.createEntity()
        .add('foo');

      const barIter = eco.createIterator(['bar']);

      barIter.each(() => {
        fail('Iterator callback was not expected to be called');
      });

      entity.add('bar');

      let count = 0;

      barIter.each((bar, entityArg) => {
        expect(entityArg.getId()).toBe(entity.getId());
        count += 1;
      });

      expect(count).toBe(1);
    });
  });
});
