import AbstractEntity from "../../src/abstractEntity";

function mockEco() {
  return jasmine.createSpyObj("eco", [
    "onComponentChanged",
    "onEntityStatusChanged"
  ]);
}

describe("Entity", () => {
  it("should allow components to be set by property", () => {
    const Entity = class extends AbstractEntity {};
    Entity.defineComponent("foo");

    const entity = new Entity(mockEco());
    entity.foo = "bar";
    expect(entity.foo).toBe("bar");
  });

  it("should state whether it has a component", () => {
    const Entity = class extends AbstractEntity {};
    Entity.defineComponent("foo");
    Entity.defineComponent("bar");

    const entity = new Entity(mockEco());
    entity.foo = "foo";

    expect(entity.has("foo")).toBe(true);
    expect(entity.has("bar")).toBe(false);
  });

  it("should be able to remove a component", () => {
    const Entity = class extends AbstractEntity {};
    Entity.defineComponent("foo");

    const entity = new Entity(mockEco());
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

    const entity = new Entity(mockEco());
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

    const entity = new Entity(mockEco());
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

  it("should call eco's onComponentChanged handler when a component is added", () => {
    const Entity = class extends AbstractEntity {};
    Entity.defineComponent("foo");

    const eco = mockEco();
    const entity = new Entity(eco);
    entity.foo = "bar";

    expect(eco.onComponentChanged).toHaveBeenCalledWith(
      entity,
      "foo",
      "bar",
      undefined
    );
  });

  it("should call eco's onComponentChanged handler when a component is removed", () => {
    const Entity = class extends AbstractEntity {};
    Entity.defineComponent("foo");

    const eco = mockEco();
    const entity = new Entity(eco);
    entity.foo = "bar";
    entity.foo = undefined;

    expect(eco.onComponentChanged).toHaveBeenCalledWith(
      entity,
      "foo",
      undefined,
      "bar"
    );
  });

  it("should not call eco's onComponentChanged handler if the entity is disabled", () => {
    const Entity = class extends AbstractEntity {};
    Entity.defineComponent("foo");

    const eco = mockEco();
    const entity = new Entity(eco);
    entity.enabled = false;
    entity.foo = "foo";

    expect(eco.onComponentChanged).not.toHaveBeenCalled();
  });

  it("should inform the eco instance when the entity is disabled", () => {
    const Entity = class extends AbstractEntity {};
    const eco = mockEco(Entity);
    const entity = new Entity(eco);
    entity.enabled = false;

    expect(eco.onEntityStatusChanged).toHaveBeenCalledWith(entity, false);
  });

  it("should inform the eco instance when the entity is enabled", () => {
    const Entity = class extends AbstractEntity {};
    const eco = mockEco(Entity);
    const entity = new Entity(eco);
    entity.enabled = false;
    entity.enabled = true;

    expect(eco.onEntityStatusChanged).toHaveBeenCalledWith(entity, true);
  });

  it("should not reinform the eco instance when the entity is disabled twice", () => {
    const Entity = class extends AbstractEntity {};
    const eco = mockEco(Entity);
    const entity = new Entity(eco);
    entity.enabled = false;
    entity.enabled = false;

    expect(eco.onEntityStatusChanged.calls.count()).toBe(1);
  });

  it("should not reinform the eco instance when the entity is enabled twice", () => {
    const Entity = class extends AbstractEntity {};
    const eco = mockEco(Entity);
    const entity = new Entity(eco);
    entity.enabled = true;

    expect(eco.onEntityStatusChanged.calls.count()).toBe(0);
  });

  it("should state whether it is enabled or not", () => {
    const Entity = class extends AbstractEntity {};
    const eco = mockEco(Entity);
    const entity = new Entity(eco);

    expect(entity.enabled).toBe(true);
    entity.enabled = false;
    expect(entity.enabled).toBe(false);
  });
});
