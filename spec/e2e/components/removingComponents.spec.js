describe('Removing components', () => {
  let eco;

  beforeEach(() => {
    eco = new window.Eco();
  });

  it('should do nothing if the component does not exist', () => {
    eco.removeComponent('foo');
  });

  it('should remove the data from the entities', () => {
    eco.addComponent('foo');
    const entity = eco.entity().add('foo');
    expect(entity.has('foo')).toBe(true);

    eco.removeComponent('foo');
    expect(entity.has('foo')).toBe(false);
    expect(entity.get('foo')).toBe(undefined);
  });
});
