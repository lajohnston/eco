const Eco = window.Eco;

describe("Entities", () => {
  it("should hold component data", () => {
    const eco = new Eco();
    eco.defineComponents(["foo", "bar"]);

    const entityA = eco.entity();
    entityA.foo = "fooA";
    entityA.bar = "barA";

    const entityB = eco.entity();
    entityB.foo = "fooB";
    entityB.bar = "barB";

    expect(entityA.foo).toBe("fooA");
    expect(entityA.bar).toBe("barA");

    expect(entityB.foo).toBe("fooB");
    expect(entityB.bar).toBe("barB");
  });

  it("should state whether they have a component or not", () => {
    const eco = new Eco();
    eco.defineComponents(["foo", "bar"]);

    const entity = eco.entity();
    entity.foo = "foo";

    expect(entity.has("foo")).toBe(true);
    expect(entity.has("bar")).toBe(false);
  });

  it("should allow the removal of all its components", () => {
    const eco = new Eco();
    eco.defineComponents(["foo", "bar"]);

    const entity = eco.entity();
    entity.foo = "foo";
    entity.bar = "bar";

    entity.removeAll();
    expect(entity.has("foo")).toBe(false);
    expect(entity.has("bar")).toBe(false);
  });

  it("should return an object of its components", () => {
    const eco = new Eco();
    eco.defineComponents(["foo", "bar"]);

    const entity = eco.entity();
    entity.foo = "foo";
    entity.bar = "bar";

    const result = entity.getComponents();

    expect(result).toEqual({
      foo: "foo",
      bar: "bar"
    });
  });

  describe("eco.entities", () => {
    it("should provide an array of all entities", () => {
      const eco = new Eco();
      const entities = [eco.entity(), eco.entity(), eco.entity()];
      const result = eco.entities;

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(entities.length);
      expect(result).toEqual(entities);
    });
  });
});
