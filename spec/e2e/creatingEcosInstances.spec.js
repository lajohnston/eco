describe('Ecos', () => {
  it('should expose an Ecos variable on the global window object', () => {
    const Ecos = window.Ecos;

    expect(Ecos).toBeDefined();
    expect(new Ecos()).toBeDefined();
  });
});
