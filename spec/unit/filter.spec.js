import Filter from "../../src/filter";

function mockEntity(components = []) {
  const entity = jasmine.createSpyObj("entity", ["has"]);
  entity.has.and.callFake(name => components.includes(name));

  return entity;
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
});
