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
});
