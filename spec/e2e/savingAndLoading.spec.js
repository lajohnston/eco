describe('Saving and loading', () => {
  let eco;

  beforeEach(() => {
    eco = new window.Eco();

    eco.createComponent('foo');
    eco.createComponent('bar');
  });

  describe('eco.getDataByEntity()', () => {
    it('should return entity data indexed by entity id and component name', () => {
      eco.createEntity()
        .add('foo', 'foo1')
        .add('bar', 'bar1');

      eco.createEntity()
        .add('foo', 'foo2');

      expect(eco.getDataByEntity()).toEqual({
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

  describe('eco.setDataByEntity()', () => {
    let data;

    beforeEach(() => {
      data = {
        1: {
          foo: {},
          bar: {},
        },
        2: {
          bar: {},
        },
      };
    });

    it(
      `should set the entity and component data from data indexed by
      entity id and component name`,
      () => {
        eco.setDataByEntity(data);

        const entity1 = eco.getEntity(1);
        expect(entity1.get('foo')).toBe(data[1].foo);
        expect(entity1.get('bar')).toBe(data[1].bar);

        const entity2 = eco.getEntity(2);
        expect(entity2.get('foo')).not.toBeDefined();
        expect(entity2.get('bar')).toBe(data[2].bar);
      }
    );

    it(
      `should ensure new entities created are assigned ids higher than
      the loaded entity with the highest id`,
      () => {
        eco.setDataByEntity(data);

        const newEntity = eco.createEntity();
        expect(newEntity.getId()).toBe('3');
      }
    );
  });
});
