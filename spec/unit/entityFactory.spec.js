import EntityFactory from '../../src/EntityFactory';

describe('create()', () => {
  let factory;
  let instanceFactory;
  let componentCollection;
  let entity;

  beforeEach(() => {
    entity = jasmine.createSpyObj('entity', ['add']);

    instanceFactory = jasmine.createSpyObj('instanceFactory', ['create']);
    instanceFactory.create.and.returnValue(entity);

    componentCollection = jasmine.createSpyObj('componentCollection', ['create']);
    factory = new EntityFactory(instanceFactory, componentCollection);
  });

  it('should create an entity instance and provide it with a new id', () => {
    const resultA = factory.create({});
    const resultB = factory.create({});

    expect(resultA).toBe(entity);
    expect(resultB).toBe(entity);

    expect(instanceFactory.create.calls.argsFor(0)).toEqual([1, componentCollection]);
    expect(instanceFactory.create.calls.argsFor(1)).toEqual([2, componentCollection]);
  });

  it('should add the components to the entity', () => {
    const components = {
      foo: 'fooValue',
      bar: 'barValue',
    };

    const result = factory.create(components);

    expect(result.add.calls.count()).toBe(2);
    expect(result.add.calls.argsFor(0)).toEqual(['foo', 'fooValue']);
    expect(result.add.calls.argsFor(1)).toEqual(['bar', 'barValue']);
  });

  it('should not add the components if none were given', () => {
    const result = factory.create();
    expect(result.add.calls.count()).toBe(0);
  });
});
