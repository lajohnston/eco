# Eco Entity Component System

Eco is a lightweight, optimised, entity-component-system library for
JavaScript/HTML5 games that lets you define your components and game logic as
decoupled POJO/Vanilla JS. The API described below is in development, but a
fully functional earlier version is available under the releases tab.

You can use Eco as part of a custom game engine, or as a glue layer to keep your
game logic decoupled from the game framework and libraries of your choice.

## Overview

In the ECS pattern, in-game objects aren't identified by a hierarchical type
(such as "Player", "Enemy", "FlyingEnemy", "FlyingEnemyWithGun" ...), but rather
by what components they possess. This allows you to assemble many variations
using the same component parts, and even allows components to be added or
removed at runtime to change entity behaviour on the fly.

* Components - data structures (position, movement, appearance etc.)
* Entities - objects with components
* Systems - logic that updates entities

## Basic usage

```javascript
// Define the component names
const eco = new Eco();
eco.defineComponents(['position', 'movement']);

// Create an entity and add some component data
const entity = eco.entity();
entity.position = { x: 100, y: 200 };
entity.movement = { x: 1, y: 0, speed: 2 };

// Create a 'system' to update entity movement
const updateMovement = eco.system(
  ["position", "movement"], // filter only entities with these components
  ({ position, movement }, customArg1) => { // args are passed after the entity
    // Will update each entity's position by its movement vector
    position.x += movement.x * movement.speed;
    position.y += movement.y * movement.speed;
  })
);

// Your update function in the main loop
function update(delta) {
  updateMovement(delta); // you can pass any number of custom arguments
};
```

## Entities

```javascript
/**
 * Define the component names. This sets up properties on the entities so you
 * can access and configure them using standard dot notation
 */
const eco = new Eco();
eco.defineComponents(["position"]);

const entity = eco.entity();

// Add or replace component using standard dot notation
entity.position = { x: 100, y: 200 };
entity.has("position"); // true

// Access components
entity.position.x; // 100
entity.position.y; // 200

// Remove a component
entity.position = undefined;
entity.position; // undefined
entity.has("position"); // false

// Remove all components
entity.removeAll();
```

## Systems and Filters

Filters and systems allow you to iterate over a subset of entities, similar to
using Array.filter and Array.forEach. In later versions they will cache the
filter stage and only refresh when relevant entities or components have been
added or removed, which in prototypes has given a significant speed advantage
for large numbers of entities.

For this reason, the API has been designed so that you create them in advance
and call them in the update loop.

### Systems

Provide the filter criteria as the first argument, and the forEach update
function as the second.

```javascript
// Filter function syntax
const fooNotBar = eco.system(
  entity => entity.foo && !entity.bar,
  entity => {
    entity.has("foo"); // true
    entity.has("bar"); // false
  }
);

// Array syntax- specify the components entities must have to qualify
const updateMovement = eco.system(["position", "movement"], entity => {
  entity.has("position"); // true
  entity.has("movement"); // true
});

// In the main loop
updateMovement();
```

### Filters

Systems provide a convenient wrapper around filters, but if you need more
control you can use filters directly. Like systems they can accept either an
array or a function callback to filter entities.

```javascript
const fooBar = eco.createFilter(["foo", "bar"]);
const fooNoBar = eco.createFilter(
  entity => entity.has("foo") && !entity.has("bar")
);

fooBar.forEach(entity => {
  entity.has("foo"); // true
  entity.has("bar"); // true
});

fooNoBar.forEach(entity => {
  entity.has("foo"); // true
  entity.has("bar"); // false
});
```

## Events

Eco provides a basic callback that is called each time a component value is set.
An example use-case is if you're using a collision algorithm such as a QuadTree
or Grid, and wish to update it when an entity position changes.

```javascript
const eco = new Eco();

// Set the eco.onChange function
eco.onChange = (entity, componentName, newValue, oldValue) => {
  // this will be called whenever a component value is set
};

// The following examples will trigger the callback
entity.position = {};
entity.position = undefined;
entity.position = entity.position;

// ...but editing component properties will not
entity.position.x = 100; // will not trigger
```

For deep change detection, you may consider read-only immutable components that
return new instances of themselves when changed. The altered value will
therefore have to be explicitly set to the entity and this will trigger the
onChange event. This is a minimal example:

```javascript
function Vector2(x, y) {
  this._x = x;
  this._y = y;
}

Vector2.prototype.add = function(x, y) {
  return new Vector2(this._x + x, this._y + y);
};

entity.position = new Vector2(100, 200);

// entity.position won't actually be changed by this:
entity.position.add(100, 50); // returns a new instance; entity.position unchanged

// you have to explictly set it back to the entity, and this trigger the change
entity.position = entity.position.add(100, 50);
```
