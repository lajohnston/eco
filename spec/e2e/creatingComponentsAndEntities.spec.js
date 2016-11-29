describe('Adding components', () => {
  let eco;

  beforeEach(() => {
    eco = new window.Eco();
  });

  describe('eco.addComponent()', () => {
    it('should return a component instance that stores data for entities', () => {
      const component = eco.addComponent('foo', {});

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
        oldComponent = eco.addComponent('foo', { componentName: 'oldFoo' });
        entityA = eco.createEntity()
          .add('foo', { entityName: 'entityA' });

        newComponent = eco.addComponent('foo', { componentName: 'newFoo' });

        entityB = eco.createEntity()
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

        eco.addComponent('foo', defaultData);

        const entity = eco.createEntity()
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

      eco.addComponent('foo', defaultData);

      const entity = eco.createEntity()
        .add('foo', {
          barValue: 'newBarValue',
        });

      expect(entity.get('foo').fooValue).toBe('defaultFooValue');
      expect(entity.get('foo').barValue).toBe('newBarValue');
      expect(defaultData.barValue).toBe('defaultBarValue');
    });
  });

  describe('Adding functions as component definitions', () => {
    it('should call the function when creating new instances, and store the result', () => {
      const entityData = {};

      eco.addComponent('foo', (data) => {
        expect(data).toBe(entityData);
        return 'foo';
      });

      const entity = eco.createEntity()
        .add('foo', entityData);

      expect(entity.get('foo')).toBe('foo');
    });
  });

  describe('Not passing any value as the component definition', () => {
    [undefined, null, false, true, function foo() {}, 1, '', 'foo', {}].forEach((value) => {
      it('should store and return any data passed to it', () => {
        eco.addComponent('foo');

        const entity = eco.createEntity()
          .add('foo', value);

        expect(entity.get('foo')).toBe(value);
      });
    });
  });

  describe('Passing a non-object or function as the component definition', () => {
    [null, false, true, 1, '', 'foo'].forEach((constantValue) => {
      it('should treat the definition as a constant and always return this value', () => {
        eco.addComponent('foo', constantValue);

        const entity = eco.createEntity()
          .add('foo', 'data that will be ignored');

        expect(entity.get('foo')).toBe(constantValue);
      });
    });
  });

  describe('Adding a non-existant component to an object', () => {
    it('should act as if the component was not added', () => {
      const entity = eco.createEntity()
        .add('nonExistantComponentA')
        .add('nonExistantComponentB');

      expect(entity.has('nonExistantComponentA')).toBe(false);
      expect(entity.has('nonExistantComponentB')).toBe(false);

      expect(entity.get('nonExistantComponentA')).not.toBeDefined();
      expect(entity.get('nonExistantComponentB')).not.toBeDefined();
    });
  });
});
