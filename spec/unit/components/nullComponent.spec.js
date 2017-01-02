import NullComponent from '../../../src/components/NullComponent';

describe('NullComponent', () => {
  let nullComponent;

  beforeEach(() => {
    nullComponent = new NullComponent();
  });

  it('should always return undefined when retrieving objects', () => {
    nullComponent.set(1, {});
    expect(nullComponent.get(1)).not.toBeDefined();
  });

  it('should always return false when stating what objects it is', () => {
    nullComponent.set(1, {});
    expect(nullComponent.has(1)).toBe(false);
  });

  it('should define a remove function', () => {
    nullComponent.remove(1);
  });
});
