# Eco ECS (Entity Component System)

Eco is a lightweight, optimised, entity container for JavaScript/HTML5 games.
It can be used within a custom game engine, or as a glue layer to keep your
game logic decoupled from the game framework and libraries of your choice.

## Overview of the ECS pattern

As an alternative to defining hierarchical types for in-game entities
(such as "Player", "Enemy", "FlyingEnemy", "FlyingEnemyWithGun" ...), the ECS
pattern has you split the aspects into components (position, movement, canFly,
hasGun) then mix and match them. This allows you to assemble many variations
using the same component parts, and even allows components to be added or
removed to change entity behaviour at runtime.

* Components - data structures (position, movement, appearance etc.)
* Entities - containers that hold components; represent in-game objects
* Systems - logic that updates entities based on their component set

## Basic usage

```javascript
// Create an Eco instance, specifying a list of component names
const eco = Eco.create(["position", "movement"]);

// Create an entity. Add components using dot notation
const entity = eco.entity();
entity.position = { x: 100, y: 200 };
entity.movement = { x: 1, y: 0, speed: 2 };

// Create an iterator for entities with position && movement components.
const moveable = eco.iterator(["position", "movement"]);

// Your update function in the main loop
function update(delta) {
  moveable.forEach(entity => {
    // Add movement to position
    entity.position.x += entity.movement.x * entity.movement.speed * delta;
    entity.position.y += entity.movement.y * entity.movement.speed * delta;
  });
}
```

## Entities

```javascript
// Create an empty entity
const eco = Eco.create(["position"]);
const entity = eco.entity();

// Add or replace components using standard dot notation
entity.position = { x: 100, y: 200 };
entity.position.x; // 100
entity.position.y; // 200
entity.has("position"); // true

// Remove a component
entity.position = undefined;
entity.position; // undefined
entity.has("position"); // false

// Remove all components from an entity
entity.removeAll();
```

You can add custom methods to the Entity class by extending it.

```javascript
// Create and edit a custom Eco dependency container
const myEco = Eco.container();

// Extend the Entity class and add your own methods
myEco.Entity = class extends myEco.Entity {
  getFoo() {
    return this.foo;
  }
};

// Create an eco instance then use it as normal
const eco = myEco.create(["foo"]);
const entity = eco.entity(); // will be an instance of your entity class
```

## Iterators

Iterators iterate over a subset of entities, similar to using Array.filter and
Array.forEach. They utilise caching to ensure the filtering step is only
performed when a relevant change has occurred.

```javascript
// Filter only entities which have foo AND bar components
const fooBar = eco.iterator(["foo", "bar"]);

fooBar.forEach(entity => {
  entity.has("foo"); // true
  entity.has("bar"); // true
});

/**
 * An optional second parameter lets you specify a custom filter function. You
 * must still provide the array of components as the first argument as this is
 * used by the caching system to determine what changes are relevant to it
 */
const fooNoBar = eco.iterator(
  ["foo", "bar"], // relevant components
  entity => entity.has("foo") && !entity.has("bar")
);

fooNoBar.forEach(entity => {
  entity.has("foo"); // true
  entity.has("bar"); // false
});
```

## Callbacks

Eco provides a basic callback system that is called each time a component value
is set. An example use-case is if you're using a collision algorithm such as a
QuadTree or Grid, and wish to update it when an entity position changes.

```javascript
// Set the eco.onChange function
eco.onChange = (entity, componentName, newValue, oldValue) => {
  // this will be called whenever a component value is set
};

// Setting a component value will trigger the callback
entity.foo = "bar"; // oldValue = undefined; newValue = "bar"
entity.foo = undefined; // oldValue = "bar"; newValue = undefined

// Eco does not perform deep change detection, so the following won't trigger
// the callback
entity.position.x = 100; // will not trigger eco.onChange
entity.position = entity.position; // you'd have to do this to manually trigger
```

For deep change detection, you may consider read-only immutable components that
return new instances of themselves when changed. The altered value will
therefore have to be explicitly set back to the entity and this will trigger the
onChange event.

## Enable, Disable and Destroy Entities

Setting an entity's 'enabled' property to false allows you to deactivate it.
This removes the entity from eco's entity list so it won't appear in any
iterator results

Unless you're storing your own reference to the entity, it will eventually be
garbage collected and permanently destroyed. If you do keep a reference then you
can just set the enabled property back to true to re-enable it at a later time.

```javascript
entity.enabled = false; // removes entity from eco
entity.enabled = true; // add entity back to eco

// You can still work with deactivated entities, but they won't invoke the
// eco.onChange callback. They operate as normal but in a detached state
entity.enabled = false;
entity.foo = "bar"; // will not invoke the eco.onChange method
entity.foo; // 'bar' - value is still set
```
