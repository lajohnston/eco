import AbstractEntity from "./abstractEntity";
import Eco from "./eco";
import EntityCollection from "./entityCollection";
import Iterator from "./iterator";

/**
 * Creates and returns an Eco dependency container object
 *
 * @returns {Object} dependency container
 */
function createContainer() {
  const container = {
    Entity: AbstractEntity,
    Iterator,
    EntityCollection,
    Eco,

    // Eco instance
    create(components = []) {
      // Extend entity class so each Eco instance can define its own components
      const Entity = class extends container.Entity {};
      components.forEach(name => Entity.defineComponent(name));

      return new container.Eco(
        Entity,
        container.entityCollection(),
        container.createIterator
      );
    },

    entityCollection() {
      return new container.EntityCollection();
    },

    createIterator(entities, components, filterFunc) {
      return new container.Iterator(entities, components, filterFunc);
    }
  };

  return container;
}

/**
 * Returns a new Eco instance using a default container
 *
 * @param {string[]} components component names
 * @returns {Eco} eco instance
 */
function create(components) {
  return createContainer().create(components);
}

window.Eco = {
  container: createContainer,
  create
};
