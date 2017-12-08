/* global Eco, suite, benchmark */

function createEcoFilter(entityCount, criteria) {
  const eco = new Eco();
  eco.defineComponents(["foo", "bar"]);

  for (let i = 0; i < entityCount; i++) {
    const ecoEntity = eco.entity();
    ecoEntity.foo = "foo";

    // Add 'bar' component to every other entity
    if (i % 2 === 0) {
      ecoEntity.bar = "bar";
    }
  }

  return eco.createFilter(criteria);
}

suite("Filters", function() {
  benchmark(
    "Eco, array filter",
    function() {
      this.filter.forEach(entity => entity);
    },
    {
      setup: function() {
        this.filter = createEcoFilter(1000, ["foo", "bar"]);
      },
      teardown: function() {
        this.filter = undefined;
      }
    }
  );

  benchmark(
    "Eco, function filter",
    function() {
      this.filter.forEach(entity => entity);
    },
    {
      setup: function() {
        this.filter = createEcoFilter(1000, entity => entity.foo && entity.bar);
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
        .forEach(entity => entity);
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
