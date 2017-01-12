describe('Iterating over entities', () => {
  let eco;

  beforeEach(() => {
    eco = new window.Eco();

    eco.addComponent('foo');
    eco.addComponent('bar');
    eco.addComponent('baz');
  });

  describe('eco.filter()', () => {
    it('should call the callback with the component data for each entity that has all the given components', () => {
      const entities = [
        eco.entity().add('foo', {}).add('bar', {}),
        eco.entity().add('foo', {}).add('bar', {}),
      ];

      let count = 0;

      eco.filter(['foo', 'bar'], (foo, bar, entity) => {
        const expectedEntity = entities[count];

        expect(foo).toBe(expectedEntity.get('foo'));
        expect(bar).toBe(expectedEntity.get('bar'));
        expect(entity.getId()).toBe(expectedEntity.getId());

        count += 1;
      });

      expect(count).toBe(entities.length);
    });

    [undefined, null, true, false, 1, '', {}, function foo() {}].forEach((nonArray) => {
      it('should not call the callback if the first parameter is not an array', () => {
        eco.entity().add('foo');

        eco.filter(nonArray, () => {
          fail('Expected callback to not be called, but it was');
        });
      });
    });

    it('should ignore entities that do not have all the components', () => {
      eco.entity()
        .add('foo', {});

      eco.filter(['foo', 'bar'], () => {
        fail('Iterator callback was not expected to be called');
      });
    });

    it('should ignore entities that have had a required component removed since the last iteration', () => {
      const entity = eco.entity()
        .add('foo', {});

      let firstCount = 0;

      eco.filter(['foo'], () => {
        firstCount += 1;
      });

      expect(firstCount).toBe(1);

      entity.remove('foo');

      eco.filter(['foo'], () => {
        fail('Iterator callback was not expected to be called');
      });
    });

    it('should include entities that have had a component added since the last iteration and now qualify', () => {
      const entity = eco.entity()
        .add('foo');

      eco.filter(['bar'], () => {
        fail('Iterator callback was not expected to be called');
      });

      entity.add('bar');

      let count = 0;

      eco.filter(['bar'], (bar, entityArg) => {
        expect(entityArg.getId()).toBe(entity.getId());
        count += 1;
      });

      expect(count).toBe(1);
    });
  });

  describe('getEntities()', () => {
    it('should return an array of entity proxies that have at least one component', () => {
      const entities = [
        eco.entity().add('foo', {}).add('bar'),
        eco.entity().add('bar', {}),
        eco.entity().add('baz', {}),
      ];

      eco.entity(); // entity with no components

      const result = eco.getEntities();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(entities.length);
      expect(result.map(entity => entity.getId())).toEqual(entities.map(entity => entity.getId()));
    });
  });
});
