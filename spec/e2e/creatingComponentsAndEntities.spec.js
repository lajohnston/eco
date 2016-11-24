describe('Adding components', () => {
  let ecos;

  beforeEach(() => {
    ecos = new window.Ecos();
  });

  describe('ecos.addComponent()', () => {
    it('should return a component instance that stores data for entities', () => {
      const component = ecos.addComponent('foo', {});

      component.set(1, { foo: 'foo1' });
      component.set(2, { foo: 'foo2' });

      expect(component.get(1).foo).toBe('foo1');
      expect(component.get(2).foo).toBe('foo2');
    });

    it('should allow components to be replaced, but not affect the existing component');
  });

  describe('Adding undefined objects as component definitions', () => {
    it('should return boolean true when retrieving data for entities that have this component');

    it('should return undefined when retrieving data for entities tha do not have this component');
  });

  describe('Adding object literals as component definitions', () => {
    it('should shallow merge in default values using the object definition', () => {
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
  });

  describe('Adding functions as component definitions', () => {
    it('should call the function when creating new instances, and store the result');
  });
});
