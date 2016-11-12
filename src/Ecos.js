export default class Ecos {
  constructor(entityFactory) {
    this.entityFactory = entityFactory;
  }

  addComponent(name, data) {

  }

  createEntity(components) {
    return this.entityFactory.create(components);
  }
}
