describe("Eco", () => {
  it("should expose an Eco variable with a create function", () => {
    const Eco = window.Eco;

    expect(Eco).toBeDefined();
    expect(Eco.create).toBeDefined();
  });

  it("should expose an Eco variable with a container function", () => {
    const Eco = window.Eco;

    expect(Eco).toBeDefined();
    expect(Eco.container).toBeDefined();
  });
});
