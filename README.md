# Eco Entity Component System

Eco is a lightweight, optimised, entity-component-system framework for
JavaScript/HTML5 games that lets you define your components and game logic as
decoupled POJO/Vanilla JS. The API described below is in development, but a
fully functional earlier version is available under the releases tab.

You can use Eco as part of a custom game engine, or as a glue layer to keep your
game logic decoupled from the game framework and libraries of your choice.

## Overview

In the ECS design pattern, in-game objects aren't identified by a hierarchical
type (such as "Player", "Enemy", "FlyingEnemy", "FlyingEnemyWithGun" ...), but
rather by what components they possess. This allows you to assemble many
variations using the same component parts, and even allows components to be
added or removed at runtime to change entity behaviour on the fly.

* Components - data structures (position, movement, appearance etc.)
* Entities - objects with components
* Systems - logic that updates entities

## Basic usage

```javascript
// Define the component names
const eco = new Eco();
eco.defineComponents(['position', 'movement']);

// Create an entity and add components using dot notation
const entity = eco.entity();
entity.position = { x: 100, y: 200 };
entity.movement = { x: 1, y: 0, speed: 2 };

// Create a 'system' to update entity movement
const updateMovement = eco.system(
  ["position", "movement"], // filter only entities with these components
  ({ position, movement }, delta) => { // args are passed after the entity
    position.x += movement.x * movement.speed * delta;
    position.y += movement.y * movement.speed * delta;
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

// Create an empty entity
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
using Array.filter and Array.forEach. They utilise caching to ensure the
filtering step is only performed when a relevant change has occured, so to make
use of this it's therefore best to create them at the setup stage and call them
within the update loop.

### Systems

Provide the filter criteria as the first argument, and the forEach update
function as the second.

```javascript
const updateMovement = eco.system(["position", "movement"], entity => {
  entity.has("position"); // true
  entity.has("movement"); // true
});

// In the main loop
updateMovement(); // updates all relevant entities
```

If you provide three arguments, the second one acts as a filter function, and
the third acts as the forEach.

```javascript
const fooNoBar = eco.system(
  ['foo', 'bar'] // the components it is concerned with
  (entity) => entity.has('foo') && !entity.has('bar') // custom filter function,
  (entity) => {
    // will run for all entities that have foo, but not bar
  }
);

fooNoBar();
```

### Filters

Systems provide a convenient wrapper around filters, but if you need more
control you can use filters directly.

```javascript
// Filter only entities which have foo AND bar components
const fooBar = eco.createFilter(["foo", "bar"]);
fooBar.forEach(entity => {
  entity.has("foo"); // true
  entity.has("bar"); // true
});

/**
 * An optional second parameter lets you specify a custom filter function. You
 * must still provide the array of components as the first argument as this is
 * used by the caching system to determine what changes are relevant to it
 */
const fooNoBar = eco.createFilter(
  ["foo", "bar"], // relevant components
  entity => entity.has("foo") && !entity.has("bar")
);

fooNoBar.forEach(entity => {
  entity.has("foo"); // true
  entity.has("bar"); // false
});
```

## Callbacks

Eco provides a basic callback system that it calls each time a component value
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
This removes the entity from eco's entity list so it won't appear in any filter
or system results.

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
