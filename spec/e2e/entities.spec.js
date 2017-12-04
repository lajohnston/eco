const Eco = window.Eco;

describe("Entities", () => {
  it("should hold component data", () => {
    const eco = new Eco();
    eco.component("foo", x => x);
    eco.component("bar", x => x);

    const entityA = eco
      .entity()
      .add("foo", "fooA")
      .add("bar", "barA");

    const entityB = eco
      .entity()
      .add("foo", "fooB")
      .add("bar", "barB");

    expect(entityA.foo).toBe("fooA");
    expect(entityA.bar).toBe("barA");

    expect(entityB.foo).toBe("fooB");
    expect(entityB.bar).toBe("barB");
  });

  it("should state whether they have a component or not", () => {
    const eco = new Eco();
    eco.component("foo", () => "foo");
    eco.component("bar", () => "bar");

    const entity = eco.entity().add("foo");

    expect(entity.has("foo")).toBe(true);
    expect(entity.has("bar")).toBe(false);
  });

  it("should allow their components to be removed", () => {
    const eco = new Eco();
    eco.component("foo", () => "foo");

    const entity = eco.entity().add("foo");

    expect(entity.has("foo")).toBe(true);
    entity.remove("foo");

    expect(entity.has("foo")).toBe(false);
    expect(entity.foo).not.toBeDefined();
  });

  it("should allow chaining of add and remove commands", () => {
    const eco = new Eco();
    eco.component("foo", () => ({}));
    eco.component("bar", () => ({}));
    eco.component("baz", () => ({}));

    const entity = eco
      .entity()
      .add("foo")
      .remove("foo")
      .add("bar")
      .remove("bar")
      .add("baz");

    expect(entity.has("foo")).toBe(false);
    expect(entity.has("bar")).toBe(false);
    expect(entity.has("baz")).toBe(true);
  });

  it("should allow the removal of all its components", () => {
    const eco = new Eco();
    eco.component("foo", () => ({}));
    eco.component("bar", () => ({}));

    const entity = eco
      .entity()
      .add("foo")
      .add("bar");

    entity.removeAll();

    expect(entity.has("foo")).toBe(false);
    expect(entity.has("bar")).toBe(false);
  });

  it("should return an object of its components", () => {
    const eco = new Eco();
    eco.component("foo", () => ({}));
    eco.component("bar", () => ({}));

    const entity = eco
      .entity()
      .add("foo", {})
      .add("bar", {});

    const result = entity.getComponents();

    expect(result.foo).toBe(entity.foo);
    expect(result.bar).toBe(entity.bar);
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
