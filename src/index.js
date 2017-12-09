import AbstractEntity from "./abstractEntity";
import Eco from "./eco";
import EntityCollection from "./entityCollection";
import Filter from "./filter";

function createEntityCollection() {
  return new EntityCollection();
}

function createFilter(entities, criteria) {
  return new Filter(entities, criteria);
}

function createEco() {
  // Extend entity class so each Eco instance can define its own components
  const Entity = class extends AbstractEntity {};
  return new Eco(Entity, createEntityCollection(), createFilter);
}

window.Eco = createEco;
