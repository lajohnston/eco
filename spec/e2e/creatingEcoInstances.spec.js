describe("Eco", () => {
  it("should expose an Eco variable on the global window object", () => {
    const Eco = window.Eco;

    expect(Eco).toBeDefined();
    expect(new Eco()).toBeDefined();
  });
});
