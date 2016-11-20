import Component from '../../src/components/Component';

describe('Component', () => {
  describe('get() and set()', () => {
    it('should store and retrieve component data ', () => {
      const component = new Component({});

      component.set(1, { foo: 'a' });
      component.set(2, { foo: 'b' });

      expect(component.get(1).foo).toBe('a');
      expect(component.get(2).foo).toBe('b');
    });

    it('should merge the data with the default object literal, if one was provided', () => {
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
  });
});
