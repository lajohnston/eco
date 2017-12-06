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

  it("should be able to remove all its components", () => {
    const Entity = class extends AbstractEntity {
      static createComponent(name) {
        return name;
      }
    };

    Entity.defineComponent("foo");
    Entity.defineComponent("bar");
    Entity.defineComponent("baz");

    const entity = new Entity()
      .add("foo")
      .add("bar")
      .add("baz");

    entity.removeAll();

    expect(entity.has("foo")).toBe(false);
    expect(entity.has("bar")).toBe(false);
    expect(entity.has("baz")).toBe(false);
  });

  it("should return an object of its components", () => {
    const Entity = class extends AbstractEntity {
      static createComponent(name) {
        return name;
      }
    };

    Entity.defineComponent("foo");
    Entity.defineComponent("bar");
    Entity.defineComponent("baz");

    const entity = new Entity()
      .add("foo")
      .add("bar")
      .add("baz");

    const components = entity.getComponents();
    expect(components).toEqual({
      foo: "foo",
      bar: "bar",
      baz: "baz"
    });

    components.foo = undefined;
    expect(entity.foo).toBe("foo");
  });

  it("should call the emit callback when a component is added", done => {
    let entity;

    const Entity = class extends AbstractEntity {
      static createComponent(name, arg1) {
        return arg1;
      }

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
    entity.add("foo", "bar");
  });

  it("should call the emit callback when a component is removed", done => {
    let entity;

    const Entity = class extends AbstractEntity {
      static createComponent(name, arg1) {
        return arg1;
      }

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
    entity.add("foo", "bar").remove("foo");
  });
});
