import AbstractEntity from "./abstractEntity";
import Eco from "./eco";

function createEco() {
  return new Eco(AbstractEntity);
}

window.Eco = createEco;
