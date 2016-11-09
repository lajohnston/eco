import ComponentCollection from '../../src/componentCollection';

describe('ComponentCollection', () => {
  it('should define a constructor', () => {
    expect(ComponentCollection).toBeDefined();
    expect(new ComponentCollection()).toBeDefined();
  });
});
