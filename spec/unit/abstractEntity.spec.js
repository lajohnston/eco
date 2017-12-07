import AbstractEntity from "../../src/abstractEntity";

describe("Entity", () => {
  it("should allow components to be set by property", () => {
    const Entity = class extends AbstractEntity {};
    Entity.defineComponent("foo");

    const entity = new Entity();
    entity.foo = "bar";
    expect(entity.foo).toBe("bar");
  });

  it("should state whether it has a component", () => {
    const Entity = class extends AbstractEntity {};
    Entity.defineComponent("foo");
    Entity.defineComponent("bar");

    const entity = new Entity();
    entity.foo = "foo";

    expect(entity.has("foo")).toBe(true);
    expect(entity.has("bar")).toBe(false);
  });

  it("should be able to remove a component", () => {
    const Entity = class extends AbstractEntity {};
    Entity.defineComponent("foo");

    const entity = new Entity();
    entity.foo = "foo";
    entity.foo = undefined;
    expect(entity.has("foo")).toBe(false);
    expect(entity.foo).not.toBeDefined();
  });

  it("should be able to remove all its components", () => {
    const Entity = class extends AbstractEntity {};
    Entity.defineComponent("foo");
    Entity.defineComponent("bar");
    Entity.defineComponent("baz");

    const entity = new Entity();
    entity.foo = "foo";
    entity.bar = "bar";
    entity.baz = "baz";

    const result = entity.removeAll();
    expect(result).toBe(entity);

    expect(entity.has("foo")).toBe(false);
    expect(entity.has("bar")).toBe(false);
    expect(entity.has("baz")).toBe(false);
  });

  it("should return an object of its components", () => {
    const Entity = class extends AbstractEntity {};
    Entity.defineComponent("foo");
    Entity.defineComponent("bar");

    const entity = new Entity();
    entity.foo = "foo";
    entity.bar = "bar";

    const components = entity.getComponents();
    expect(components).toEqual({
      foo: "foo",
      bar: "bar"
    });

    // Changing the returned list shouldn't affect the entity
    components.foo = undefined;
    expect(entity.foo).toBe("foo");
  });

  it("should call the emit callback when a component is added", done => {
    let entity;
    const Entity = class extends AbstractEntity {
      static emit(entityArg, componentName, newValue, oldValue) {
        expect(entityArg).toBe(entity);
        expect(componentName).toBe("foo");
        expect(newValue).toBe("bar");
        expect(oldValue).not.toBeDefined();
        done();
      }
    };

    Entity.defineComponent("foo");

    entity = new Entity();
    entity.foo = "bar";
  });

  it("should call the emit callback when a component is removed", done => {
    let entity;

    const Entity = class extends AbstractEntity {
      static emit(entityArg, componentName, newValue, oldValue) {
        if (newValue === "bar") return; // when component is added

        expect(entityArg).toBe(entity);
        expect(componentName).toBe("foo");
        expect(newValue).not.toBeDefined();
        expect(oldValue).toBe("bar");
        done();
      }
    };

    Entity.defineComponent("foo");

    entity = new Entity();
    entity.foo = "bar";
    entity.foo = undefined;
  });
});
