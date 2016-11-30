describe('Iterating over entities', () => {
  let eco;

  beforeEach(() => {
    eco = new window.Eco();

    eco.createComponent('foo');
    eco.createComponent('bar');
  });

  it('should iterate over all entities that have the given components, and pass the components data', () => {
    const matching = [
      eco.createEntity().add('foo', {}).add('bar', {}),
      eco.createEntity().add('foo', {}).add('bar', {}),
    ];

    let count = 0;
    const iter = eco.createIterator(['foo', 'bar']);

    iter.each((foo, bar, entity) => {
      count += 1;
      const expectedEntity = matching[count - 1];

      expect(entity.getId()).toBe(expectedEntity.getId());
      expect(foo).toBe(expectedEntity.get('foo'));
      expect(bar).toBe(expectedEntity.get('bar'));
    });

    expect(count).toBe(2);
  });

  it('should ignore entities that do not have all the components');

  it('should ignore entities that have had a required component removed since the last iteration');

  it('should include entities that have had component added since the last iteration and now qualify');
});
