# Eco ECS (Entity Component System)

Eco is a lightweight, optimised, entity container for JavaScript/HTML5 games.
It can be used within a custom game engine, or as a glue layer to keep your
game logic decoupled from the game framework and libraries of your choice.

## Overview of the ECS pattern

As an alternative to defining hierarchical types for in-game entities
(such as "Player", "Enemy", "FlyingEnemy", "FlyingEnemyWithGun" ...), the ECS
pattern has you split the aspects into components (position, movement, canFly,
hasGun) and mix and match them. This allows you to assemble many variations
using the same component parts, and even allows components to be added or
removed to change entity behaviour at runtime.

* Components - data structures (position, movement, appearance etc.)
* Entities - in-game objects that have components
* Systems - logic that updates entities based on their components

## Basic usage

```javascript
const eco = new Eco();

// Define the component names
eco.defineComponents(["position", "movement"]);

// Create an entity. Add components using dot notation
const entity = eco.entity();
entity.position = { x: 100, y: 200 };
entity.movement = { x: 1, y: 0, speed: 2 };

/**
 * Create an interator for entities with position && movement components.
 * The iterator listens for changes and only updates when necessary
 */
const moveable = eco.iterator(["position", "movement"]);

// Your update function in the main loop
function update(delta) {
  moveable.forEach(entity => {
    entity.position.x += entity.movement.x * entity.movement.speed * delta;
    entity.position.y += entity.movement.y * entity.movement.speed * delta;
  });
}
```

## Entities

```javascript
// Create an empty entity
const entity = eco.entity();

// Add or replace components using standard dot notation
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

## Iterators

Iterators iterate over a subset of entities, similar to using Array.filter and
Array.forEach. They utilise caching to ensure the filtering step is only
performed when a relevant change has occured.

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
const eco = new Eco();

// Set the eco.onChange function
eco.onChange = (entity, componentName, newValue, oldValue) => {
  // this will be called whenever a component value is set
};

// The following examples will trigger the callback
entity.position = {}; // oldValue = undefined; newValue = {}
entity.position = undefined; // oldValue = {}; newValue = undefined

// ...but editing component properties will not
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
