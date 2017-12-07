function createEco() {
  const eco = new window.Eco();
  eco.defineComponents(["foo"]);

  return eco;
}

describe("eco.onChange", () => {
  it("should be called when a component is added to an entity", done => {
    const eco = createEco();
    const value = "bar";
    const entity = eco.entity();

    eco.onChange = (entityArg, componentArg, newValueArg, oldValueArg) => {
      expect(entityArg).toBe(entity);
      expect(componentArg).toBe("foo");
      expect(newValueArg).toBe("bar");
      expect(oldValueArg).not.toBeDefined();
      done();
    };

    entity.foo = value;
  });

  it("should be called when a component is removed from an entity", done => {
    const eco = createEco();
    const oldValue = "bar";
    const entity = eco.entity();
    entity.foo = oldValue;

    eco.onChange = (entityArg, componentArg, newValueArg, oldValueArg) => {
      expect(entityArg).toBe(entity);
      expect(componentArg).toBe("foo");
      expect(newValueArg).not.toBeDefined();
      expect(oldValueArg).toBe(oldValue);
      done();
    };

    entity.foo = undefined;
  });
});
