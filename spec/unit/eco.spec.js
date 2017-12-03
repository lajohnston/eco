import Eco from "../../src/eco";

function mockEntityPrototype() {
  return jasmine.createSpyObj("Entity", ["defineComponent"]);
}

describe("Eco", () => {
  it("should return entity instances", () => {
    const Entity = function() {};
    const eco = new Eco(Entity);

    const instance = eco.entity();
    expect(instance instanceof Entity).toBeTruthy();
  });

  it("should inform the entity prototype to set up component accessors", () => {
    const Entity = mockEntityPrototype();
    const eco = new Eco(Entity);

    eco.component("foo");
    expect(Entity.defineComponent).toHaveBeenCalledWith("foo");
  });

  it("should store component factories", () => {
    const Entity = mockEntityPrototype();
    const eco = new Eco(Entity);
    eco.component("foo", x => x);
    expect(eco.createComponent("foo", "bar")).toBe("bar");
  });

  it("should return undefined if a component factory does not exist", () => {
    const Entity = mockEntityPrototype();
    const eco = new Eco(Entity);
    expect(eco.createComponent("foo")).not.toBeDefined();
  });
});
