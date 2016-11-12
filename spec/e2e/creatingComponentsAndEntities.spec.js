describe('Adding components', () => {
  let ecos;

  beforeEach(() => {
    ecos = new window.Ecos();
  });

  it('should accept object literals as components and use them to populate default values', () => {
    ecos.addComponent('foo', {
      fooValue: 'defaultFooValue',
      barValue: 'defaultBarValue',
    });

    const entity = ecos.createEntity({
      foo: {
        barValue: 'newBarValue',
      },
    });

    expect(entity.get('foo').fooValue).toBe('defaultFooValue');
    expect(entity.get('foo').barValue).toBe('newBarValue');
  });

  it('should accept functions as component constructors');

  it('should throw an error if the component is not an object or a function');

  it('should throw an error if the component is already defined');

  it('should throw an error if an entity defines an component');
});
