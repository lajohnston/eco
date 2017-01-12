describe('Entities', () => {
  let eco;

  beforeEach(() => {
    eco = new window.Eco();
  });

  it('should allow components to be added to them and provide access to the data', () => {
    eco.addComponent('foo');

    const entityA = eco.entity().add('foo', 'A');
    const entityB = eco.entity().add('foo', 'B');

    expect(entityA.get('foo')).toBe('A');
    expect(entityB.get('foo')).toBe('B');
  });

  it('should do nothing if the component does not exist', () => {
    const entity = eco.entity()
      .add('foo');

    expect(entity.has('foo')).toBe(false);
    expect(entity.get('foo')).not.toBeDefined();
  });

  it('should state whether it has a component or not', () => {
    eco.addComponent('foo');
    eco.addComponent('bar');

    const entity = eco.entity()
      .add('foo');

    expect(entity.has('foo')).toBe(true);
    expect(entity.has('bar')).toBe(false);
  });

  it('should allow removing a component from an entity', () => {
    eco.addComponent('foo');

    const entity = eco.entity()
      .add('foo');

    expect(entity.has('foo')).toBe(true);

    entity.remove('foo');

    expect(entity.has('foo')).toBe(false);
    expect(entity.get('foo')).toBe(undefined);
  });

  it('should allow chaining of add and remove commands', () => {
    eco.addComponent('foo');
    eco.addComponent('bar');
    eco.addComponent('baz');

    const entity = eco.entity()
      .add('foo')
      .remove('foo')
      .add('bar')
      .remove('bar')
      .add('baz');

    expect(entity.has('foo')).toBe(false);
    expect(entity.has('bar')).toBe(false);
    expect(entity.has('baz')).toBe(true);
  });

  it('should receive a unique incrementing id value', () => {
    expect(eco.entity().getId()).toBe('1');
    expect(eco.entity().getId()).toBe('2');
    expect(eco.entity().getId()).toBe('3');
  });
});
