import EntityFactory from '../../../src/entities/EntityFactory';

describe('create()', () => {
  let factory;
  let instanceFactory;
  let componentCollection;
  let entity;

  beforeEach(() => {
    entity = {};

    instanceFactory = jasmine.createSpyObj('instanceFactory', ['create']);
    instanceFactory.create.and.returnValue(entity);

    componentCollection = jasmine.createSpyObj('componentCollection', ['create']);
    factory = new EntityFactory(instanceFactory, componentCollection);
  });

  it('should create an entity instance and provide it with a new id', () => {
    const resultA = factory.create();
    const resultB = factory.create();

    expect(resultA).toBe(entity);
    expect(resultB).toBe(entity);

    expect(instanceFactory.create.calls.argsFor(0)).toEqual([1, componentCollection]);
    expect(instanceFactory.create.calls.argsFor(1)).toEqual([2, componentCollection]);
  });
});
