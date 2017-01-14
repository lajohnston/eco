# Eco Entity Component Framework

Eco is an entity-component framework for JavaScript/HTML5 games that lets you
define your components and game logic as decoupled POJO objects and functions.
You can use it as part of a custom game engine, and also as a glue layer to
keep your game logic decoupled from the game framework and libraries of your
choice.

The framework is under development, but the API currently described below is
feature complete.

## Overview

    // Add position and movement vector components with default values
    eco.addComponent('position', { x: 0, y: 0 });
    eco.addComponent('vector', { x: 0, y: 0 });

    // Create an entity and add these components to it
    eco.entity()
        .add('position', { x: 100 })
        .add('vector',   { x: 1 });

    // In your game update loop
    eco.filter(['position', 'vector'], function (position, vector) {
        // For each entity that has both the 'position' and 'vector' components,
        // update entity position based on the movement vector
        position.x += vector.x;
        position.y += vector.y;
    });

## Components

Components are data structures that don't need to contain any logic. Eco lets
you define multiple types using the eco.addComponent() method:

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

    eco.addComponent('isPlayer', true);

    eco.entity()
        .add('isPlayer')
        .get('isPlayer')        // true

    eco.entity()
        .add('isPlayer', 'foo')
        .get('isPlayer')        // true (note: 'foo' was ignored)

## Entities

Entities are simply a collection of components. Components can be added and
removed at runtime allowing behaviour to be changed dynamically.

    var entity = eco.entity()
        .add('isPlayer')
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

    // Create an entity proxy for a given id
    eco.entity(123)
        .getId();   // 123

Note: Eco doesn't store entity instances, only component data for entity ids.
For convenience, the returned entity instances are proxy objects providing
methods to work with a given entity id, and so equality comparisons should
compare the ids rather than the proxy instances themselves.

    eco.entity(123) === eco.entity(123);                    // false
    eco.entity(123).getId() === eco.entity(123).getId();    // true

## Systems

Systems are your game logic and behaviour so it's up to you how you want to
implement them. Eco provides methods that let you iterate over entities
containing certain combinations of components.

    // Iterate through entities with 'position' and 'vector' components
    eco.filter(['position', 'vector'], function(position, vector, entity) {
        // Update entity position based on its movement vector values
        position.x += vector.getVectorX();
        position.y += vector.getVectorY();

        /**
         * This callback is called for each matching entity
         * The components for each entity are injected in for you
         *
         * The entity itself is passed as the last argument
         */
    });

    /**
     * Get an array of entities that have at least one component.
     * Eco only stores component data, so entities without any
     * components won't be returned
     */
    eco.getEntities();
