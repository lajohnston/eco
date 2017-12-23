import Eco from "../../src/eco";

function mockEntityPrototype() {
  return jasmine.createSpyObj("Entity", ["defineComponent"]);
}

function mockEntityCollection() {
  return jasmine.createSpyObj("entityCollection", [
    "add",
    "remove",
    "incVersion"
  ]);
}

describe("Eco", () => {
  it("should return entity instances", () => {
    const Entity = function() {};
    const entityCollection = mockEntityCollection();
    const eco = new Eco(Entity, entityCollection);

    const instance = eco.entity();
    expect(instance instanceof Entity).toBeTruthy();
    expect(entityCollection.add).toHaveBeenCalledWith(instance);
  });

  it("should call the onChange function property if a component changes", done => {
    const Entity = function() {};
    const eco = new Eco(Entity, mockEntityCollection());

    const entity = {};
    const component = "foo";
    const newValue = {};
    const oldValue = {};

    eco.onChange = function(a, b, c, d) {
      expect(a).toBe(entity);
      expect(b).toBe(component);
      expect(c).toBe(newValue);
      expect(d).toBe(oldValue);
      done();
    };

    eco.onComponentChanged(entity, component, newValue, oldValue);
  });

  it("should increment the entityCollection version when a component is added", () => {
    const Entity = function() {};
    const entityCollection = mockEntityCollection();
    const eco = new Eco(Entity, entityCollection);

    const entity = {};
    eco.onComponentChanged(entity, "foo", "bar", undefined);
    expect(entityCollection.incVersion).toHaveBeenCalledWith(entity, "foo");
  });

  it("should increment the entityCollection version when a component is removed", () => {
    const Entity = function() {};
    const entityCollection = mockEntityCollection();
    const eco = new Eco(Entity, entityCollection);

    const entity = {};
    eco.onComponentChanged(entity, "foo", undefined, "bar");
    expect(entityCollection.incVersion).toHaveBeenCalledWith(entity, "foo");
  });

  it("should not increment the entityCollection version if a component value has changed", () => {
    const Entity = function() {};
    const entityCollection = mockEntityCollection();
    const eco = new Eco(Entity, entityCollection);

    eco.onComponentChanged({}, "foo", "foo", "bar");
    expect(entityCollection.incVersion).not.toHaveBeenCalled();
  });

  it("should inform the entity prototype to set up component accessors", () => {
    const Entity = mockEntityPrototype();
    const eco = new Eco(Entity);

    eco.defineComponents(["foo", "bar"]);
    expect(Entity.defineComponent).toHaveBeenCalledWith("foo");
    expect(Entity.defineComponent).toHaveBeenCalledWith("bar");
  });

  it("should return an array of all its entities", () => {
    const Entity = function() {};
    const entityCollection = mockEntityCollection();
    const eco = new Eco(Entity, entityCollection);
    expect(eco.all).toBe(entityCollection.entities);
  });

  it("should create and return filter instances", () => {
    const Entity = function() {};
    const entityCollection = mockEntityCollection();
    const createFilter = jasmine.createSpy("createFilter");
    const eco = new Eco(Entity, entityCollection, createFilter);

    const filter = {};
    createFilter.and.returnValue(filter);

    const componentArray = ["foo", "bar"];
    expect(eco.createFilter(componentArray)).toBe(filter);
    expect(createFilter).toHaveBeenCalledWith(
      entityCollection,
      componentArray,
      undefined
    );
  });

  it("should create and return filter instances with custom filter functions", () => {
    const Entity = function() {};
    const entityCollection = mockEntityCollection();
    const createFilter = jasmine.createSpy("createFilter");
    const eco = new Eco(Entity, entityCollection, createFilter);

    const filter = {};
    createFilter.and.returnValue(filter);

    const componentArray = ["foo", "bar"];
    const filterFunc = function() {};

    expect(eco.createFilter(componentArray, filterFunc)).toBe(filter);
    expect(createFilter).toHaveBeenCalledWith(
      entityCollection,
      componentArray,
      filterFunc
    );
  });

  it("should return system functions that utilise filters", () => {
    const Entity = function() {};
    const entityCollection = mockEntityCollection();
    const filter = jasmine.createSpyObj("filter", ["forEach"]);
    const createFilter = jasmine
      .createSpy("createFilter")
      .and.returnValue(filter);

    const eco = new Eco(Entity, entityCollection, createFilter);

    const componentArray = ["foo", "bar"];
    const callback = jasmine.createSpy();
    const system = eco.system(componentArray, callback);

    const entities = [{}, {}];
    filter.forEach.and.callFake(cb => entities.forEach(cb));
    system("baz");

    expect(createFilter).toHaveBeenCalledWith(
      entityCollection,
      componentArray,
      undefined
    );
    expect(callback).toHaveBeenCalledWith(entities[0], "baz");
    expect(callback).toHaveBeenCalledWith(entities[1], "baz");
  });

  it("should return system functions that utilise custom filter functions, if three arguments are given", () => {
    const Entity = function() {};
    const entityCollection = mockEntityCollection();
    const filter = jasmine.createSpyObj("filter", ["forEach"]);
    const createFilter = jasmine
      .createSpy("createFilter")
      .and.returnValue(filter);

    const eco = new Eco(Entity, entityCollection, createFilter);

    const componentArray = ["foo", "bar"];
    const filterFunc = function() {};
    const callback = jasmine.createSpy();

    eco.system(componentArray, filterFunc, callback);
    expect(createFilter).toHaveBeenCalledWith(
      entityCollection,
      componentArray,
      filterFunc
    );
  });

  it("should pass additional arguments to the system callback", done => {
    const Entity = function() {};
    const filter = jasmine.createSpyObj("filter", ["forEach"]);
    const createFilter = jasmine
      .createSpy("createFilter")
      .and.returnValue(filter);

    const eco = new Eco(Entity, {}, createFilter);

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

  it("should remove entities that have been disabled", () => {
    const Entity = function() {};
    const entityCollection = mockEntityCollection();
    const eco = new Eco(Entity, entityCollection);
    const entity = eco.entity();

    eco.onEntityStatusChanged(entity, false);
    expect(entityCollection.remove).toHaveBeenCalledWith(entity);
  });

  it("should re-add entities that have been re-enabled", () => {
    const Entity = function() {};
    const entityCollection = mockEntityCollection();
    const eco = new Eco(Entity, entityCollection);
    const entity = eco.entity();

    eco.onEntityStatusChanged(entity, false);
    eco.onEntityStatusChanged(entity, true);
    expect(entityCollection.add.calls.allArgs()).toEqual([[entity], [entity]]);
  });
});
