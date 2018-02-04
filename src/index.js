import AbstractEntity from "./abstractEntity";
import Eco from "./eco";
import EntityCollection from "./entityCollection";
import Iterator from "./iterator";

function createEntityCollection() {
  return new EntityCollection();
}

function createIterator(entities, components, filterFunc) {
  return new Iterator(entities, components, filterFunc);
}

function createEco() {
  // Extend entity class so each Eco instance can define its own components
  const Entity = class extends AbstractEntity {};
  return new Eco(Entity, createEntityCollection(), createIterator);
}

window.Eco = createEco;
