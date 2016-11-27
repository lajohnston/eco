import Component from '../../../src/components/Component';

describe('Component', () => {
  describe('get() and set() with an object literal component definition', () => {
    it('should store and retrieve component data', () => {
      const component = new Component({});

      component.set(1, { foo: 'a' });
      component.set(2, { foo: 'b' });

      expect(component.get(1).foo).toBe('a');
      expect(component.get(2).foo).toBe('b');
    });

    it('should merge the data with the default object literal', () => {
      const component = new Component({
        fooValue: 'defaultFooValue',
        barValue: 'defaultBarValue',
      });

      component.set(1, {
        barValue: 'newBarValue',
      });

      const result = component.get(1);

      expect(result).toEqual({
        fooValue: 'defaultFooValue',
        barValue: 'newBarValue',
      });
    });

    [undefined, null, false, true, function foo() {}, 1, '', 'foo'].forEach((nonObject) => {
      it('should create a copy of the default object if a non-object is provided for an instance', () => {
        const defaultData = { foo: 'bar' };
        const component = new Component(defaultData);

        component.set(1, nonObject);

        const result = component.get(1);

        expect(result).toEqual(defaultData);
        expect(result).not.toBe(defaultData);
      });
    });
  });

  describe('get() and set() with a factory/function component definition', () => {
    it('should call the factory when creating the object', () => {
      const componentData = {};

      const component = new Component((data) => {
        expect(data).toBe(componentData);
        return 'foo';
      });

      component.set(1, componentData);
      expect(component.get(1)).toBe('foo');
    });
  });

  describe('has()', () => {
    it('should return true if the component contains data for the entity', () => {
      const component = new Component({});
      component.set(1, {});
      expect(component.has(1)).toBe(true);
    });

    it('should return false if the component does not contain data for the entity', () => {
      const component = new Component({});
      expect(component.has(1)).toBe(false);
    });
  });
});
