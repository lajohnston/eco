describe('Saving and loading', () => {
  describe('getEntityData()', () => {
    it('should return entity data indexed by entity id and component name');
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
