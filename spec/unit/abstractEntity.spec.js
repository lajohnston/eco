import AbstractEntity from "../../src/abstractEntity";

describe("AbstractEntity", () => {
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
});
