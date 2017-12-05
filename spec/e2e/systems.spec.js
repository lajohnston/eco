function createEco() {
  const eco = new window.Eco();
  eco.component("foo", () => "foo");
  eco.component("bar", () => "bar");

  return eco;
}

describe("Systems", () => {
  it("should call the callback with the relevant component data for each matching entity", () => {
    const eco = createEco();

    const matches = [];
    const system = eco.system(["foo", "bar"], entity => {
      matches.push(entity);
    });

    const entityA = eco
      .entity()
      .add("foo")
      .add("bar");

    const entityB = eco
      .entity()
      .add("foo")
      .add("bar");

    const entityC = eco.entity().add("foo");

    system();

    expect(matches).toContain(entityA);
    expect(matches).toContain(entityB);
    expect(matches).not.toContain(entityC);
  });

  it("should ignore entities that have had a required component removed since the last iteration", () => {
    const eco = createEco();

    const entity = eco
      .entity()
      .add("foo")
      .add("bar");

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
    entity.remove("foo");
    system();
    expect(matches.length).toBe(0);
  });

  it("should include entities that have had a required component added since the last iteration and now qualify", () => {
    const eco = createEco();
    const entity = eco.entity().add("foo");

    let matches = [];
    const system = eco.system(["foo", "bar"], entityMatch => {
      matches.push(entityMatch);
    });

    // First run
    system();
    expect(matches.length).toBe(0);

    // Second run
    entity.add("bar");
    matches = [];
    system();
    expect(matches.length).toBe(1);
    expect(matches).toContain(entity);
  });

  it("should pass additional arguments to the system callback", done => {
    const eco = createEco();
    const entity = eco.entity().add("foo");

    const system = eco.system(["foo"], (entityArg, arg2, arg3) => {
      expect(entityArg).toBe(entity);
      expect(arg2).toBe("bar");
      expect(arg3).toBe("baz");
      done();
    });

    system("bar", "baz");
  });
});
