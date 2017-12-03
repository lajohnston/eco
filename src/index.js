import Eco from "./eco";
import BaseEntity from "./baseEntity";

function createEco() {
  return new Eco(BaseEntity);
}

window.Eco = createEco;
