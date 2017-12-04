const Eco = window.Eco;

function createEco() {
  const eco = new Eco();
  eco.component("foo", () => "foo");
  eco.component("bar", () => "bar");
  eco.component("baz", () => "baz");

  return eco;
}

describe("Filters", () => {
  describe("forEach", () => {
    it("should filter entities with the given filter function", done => {
      const eco = createEco();
      const filter = eco.createFilter(entity => entity.foo && entity.bar);

      // Non matching
      eco.entity().add("foo");

      // Matching
      const matching = eco
        .entity()
        .add("foo")
        .add("bar");

      filter.forEach((entity, index, array) => {
        expect(entity).toBe(matching);
        expect(array).toEqual([matching]);
        done();
      });
    });

    it("should filter entities that have the given array of component names", done => {
      const eco = createEco();
      const filter = eco.createFilter(["foo", "bar"]);

      // Non matching
      eco.entity().add("foo");

      // Matching
      const matching = eco
        .entity()
        .add("foo")
        .add("bar");

      filter.forEach((entity, index, array) => {
        expect(entity).toBe(matching);
        expect(array).toEqual([matching]);
        done();
      });
    });

    it("should ignore entities that have had a required component removed since the last iteration", () => {
      const eco = createEco();
      const entity = eco.entity().add("foo", {});
      const filter = eco.createFilter(["foo"]);

      let initialCount = 0;
      filter.forEach(() => {
        initialCount += 1;
      });

      expect(initialCount).toBe(1);

      entity.remove("foo");

      filter.forEach(() => {
        fail("Filter callback was not expected to be called");
      });
    });

    it("should include entities that have had a component added since the last iteration and now qualify", () => {
      const eco = createEco();
      const entity = eco.entity().add("foo");
      const filter = eco.createFilter(["bar"]);

      filter.forEach(() => {
        fail("Filter callback was not expected to be called");
      });

      entity.add("bar");

      let count = 0;
      filter.forEach(entityArg => {
        expect(entityArg).toBe(entity);
        count += 1;
      });

      expect(count).toBe(1);
    });
  });
});
