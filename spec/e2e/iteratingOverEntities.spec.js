describe('Iterating over entities', () => {
  let eco;

  beforeEach(() => {
    eco = new window.Eco();

    eco.createComponent('foo');
    eco.createComponent('bar');
  });

  it('should call the callback with the component data for each entity that has all the given components', () => {
    // Create entities with foo and bar components
    const matching = [
      eco.createEntity().add('foo', {}).add('bar', {}),
      eco.createEntity().add('foo', {}).add('bar', {}),
    ];

    let count = 0;
    const iter = eco.createIterator(['foo', 'bar']);

    iter.each((foo, bar, entity) => {
      const expectedEntity = matching[count];

      expect(entity.getId()).toBe(expectedEntity.getId());
      expect(foo).toBe(expectedEntity.get('foo'));
      expect(bar).toBe(expectedEntity.get('bar'));

      count += 1;
    });

    expect(count).toBe(2);
  });

  it('should ignore entities that do not have all the components');

  it('should ignore entities that have had a required component removed since the last iteration');

  it('should include entities that have had a component added since the last iteration and now qualify');
});
