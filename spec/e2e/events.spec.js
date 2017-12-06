function createEco() {
  const eco = new window.Eco();
  eco.component("foo", x => x);

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

    entity.add("foo", value);
  });

  it("should be called when a component is removed from an entity", done => {
    const eco = createEco();
    const value = "bar";
    const entity = eco.entity().add("foo", value);

    eco.onChange = (entityArg, componentArg, newValueArg, oldValueArg) => {
      expect(entityArg).toBe(entity);
      expect(componentArg).toBe("foo");
      expect(newValueArg).not.toBeDefined();
      expect(oldValueArg).toBe("bar");
      done();
    };

    entity.remove("foo");
  });

  it("should be called when a component is set using a component accessor", done => {
    const eco = createEco();
    const entity = eco.entity();
    entity.foo = "originalValue";

    eco.onChange = (entityArg, componentArg, newValueArg, oldValueArg) => {
      expect(entityArg).toBe(entity);
      expect(componentArg).toBe("foo");
      expect(newValueArg).toBe("newValue");
      expect(oldValueArg).toBe("originalValue");
      done();
    };

    entity.foo = "newValue";
  });
});
