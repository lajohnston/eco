import AbstractEntity from "../../src/abstractEntity";

describe("Entity", () => {
  it("should return itself when adding components", () => {
    const entity = new AbstractEntity();
    expect(entity.add("foo")).toBe(entity);
  });

  it("should store components accessible with a property", () => {
    const Entity = class extends AbstractEntity {
      static createComponent(name, ...args) {
        if (name === "foo") return [...args];
      }
    };

    Entity.defineComponent("foo");

    const entity = new Entity();
    entity.add("foo", "bar", "baz");

    expect(entity.foo).toEqual(["bar", "baz"]);
  });

  it("should allow components to be set by property", () => {
    const Entity = class extends AbstractEntity {};
    Entity.defineComponent("foo");

    const entity = new Entity();
    entity.foo = "bar";
    expect(entity.foo).toBe("bar");
  });

  it("should state whether it has a component", () => {
    const Entity = class extends AbstractEntity {
      static createComponent() {
        return "bar";
      }
    };

    Entity.defineComponent("foo");

    const entityA = new Entity().add("foo");
    const entityB = new Entity();

    expect(entityA.has("foo")).toBe(true);
    expect(entityB.has("foo")).toBe(false);
  });

  it("should be able to remove a component", () => {
    const Entity = class extends AbstractEntity {
      static createComponent() {
        return "bar";
      }
    };

    Entity.defineComponent("foo");

    const entity = new Entity();
    entity.add("foo");
    entity.remove("foo");
    expect(entity.has("foo")).toBe(false);
    expect(entity.foo).not.toBeDefined();
  });

  it("should return itself after removing a component", () => {
    const entity = new AbstractEntity();
    expect(entity.remove("foo")).toBe(entity);
  });
});
