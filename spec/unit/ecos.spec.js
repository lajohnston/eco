import Ecos from '../../src/Ecos';

describe('Ecos', () => {
  let ecos;
  let entityFactory;

  beforeEach(() => {
    entityFactory = jasmine.createSpyObj('EntityFactory', ['create']);
    ecos = new Ecos(entityFactory);
  });

  describe('createEntity', () => {
    it('should return a new entity instance from the entity factory', () => {
      const entity = {};
      const components = {};

      entityFactory.create.and.returnValue(entity);

      const result = ecos.createEntity(components);

      expect(entityFactory.create).toHaveBeenCalledWith(components);
      expect(result).toBe(entity);
    });
  });
});
