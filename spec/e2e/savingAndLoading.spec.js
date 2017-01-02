describe('Saving and loading', () => {
  let eco;

  beforeEach(() => {
    eco = new window.Eco();

    eco.createComponent('foo');
    eco.createComponent('bar');
  });

  describe('getDataByEntity()', () => {
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

  describe('setEntityData()', () => {
    it(
      'should set the entity and component data from data indexed by ' +
      'entity id and component name'
    );

    it(
      'should ensure new entities created are assigned ids higher than ' +
      'the loaded entity with the highest id'
    );
  });
});
