/* global Eco, suite, benchmark */

function createEcoFilter(entityCount) {
  const eco = new Eco();
  eco.component("foo", () => "foo");
  eco.component("bar", () => "bar");

  for (let i = 0; i < entityCount; i++) {
    const ecoEntity = eco.entity().add("foo");

    // Add 'bar' component to every other entity
    if (i % 2 === 0) {
      ecoEntity.add("bar");
    }
  }

  return eco.createFilter(["foo", "bar"]);
}

suite("Filters", function() {
  benchmark(
    "Eco",
    function() {
      this.filter.forEach(() => {});
    },
    {
      setup: function() {
        this.filter = createEcoFilter(1000);
      },
      teardown: function() {
        this.filter = undefined;
      }
    }
  );

  benchmark(
    "Native",
    function() {
      this.entities
        .filter(entity => entity.foo && entity.bar)
        .forEach(() => {});
    },
    {
      setup: function() {
        this.entities = [];

        for (let i = 0; i < 1000; i++) {
          this.entities.push({
            foo: "foo",
            bar: i % 2 === 0 ? "bar" : undefined
          });
        }
      }
    }
  );
});
