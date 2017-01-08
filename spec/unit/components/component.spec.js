import Component from '../../../src/components/Component';
import Collection from '../../../src/components/Collection';

describe('Component', () => {
  it('should inherit from Collection', () => {
    expect(new Component() instanceof Collection).toBe(true);
  });

  describe('set() with an object literal component definition', () => {
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

  describe('set() with undefined component definition', () => {
    [undefined, null, false, true, function foo() {}, 1, '', 'foo', {}].forEach((value) => {
      it('should store and return any non-object values passed to it', () => {
        const component = new Component();
        component.set(1, value);

        const result = component.get(1);

        expect(result).toBe(value);
      });
    });
  });

  describe('set() with a factory/function component definition', () => {
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

  describe('set() when a primitive value has been passed to the constructor', () => {
    [null, false, true, 1, '', 'foo'].forEach((constantValue) => {
      it('should ignore the value store the definition value as a constant', () => {
        const component = new Component(constantValue);

        component.set(1, 'foo');  // it should ignore this value
        expect(component.get(1)).toBe(constantValue);
      });
    });
  });

  describe('getEntityIds()', () => {
    it('should return the ids of the entities that have this component', () => {
      const component = new Component();

      component.set(1);
      component.set(2);
      component.set(3);

      expect(component.getEntityIds()).toEqual(['1', '2', '3']);
    });
  });

  describe('remove()', () => {
    it('should remove the component data for the given entity id', () => {
      const component = new Component();
      component.set(1, {});
      component.set(2, {});

      expect(component.has(1)).toBe(true);

      component.remove(1);

      expect(component.has(1)).toBe(false);
      expect(component.get(1)).not.toBeDefined();
      expect(component.getEntityIds()).toEqual(['2']);
    });
  });
});
