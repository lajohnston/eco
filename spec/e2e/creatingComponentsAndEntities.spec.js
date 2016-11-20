describe('Adding components', () => {
  let ecos;

  beforeEach(() => {
    ecos = new window.Ecos();
  });

  describe('Adding object literals as component definitions', () => {
    it('should merge in default values using the object definition', () => {
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

    it('should merge in nested values using the object definition');

    it('should include functions and nested functions from the object definition');
  });

  it('should return false without side effects if the component is already defined');

  it('should accept functions as component constructors');

  it('should throw an error if the component is not an object or a function');

  it('should throw an error if the component is already defined');

  it('should throw an error if an entity defines an component');
});

