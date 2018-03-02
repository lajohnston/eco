import Eco from "../../src/eco";

function mockEntityCollection() {
  return jasmine.createSpyObj("entityCollection", [
    "add",
    "remove",
    "incVersion"
  ]);
}

describe("Eco", () => {
  it("should return entity instances", () => {
    const entity = "foo";
    const createEntity = jasmine.createSpy().and.returnValue(entity);

    const entityCollection = mockEntityCollection();
    const eco = new Eco(createEntity, entityCollection);

    const instance = eco.entity();
    expect(createEntity).toHaveBeenCalledWith(eco);
    expect(instance).toBe(entity);
    expect(entityCollection.add).toHaveBeenCalledWith(instance);
  });

  it("should call the onChange function property if a component changes", done => {
    const eco = new Eco(() => ({}), mockEntityCollection());

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
    const entityCollection = mockEntityCollection();
    const eco = new Eco(() => ({}), entityCollection);

    const entity = {};
    eco.onComponentChanged(entity, "foo", "bar", undefined);
    expect(entityCollection.incVersion).toHaveBeenCalledWith(entity, "foo");
  });

  it("should increment the entityCollection version when a component is removed", () => {
    const entityCollection = mockEntityCollection();
    const eco = new Eco(() => ({}), entityCollection);

    const entity = {};
    eco.onComponentChanged(entity, "foo", undefined, "bar");
    expect(entityCollection.incVersion).toHaveBeenCalledWith(entity, "foo");
  });

  it("should not increment the entityCollection version if a component value has changed", () => {
    const entityCollection = mockEntityCollection();
    const eco = new Eco(() => ({}), entityCollection);

    eco.onComponentChanged({}, "foo", "foo", "bar");
    expect(entityCollection.incVersion).not.toHaveBeenCalled();
  });

  it("should return an array of all its entities", () => {
    const entityCollection = mockEntityCollection();
    const eco = new Eco(() => ({}), entityCollection);
    expect(eco.all).toBe(entityCollection.entities);
  });

  it("should create and return iterator instances", () => {
    const entityCollection = mockEntityCollection();
    const createIterator = jasmine.createSpy("createIterator");
    const eco = new Eco(() => ({}), entityCollection, createIterator);

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
    const entityCollection = mockEntityCollection();
    const createIterator = jasmine.createSpy("createIterator");
    const eco = new Eco(() => ({}), entityCollection, createIterator);

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
    const entityCollection = mockEntityCollection();
    const eco = new Eco(() => ({}), entityCollection);
    const entity = eco.entity();

    eco.onEntityStatusChanged(entity, false);
    expect(entityCollection.remove).toHaveBeenCalledWith(entity);
  });

  it("should re-add entities that have been re-enabled", () => {
    const entityCollection = mockEntityCollection();
    const eco = new Eco(() => ({}), entityCollection);
    const entity = eco.entity();

    eco.onEntityStatusChanged(entity, false);
    eco.onEntityStatusChanged(entity, true);
    expect(entityCollection.add.calls.allArgs()).toEqual([[entity], [entity]]);
  });
});
