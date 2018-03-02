const Eco = window.Eco;

describe("Entities", () => {
  it("should hold component data", () => {
    const eco = Eco.create(["foo", "bar"]);

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
    const eco = Eco.create(["foo", "bar"]);

    const entity = eco.entity();
    entity.foo = "foo";

    expect(entity.has("foo")).toBe(true);
    expect(entity.has("bar")).toBe(false);
  });

  it("should allow the removal of all its components", () => {
    const eco = Eco.create(["foo", "bar"]);

    const entity = eco.entity();
    entity.foo = "foo";
    entity.bar = "bar";

    entity.removeAll();
    expect(entity.has("foo")).toBe(false);
    expect(entity.has("bar")).toBe(false);
  });

  it("should return an object of its components", () => {
    const eco = Eco.create(["foo", "bar"]);

    const entity = eco.entity();
    entity.foo = "foo";
    entity.bar = "bar";

    const result = entity.getComponents();

    expect(result).toEqual({
      foo: "foo",
      bar: "bar"
    });
  });

  it("should provide an array of all entities", () => {
    const eco = Eco.create();
    const entities = [eco.entity(), eco.entity(), eco.entity()];
    const result = eco.all;

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(entities.length);
    expect(result).toEqual(entities);
  });

  it("should allow entities to be extended", () => {
    const customEco = Eco.container();
    customEco.Entity = class extends customEco.Entity {
      getFoo() {
        return this.foo;
      }
    };

    const eco = customEco.create();
    const entity = eco.entity();
    entity.foo = "bar";
    expect(entity.getFoo()).toBe("bar");
  });
});
