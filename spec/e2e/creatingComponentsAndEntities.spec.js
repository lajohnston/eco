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

    describe('Replacing components', () => {
      let oldComponent;
      let newComponent;
      let entityA;
      let entityB;

      beforeEach(() => {
        oldComponent = ecos.addComponent('foo', { componentName: 'oldFoo' });
        entityA = ecos.createEntity()
          .add('foo', { entityName: 'entityA' });

        newComponent = ecos.addComponent('foo', { componentName: 'newFoo' });

        entityB = ecos.createEntity()
          .add('foo', { entityName: 'entityB' });
      });

      it('should not change the original component', () => {
        // The old component instance should still contain entityA's data
        expect(oldComponent.get(1).entityName).toBe('entityA');
        expect(oldComponent.get(2)).not.toBeDefined();

        // The new component should only contain entityB's data
        expect(newComponent.get(1)).not.toBeDefined();
        expect(newComponent.get(2).entityName).toBe('entityB');
      });

      it('should ensure existing entities no longer have the component, as the definition has changed', () => {
        expect(entityA.has('foo')).toBe(false);
      });

      it('should use the new definition for new entities', () => {
        expect(entityB.get('foo').componentName).toBe('newFoo');
      });
    });
  });

  describe('Adding object literals as component definitions', () => {
    [undefined, null, false, true, function foo() {}, 1, '', 'foo'].forEach((nonObject) => {
      it('should use the default value if non-object data is passed for a component instance', () => {
        const defaultData = {
          fooValue: 'defaultFooValue',
        };

        ecos.addComponent('foo', defaultData);

        const entity = ecos.createEntity()
          .add('foo', nonObject);

        expect(entity.get('foo')).not.toBe(defaultData); // it should be a copy
        expect(entity.get('foo').fooValue).toBe('defaultFooValue');
      });
    });

    it('should shallow merge default values using the object definition', () => {
      const defaultData = {
        fooValue: 'defaultFooValue',
        barValue: 'defaultBarValue',
      };

      ecos.addComponent('foo', defaultData);

      const entity = ecos.createEntity()
        .add('foo', {
          barValue: 'newBarValue',
        });

      expect(entity.get('foo').fooValue).toBe('defaultFooValue');
      expect(entity.get('foo').barValue).toBe('newBarValue');
      expect(defaultData.barValue).toBe('defaultBarValue');
    });
  });

  describe('Adding functions as component definitions', () => {
    it('should call the function when creating new instances, and store the result');
  });
});
