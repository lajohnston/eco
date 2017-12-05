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

  it("should return an array of all its entities", () => {
    const Entity = function() {};
    const eco = new Eco(Entity);

    const entityA = eco.entity();
    const entityB = eco.entity();

    expect(eco.entities).toEqual([entityA, entityB]);
  });

  it("should create and return filter instances", () => {
    const Entity = function() {};
    const createFilter = jasmine.createSpy("createFilter");
    const eco = new Eco(Entity, createFilter);

    const filter = {};
    const componentArray = ["foo", "bar"];
    createFilter.and.returnValue(filter);

    expect(eco.createFilter(componentArray)).toBe(filter);
    expect(createFilter).toHaveBeenCalledWith(eco.entities, componentArray);
  });

  it("should return system function that utilise filters", () => {
    const Entity = function() {};
    const filter = jasmine.createSpyObj("filter", ["forEach"]);
    const createFilter = jasmine
      .createSpy("createFilter")
      .and.returnValue(filter);

    const eco = new Eco(Entity, createFilter);

    const componentArray = ["foo", "bar"];
    const callback = jasmine.createSpy();
    const system = eco.system(componentArray, callback);

    const entities = [{}, {}];
    filter.forEach.and.callFake(cb => entities.forEach(cb));
    system("baz");

    expect(createFilter).toHaveBeenCalledWith(eco.entities, componentArray);
    expect(callback).toHaveBeenCalledWith(entities[0], "baz");
    expect(callback).toHaveBeenCalledWith(entities[1], "baz");
  });

  it("should pass additional arguments to the system callback", done => {
    const Entity = function() {};
    const filter = jasmine.createSpyObj("filter", ["forEach"]);
    const createFilter = jasmine
      .createSpy("createFilter")
      .and.returnValue(filter);

    const eco = new Eco(Entity, createFilter);

    const entity = {};
    filter.forEach.and.callFake(cb => cb(entity));

    const system = eco.system(["foo"], (entityArg, arg2, arg3) => {
      expect(entityArg).toBe(entity);
      expect(arg2).toBe("bar");
      expect(arg3).toBe("baz");
      done();
    });

    system("bar", "baz");
  });
});
