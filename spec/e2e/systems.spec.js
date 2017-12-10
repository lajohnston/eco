function createEco() {
  const eco = new window.Eco();
  eco.defineComponents(["foo", "bar"]);
  return eco;
}

describe("Systems", () => {
  it("should call the callback with the relevant component data for each matching entity", () => {
    const eco = createEco();

    const matches = [];
    const system = eco.system(["foo", "bar"], entity => {
      matches.push(entity);
    });

    const entityA = eco.entity();
    entityA.foo = "foo";
    entityA.bar = "bar";

    const entityB = eco.entity();
    entityB.foo = "foo";
    entityB.bar = "bar";

    const entityC = eco.entity();
    entityC.foo = "foo";

    system();

    expect(matches).toContain(entityA);
    expect(matches).toContain(entityB);
    expect(matches).not.toContain(entityC);
  });

  it("should ignore entities that have had a required component removed since the last iteration", () => {
    const eco = createEco();

    const entity = eco.entity();
    entity.foo = "foo";
    entity.bar = "bar";

    let matches = [];
    const system = eco.system(["foo", "bar"], entityMatch => {
      matches.push(entityMatch);
    });

    // First run
    system();
    expect(matches.length).toBe(1);
    expect(matches).toContain(entity);

    // Second run
    matches = [];
    entity.foo = undefined;
    system();
    expect(matches.length).toBe(0);
  });

  it("should include entities that have had a required component added since the last iteration and now qualify", () => {
    const eco = createEco();
    const entity = eco.entity();
    entity.foo = "foo";

    let matches = [];
    const system = eco.system(["foo", "bar"], entityMatch => {
      matches.push(entityMatch);
    });

    // First run
    system();
    expect(matches.length).toBe(0);

    // Second run
    entity.bar = "bar";
    matches = [];
    system();
    expect(matches.length).toBe(1);
    expect(matches).toContain(entity);
  });

  it("should pass additional arguments to the system callback", done => {
    const eco = createEco();
    const entity = eco.entity();
    entity.foo = "foo";

    const system = eco.system(["foo"], (entityArg, arg2, arg3) => {
      expect(entityArg).toBe(entity);
      expect(arg2).toBe("bar");
      expect(arg3).toBe("baz");
      done();
    });

    system("bar", "baz");
  });

  it("should create a filter with the given filter function if three parameters are given", () => {
    const eco = createEco();
    const entityA = eco.entity();
    entityA.foo = "foo";

    const entityB = eco.entity();
    entityB.foo = "foo";
    entityB.bar = "bar";

    const matches = [];
    const system = eco.system(
      ["foo", "bar"],
      entity => entity.has("foo") && !entity.has("bar"),
      entityMatch => {
        matches.push(entityMatch);
      }
    );

    system();
    expect(matches).toEqual([entityA]);
  });
});
