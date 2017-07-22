# Eco Entity Component Framework

Eco is an entity-component framework for JavaScript/HTML5 games that lets you
define your components and game logic as decoupled POJO/Vanilla JS.

You can use it as part of a custom game engine, and also as a glue layer to
keep your game logic decoupled from the game framework and libraries of your
choice. I currently use it alongside PIXI.js.

The framework is under development, but the API described below is feature
complete. I'm using this for personal projects and honing the API. Once the
API is refined I'll begin work on optimisation and performance.

## Overview

    // Define 'position' and movement 'vector' components, with default values
    var eco = new Eco();
    eco.addComponent('position', { x: 0, y: 0 });
    eco.addComponent('vector', { x: 0, y: 0 });

    // Create a system that will update each entity that has these components
    var movement = eco.system('position', 'vector', function (position, vector, entity) {
        // For each entity that has both a 'position' and a 'vector' component,
        // update entity position based on the movement vector
        position.x += vector.x;
        position.y += vector.y;
    });

    // Create an entity and add these components to it
    eco.entity()
        .add('position', { x: 100 })
        .add('vector',   { x: 1 });

    // In your game update loop
    movement.update();

## Components

Components are data structures, focussed more on data storage and retrieval than
game logic. The game logic can be handled by Systems, described later.

Eco lets you define multiple types using the eco.addComponent() method:

### Simple components

Defining a component with just a name creates a component that stores whatever
data is passed to it.

    eco.addComponent('foo');

    eco.entity()
        .add('foo', 'bar')
        .get('foo')                     // 'bar'

    eco.entity()
        .add('foo', { bar: 'baz' })
        .get('foo')                     // { bar: 'baz' }

### Factory components

Defining components with a function creates a factory component. When a
component is added to an entity, the data will be passed to the given
function and the returned data will be stored.

    // Create a class
    function Vector(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    // Define a factory component that returns an instance of the class
    eco.addComponent('vector', function (data) {
        return new Vector(data.x, data.y);
    });

    var entity = eco.entity()
        .add('vector', { x: 1, y: 0 });

    (entity.get('vector') instanceof Vector)  // true

### Object template components

Defining components with an object literal defines a default set of values.
When a component is added to an entity, the data is shallow merged into the
defaults and the result is stored.

    eco.addComponent('position', {
        x: 0,
        y: 0
    };

    var entity = eco.entity()
        .add('position', { x: 100 });

    entity.get('position').x    //  100
    entity.get('position').y    //  0

### Constant components

Defining a component with a primitive value (string, number, boolean) will
treat the value as a constant that is returned for all instances.

    eco.addComponent('foo', true);  // component value will always be true

    eco.entity()
        .add('foo')
        .get('foo')             // true

    eco.entity()
        .add('isPlayer', 'foo') // 'foo' will be ignored
        .get('isPlayer')        // true

## Entities

Entities are simply collections of components. Components can be added and
removed at runtime allowing behaviour to be changed dynamically.

    var entity = eco.entity()
        .add('position', { x: 0, y: 0 })
        .add('vector', { x: 0, y: 0 })
        .add('friction', { value: 1 })
        .add('health', { amount: 1 })
        .add('gravity', { value: 1 });

    // Add components
    entity.add('gravity');
    entity.has('gravity');      // true

    // Remove components
    entity.remove('gravity');
    entity.has('gravity');      // false

    // Get components
    entity.get('health').amount = 100;

    // Remove all components
    entity.removeAll();

    // Iterate through all components
    entity.forEach(function (data, componentName) {
        ...
    });

## Systems

Systems define your game logic and behaviour. Each system updates entities that
have a certain combination of components.

    // Create a system that will iterate through entities that contain a
    // 'position' component and a 'vector' component
    var movement = eco.system('position', 'vector', function (position, vector, entity) {
        /**
         * Each time the system's update() method is called, this callback will
         * run for each matching entity
         *
         * The relevant components for each entity are passed in for you, and
         * the entity itself is passed as the last argument
         */

        // Update entity position based on its movement vector values
        position.x += vector.getVectorX();
        position.y += vector.getVectorY();
    });

    // In your update loop
    movement.update();

You can also iterate through entities using filters:

    var fooBarFilter = eco.filter('foo', 'bar');

    fooBarFilter.each(function (entity) => {
        entity.has('foo'); // true
        entity.has('bar'); // true
    });

    // Get all entities that currently have at least one component
    var allEntities = eco.getEntities();
