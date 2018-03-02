const Eco = window.Eco;

function createEco() {
  return Eco.create(["foo", "bar", "baz"]);
}

describe("Iterators", () => {
  it("should filter entities that have the given array of component names", done => {
    const eco = createEco();
    const filter = eco.iterator(["foo", "bar"]);

    // Non matching
    eco.entity().foo = "foo";

    // Matching
    const matching = eco.entity();
    matching.foo = "foo";
    matching.bar = "bar";

    filter.forEach((entity, index, array) => {
      expect(entity).toBe(matching);
      expect(array).toEqual([matching]);
      done();
    });
  });

  it("should filter entities with the given filter function", done => {
    const eco = createEco();
    const filter = eco.iterator(
      ["foo", "bar"],
      entity => entity.foo && entity.bar
    );

    // Non matching
    eco.entity().foo = "foo";

    // Matching
    const matching = eco.entity();
    matching.foo = "foo";
    matching.bar = "bar";

    filter.forEach((entity, index, array) => {
      expect(entity).toBe(matching);
      expect(array).toEqual([matching]);
      done();
    });
  });

  it("should ignore entities that have had a required component removed since the last iteration", () => {
    const eco = createEco();
    const entity = eco.entity();
    entity.foo = "foo";

    const filter = eco.iterator(["foo"]);

    let initialCount = 0;
    filter.forEach(() => {
      initialCount += 1;
    });

    expect(initialCount).toBe(1);

    entity.foo = undefined;

    filter.forEach(() => {
      fail("Filter callback was not expected to be called");
    });
  });

  it("should include entities that have had a component added since the last iteration and now qualify", () => {
    const eco = createEco();
    const entity = eco.entity();
    entity.foo = "foo";

    const filter = eco.iterator(["bar"]);

    filter.forEach(() => {
      fail("Filter callback was not expected to be called");
    });

    entity.bar = "bar";

    let count = 0;
    filter.forEach(entityArg => {
      expect(entityArg).toBe(entity);
      count += 1;
    });

    expect(count).toBe(1);
  });

  it("should ignore entities that have been disabled since the last iteration", () => {
    const eco = createEco();
    const entity = eco.entity();
    entity.foo = "foo";

    const filter = eco.iterator(["foo"]);
    filter.forEach(() => {});

    entity.enabled = false;

    filter.forEach(() => {
      fail("Filter callback was not expected to be called");
    });
  });

  it("should include relevant entities that have been re-enabled since the last iteration", done => {
    const eco = createEco();
    const entity = eco.entity();
    entity.foo = "foo";
    entity.enabled = false;

    const filter = eco.iterator(["foo"]);
    filter.forEach(() => {});

    entity.enabled = true;
    filter.forEach(() => {
      done();
    });
  });
});
