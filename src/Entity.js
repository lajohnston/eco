export default class Entity {
  constructor(id, components) {
    this.id = id;
    this.components = components;
  }

  getId() {
    return this.id;
  }

  get(componentName) {
    return this.components.getEntity(this.id, componentName);
  }
}
