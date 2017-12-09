import EntityCollection from "../../src/entityCollection";

describe("EntityCollection", () => {
  it("should hold items", () => {
    const collection = new EntityCollection();
    const entity = {};
    collection.add(entity);
    expect(collection.entities).toEqual([entity]);
  });

  it("should remove items", () => {
    const collection = new EntityCollection();
    const entity = {};
    collection.add(entity);
    collection.remove(entity);

    expect(collection.entities).toEqual([]);
  });

  it("should filter items", () => {
    const collection = new EntityCollection();
    const entityA = {};
    const entityB = {};

    collection.add(entityA);
    collection.add(entityB);

    const result = collection.filter(test => {
      return test === entityB;
    });

    expect(result).toEqual([entityB]);
  });

  it("should update its version when requested", () => {
    const collection = new EntityCollection();
    const oldVersion = collection.version;
    collection.incVersion();

    expect(collection.version).not.toEqual(oldVersion);
    expect(oldVersion.next).toBe(collection.version);
  });

  it("should update its version when a new item is added", () => {
    const collection = new EntityCollection();
    const oldVersion = collection.version;
    const entity = {};
    collection.add(entity);

    expect(collection.version).not.toEqual(oldVersion);
    expect(oldVersion.next).toBe(collection.version);
  });

  it("should update its version when an item is removed", () => {
    const collection = new EntityCollection();
    const entity = {};
    collection.add(entity);

    const oldVersion = collection.version;
    collection.remove(entity);

    expect(collection.version).not.toEqual(oldVersion);
    expect(oldVersion.next).toBe(collection.version);
  });
});
