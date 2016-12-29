describe('Iterating over entities', () => {
  let eco;

  beforeEach(() => {
    eco = new window.Eco();

    eco.createComponent('foo');
    eco.createComponent('bar');
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

    it('should iterate over all entities that have components if no components are given', () => {
      const entities = [
        eco.createEntity().add('foo', {}),
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
      let count = 0;

      iter.each(() => {
        count += 1;
      });

      expect(count).toBe(0);
    });

    it('should ignore entities that have had a required component removed since the last iteration');

    it('should include entities that have had a component added since the last iteration and now qualify');

    it('should not call the callback if the component list is not an array');
  });
});
