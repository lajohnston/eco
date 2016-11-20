import Component from '../../src/Component';

describe('Component', () => {
  describe('get() and set()', () => {
    // let component;

    beforeEach(() => {

    });

    it('should store and retrieve component data ', () => {
      const component = new Component({});

      component.set(1, { foo: 'a' });
      component.set(2, { foo: 'b' });

      expect(component.get(1).foo).toBe('a');
      expect(component.get(2).foo).toBe('b');
    });
  });
});
