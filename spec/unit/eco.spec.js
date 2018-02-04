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

  it("should create and return iterator instances", () => {
    const Entity = function() {};
    const entityCollection = mockEntityCollection();
    const createIterator = jasmine.createSpy("createIterator");
    const eco = new Eco(Entity, entityCollection, createIterator);

    const filter = {};
    createIterator.and.returnValue(filter);

    const componentArray = ["foo", "bar"];
    expect(eco.iterator(componentArray)).toBe(filter);
    expect(createIterator).toHaveBeenCalledWith(
      entityCollection,
      componentArray,
      undefined
    );
  });

  it("should create and return filter instances with custom filter functions", () => {
    const Entity = function() {};
    const entityCollection = mockEntityCollection();
    const createIterator = jasmine.createSpy("createIterator");
    const eco = new Eco(Entity, entityCollection, createIterator);

    const filter = {};
    createIterator.and.returnValue(filter);

    const componentArray = ["foo", "bar"];
    const filterFunc = function() {};

    expect(eco.iterator(componentArray, filterFunc)).toBe(filter);
    expect(createIterator).toHaveBeenCalledWith(
      entityCollection,
      componentArray,
      filterFunc
    );
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
