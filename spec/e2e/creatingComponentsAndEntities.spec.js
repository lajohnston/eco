describe('Adding components and entities', () => {
  let eco;

  beforeEach(() => {
    eco = new window.Eco();
  });

  describe('Adding new components with eco.createComponent()', () => {
    it('should return a component instance that stores data for entities', () => {
      const component = eco.createComponent('foo', {});

      component.set(1, { foo: 'foo1' });
      component.set(2, { foo: 'foo2' });

      expect(component.get(1).foo).toBe('foo1');
      expect(component.get(2).foo).toBe('foo2');
    });
  });

  describe('Redefining existing components with eco.createComponent()', () => {
    let oldComponent;
    let newComponent;
    let entityA;
    let entityB;

    beforeEach(() => {
      oldComponent = eco.createComponent('foo', { componentName: 'oldFoo' });
      entityA = eco.createEntity()
        .add('foo', { entityName: 'entityA' });

      newComponent = eco.createComponent('foo', { componentName: 'newFoo' });

      entityB = eco.createEntity()
        .add('foo', { entityName: 'entityB' });
    });

    it('should not change the original component instance', () => {
      // The old component instance should still contain entityA's data
      expect(oldComponent.get(1).entityName).toBe('entityA');
      expect(oldComponent.get(2)).not.toBeDefined();

      // The new component should only contain entityB's data
      expect(newComponent.get(1)).not.toBeDefined();
      expect(newComponent.get(2).entityName).toBe('entityB');
    });

    it('should ensure existing entities no longer claim to have the component, as the definition has changed', () => {
      expect(entityA.has('foo')).toBe(false);
    });

    it('should use the new definition for new entities', () => {
      expect(entityB.get('foo').componentName).toBe('newFoo');
    });
  });

  describe('Components defined with object-literal default values', () => {
    [undefined, null, false, true, function foo() {}, 1, '', 'foo'].forEach((nonObject) => {
      it('should use the default data if a non-object data is given for a component instance', () => {
        const defaultData = {
          fooValue: 'defaultFooValue',
        };

        eco.createComponent('foo', defaultData);

        const entity = eco.createEntity()
          .add('foo', nonObject);

        expect(entity.get('foo')).not.toBe(defaultData); // it should be a copy
        expect(entity.get('foo').fooValue).toBe('defaultFooValue');
      });
    });

    it('should shallow merge default values into the given data', () => {
      const defaultData = {
        fooValue: 'defaultFooValue',
        barValue: 'defaultBarValue',
      };

      eco.createComponent('foo', defaultData);

      const entity = eco.createEntity()
        .add('foo', {
          barValue: 'newBarValue',
        });

      expect(entity.get('foo').fooValue).toBe('defaultFooValue');
      expect(entity.get('foo').barValue).toBe('newBarValue');
      expect(defaultData.barValue).toBe('defaultBarValue');
    });
  });

  describe('Components defined with a function', () => {
    it('should call the function when creating new instances, and store the result', () => {
      const entityData = {};

      eco.createComponent('foo', (data) => {
        expect(data).toBe(entityData);
        return 'foo';
      });

      const entity = eco.createEntity()
        .add('foo', entityData);

      expect(entity.get('foo')).toBe('foo');
    });
  });

  describe('Components defined by a name only', () => {
    [undefined, null, false, true, function foo() {}, 1, '', 'foo', {}].forEach((value) => {
      it('should store and return any data passed to it', () => {
        eco.createComponent('foo');

        const entity = eco.createEntity()
          .add('foo', value);

        expect(entity.get('foo')).toBe(value);
      });
    });
  });

  describe('Components defined by a primitive value', () => {
    [null, false, true, 1, '', 'foo'].forEach((constantValue) => {
      it('should ignore data passed to it and always return the primitive value', () => {
        eco.createComponent('foo', constantValue);

        const entity = eco.createEntity()
          .add('foo', 'this data should be ignored');

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

  describe("Adding components to entities using the 'with' syntax", () => {
    it('should add the components to the entity');
  });

  describe('Removing components from an entity', () => {
    it('should indicate that the entity no longer has the given component');

    it('should do nothing if the component does not exist');
  });
});
