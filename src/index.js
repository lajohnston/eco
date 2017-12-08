import AbstractEntity from "./abstractEntity";
import Eco from "./eco";
import Filter from "./filter";

function createFilter(entities, criteria) {
  return new Filter(entities, criteria);
}

function createEco() {
  // Extend entity class so each Eco instance can define its own components
  const Entity = class extends AbstractEntity {};
  return new Eco(Entity, createFilter);
}

window.Eco = createEco;
