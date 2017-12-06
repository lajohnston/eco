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
* Systems - logic that update entities

## Basic usage

```javascript
// Define component factory functions. These ones just return plain objects
const eco = new Eco();
eco.component("position", (x, y) => ({ x, y }));
eco.component("movement", (vecX, vecY, speed) => ({ vecX, vecY, speed }));

// Create an entity
eco
  .entity()
  .add("position", 100, 200) // the additional args are passed to the factories
  .add("movement", 1, 0, 2);

// Create a system that will update entity movement
const updateMovement = eco.system(
  ["position", "movement"], // filter only entities with these components
  ({ position, movement }, customArg1) => { // args are passed after the entity
    // Will update each entity's position by its movement vector
    position.x += movement.vecX * movement.speed;
    position.y += movement.vecY * movement.speed;
  })
);

// Your update function
window.requestAnimationFrame(() => {
  updateMovement(); // you can pass any number of custome arguments
});
```

The updateMovement system maintains a cached list of relevant entities and only
re-evaluates when it needs to. This can provide a significant speed advantage
versus a native Array.filter and Array.forEach solution if there are many
entities.

## Entities

```javascript
const eco = new Eco();
eco.component("position", (x, y) => ({ x, y }));

const entity = eco.entity();

entity.add("position", 100, 200);
entity.has("position"); // true
entity.position.x; // 100
entity.position.y; // 200

entity.remove("position");
entity.has("position"); // false
entity.position; // undefined

entity.removeAll();
```

## Filters

Filters maintain a cached subset of entities that match a given criteria. They
are used internally by eco.system(), but you can use them directly if you wish.

```javascript
// Simple array syntax
const fooBar = eco.createFilter(["foo", "bar"]);
fooBarEntities.forEach((entity) => {
  entity.has('foo'); // true
  entity.has('bar'); // true
});

// You can also provide a standard filter function
const fooNoBar = eco.createFilter((entity) => entity.has('foo') && !entity.has('bar')));
fooNoBar.forEach((entity) => {
  entity.has('foo'); // true
  entity.has('bar'); // false
});
```

## Events

Eco provides a basic callback system to notify you each time a component is
added, removed, or set to an entity.

```javascript
const eco = new Eco();

// Set the eco.onComponent function
eco.onChange = (entity, componentName, newValue, oldValue) => {
  // this will be called whenever a change occurs
};
```
