import AbstractEntity from "./abstractEntity";
import Eco from "./eco";

function createEco() {
  let eco;

  // Extend entity class to apply to this eco instance
  const Entity = class extends AbstractEntity {
    static createComponent(name, ...args) {
      return eco.createComponent(name, ...args);
    }
  };

  // Create eco instance
  eco = new Eco(Entity);
  return eco;
}

window.Eco = createEco;
