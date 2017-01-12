describe('Adding components', () => {
  let eco;

  beforeEach(() => {
    eco = new window.Eco();
  });

  describe('with an object-literal template', () => {
    it('should shallow merge instance data passed to it', () => {
      const defaultData = {
        fooValue: 'defaultFooValue',
        barValue: 'defaultBarValue',
      };

      eco.addComponent('foo', defaultData);

      const entity = eco.entity()
        .add('foo', {
          barValue: 'newBarValue',
        });

      expect(entity.get('foo').fooValue).toBe('defaultFooValue');
      expect(entity.get('foo').barValue).toBe('newBarValue');
      expect(defaultData.barValue).toBe('defaultBarValue');
    });

    [undefined, null, false, true, function foo() {}, 1, '', 'foo'].forEach((nonObject) => {
      it('should use the default data if a non-object data is given for a component instance', () => {
        const defaultData = {
          fooValue: 'defaultFooValue',
        };

        eco.addComponent('foo', defaultData);

        const entity = eco.entity()
          .add('foo', nonObject);

        expect(entity.get('foo')).not.toBe(defaultData); // it should be a copy
        expect(entity.get('foo').fooValue).toBe('defaultFooValue');
      });
    });
  });

  describe('with a factory function', () => {
    it('should call the function when creating new instances, and store the result', () => {
      const entityData = {};

      eco.addComponent('foo', (data) => {
        expect(data).toBe(entityData);
        return 'foo';
      });

      const entity = eco.entity()
        .add('foo', entityData);

      expect(entity.get('foo')).toBe('foo');
    });
  });

  describe('with a name only', () => {
    [undefined, null, false, true, function foo() {}, 1, '', 'foo', {}].forEach((value) => {
      it('should store and return any data passed to it', () => {
        eco.addComponent('foo');

        const entity = eco.entity()
          .add('foo', value);

        expect(entity.get('foo')).toBe(value);
      });
    });
  });

  describe('with a primitive value', () => {
    [null, false, true, 1, '', 'foo'].forEach((constantValue) => {
      it('should ignore data passed to it and always return the primitive value', () => {
        eco.addComponent('foo', constantValue);

        const entity = eco.entity()
          .add('foo', 'this data should be ignored');

        expect(entity.get('foo')).toBe(constantValue);
      });
    });
  });
});
