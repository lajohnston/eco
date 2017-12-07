/* global Eco, suite, benchmark */

suite("Adding entities", function() {
  benchmark(
    "Eco",
    function() {
      this.eco.entity();
    },
    {
      setup: function() {
        this.eco = new Eco();
      },
      teardown: function() {
        this.eco = undefined;
      }
    }
  );

  benchmark(
    "Native",
    function() {
      this.entities.push({});
    },
    {
      setup: function() {
        this.entities = [];
      },
      teardown: function() {
        this.entities = undefined;
      }
    }
  );
});

suite("Adding and removing components", () => {
  benchmark(
    "Eco",
    function() {
      this.ecoEntity.foo = "foo";
      this.ecoEntity.foo = undefined;
    },
    {
      setup: function() {
        const eco = new Eco();
        eco.defineComponents(["foo"]);
        this.ecoEntity = eco.entity();
      },
      teardown: function() {
        this.ecoEntity = undefined;
      }
    }
  );

  benchmark(
    "Native",
    function() {
      this.nativeEntity.foo = "foo";
      this.nativeEntity.foo = undefined;
    },
    {
      setup: function() {
        this.nativeEntity = {};
      },
      teardown: function() {
        this.nativeEntity = undefined;
      }
    }
  );
});
