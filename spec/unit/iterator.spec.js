import Iterator from "../../src/iterator";

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
    const iterator = new Iterator(entities, [], filterFunction);

    const result = [];

    iterator.forEach(entity => {
      result.push(entity);
    });

    expect(result).toEqual([3, 4]);
  });

  it("should filter entities using the given array of component names if no filter function is given", () => {
    const entities = [
      mockEntity(["foo"]),
      mockEntity(["bar"]),
      mockEntity(["foo", "bar"])
    ];

    const iterator = new Iterator(entities, ["foo", "bar"]);
    const result = [];

    iterator.forEach(entity => {
      result.push(entity);
    });

    expect(result).toEqual([entities[2]]);
  });

  it("should not re-filter entities if the entities version has not changed", () => {
    const entityCollection = mockEntityCollection();
    entityCollection.version = {};
    entityCollection.filter.and.returnValue([]);

    const iterator = new Iterator(entityCollection, ["foo"]);

    iterator.forEach(() => {}); // first-pass
    iterator.forEach(() => {}); // second-pass

    expect(entityCollection.filter.calls.count()).toBe(1);
  });

  it("should not re-filter entities if only an irrelevant component has been changed since the last update", () => {
    const entityCollection = mockEntityCollection();
    entityCollection.filter.and.returnValue([]);

    const startVersion = {};
    entityCollection.version = startVersion;

    const iterator = new Iterator(entityCollection, ["foo"]);

    iterator.forEach(() => {}); // first-pass
    const newVersion = { component: "bar" };
    startVersion.next = newVersion;
    entityCollection.version = newVersion;

    iterator.forEach(() => {}); // second-pass

    expect(entityCollection.filter.calls.count()).toBe(1);
  });

  it("should re-filter entities if one has been added or removed since the last update", () => {
    const entityCollection = mockEntityCollection();
    entityCollection.filter.and.returnValue([]);

    const startVersion = {};
    entityCollection.version = startVersion;

    const iterator = new Iterator(entityCollection, ["foo"]);

    iterator.forEach(() => {}); // first-pass
    const newVersion = { component: undefined };
    startVersion.next = newVersion;
    entityCollection.version = newVersion;

    iterator.forEach(() => {}); // second-pass

    expect(entityCollection.filter.calls.count()).toBe(2);
  });
});
