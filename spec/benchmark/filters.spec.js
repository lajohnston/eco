/* global Eco, suite, benchmark */

function createEcoFilter(entityCount, components, filter) {
  const eco = new Eco();
  eco.defineComponents(["foo", "bar", "baz"]);

  for (let i = 0; i < entityCount; i++) {
    const ecoEntity = eco.entity();
    ecoEntity.foo = "foo";

    // Add 'bar' component to every other entity
    if (i % 2 === 0) {
      ecoEntity.bar = "bar";
    }
  }

  return eco.createFilter(components, filter);
}

suite("Filters", function() {
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
        this.filter = createEcoFilter(
          1000,
          ["foo", "bar"],
          entity => entity.foo && entity.bar
        );
      },
      teardown: function() {
        this.filter = undefined;
      }
    }
  );

  benchmark(
    "Eco, array filter, second pass, no changes",
    function() {
      this.filter.forEach(entity => entity); // second pass
    },
    {
      setup: function() {
        this.filter = createEcoFilter(1000, ["foo", "bar"]);
        this.filter.forEach(entity => entity); // first pass
      },
      teardown: function() {
        this.filter = undefined;
      }
    }
  );

  benchmark(
    "Eco, array filter, second pass, changes to an irrelevant component",
    function() {
      // Add or remove irrelevant component
      const baz = this.entity.baz;
      this.entity.baz = baz ? undefined : "baz"; // toggle

      // Second pass
      this.filter.forEach(entity => entity);
    },
    {
      setup: function() {
        this.filter = createEcoFilter(1000, ["foo", "bar"]);

        // run first pass and get first entity
        this.entity = this.filter.filtered[0];
      },
      teardown: function() {
        this.filter = undefined;
        this.entity = undefined;
      }
    }
  );
});
