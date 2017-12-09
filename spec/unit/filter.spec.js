import Filter from "../../src/filter";

function mockEntity(components = []) {
  const entity = jasmine.createSpyObj("entity", ["has"]);
  entity.has.and.callFake(name => components.includes(name));

  return entity;
}

function mockEntityCollection() {
  return jasmine.createSpyObj("entityCollection", ["filter"]);
}

describe("Filter", () => {
  it("should filter entities using the given filter function", () => {
    const filterFunction = jasmine
      .createSpy("filterFunction")
      .and.callFake(x => x > 2);

    const entities = [1, 2, 3, 4];
    const filter = new Filter(entities, filterFunction);

    const result = [];

    filter.forEach(entity => {
      result.push(entity);
    });

    expect(result).toEqual([3, 4]);
  });

  it("should filter entities using the given array of component names", () => {
    const entities = [
      mockEntity(["foo"]),
      mockEntity(["bar"]),
      mockEntity(["foo", "bar"])
    ];

    const filter = new Filter(entities, ["foo", "bar"]);
    const result = [];

    filter.forEach(entity => {
      result.push(entity);
    });

    expect(result).toEqual([entities[2]]);
  });

  it("should not re-filter entities if the entities version has not changed", () => {
    const entityCollection = mockEntityCollection();
    entityCollection.version = {};
    entityCollection.filter.and.returnValue([]);

    const filter = new Filter(entityCollection, ["foo"]);

    filter.forEach(() => {}); // first-pass
    filter.forEach(() => {}); // second-pass

    expect(entityCollection.filter.calls.count()).toBe(1);
  });
});
