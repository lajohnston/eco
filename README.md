# Ecos Entity-Component-System microframework

Ecos is a lightweight, entity-component-system framework. Its purpose is to allow you to define your game data and logic using plain JavaScript organised into components and systems,
decoupled from both this framework and the game framework you wish to use with it.

## Components

Components are data structures. They don't need to contain any logic, so you can define them as simple objects containing default attributes and values:

    var ecos = new Ecos();

    ecos.addComponent(
        'position',     // the name of the component
        {               // the component's default values
            x: 0,
            y: 0
        }
    );

Components can also be classes if you wish to add some data encapsulation and processing:

    var Vector = function (x, y, speed) {
        this.x = x || 0;
        this.y = y || 0;
        this.speed = speed || 1;
    }

    Vector.prototype.getVectorX = function () {
        return this.x * this.speed;
    }

    // The function will be called when the component is added to an entity
    ecos.components.add('vector', function (data) {
        return new Vector(data.x, data.y);
    });

## Entities

Entities are simply a collection of components. Components can be added and removed at runtime allowing behaviour to be changed dynamically.

    var entity = ecos.createEntity({
        isPlayer: { value: true },
        position: { x: 0, y: 0 },
        vector: { x: 0, y: 0] },
        friction: { value: -1 },
        gravity: { value: -1 }
    });

    // Add components
    entity.add('foo', { bar: 'baz' });

    // Remove components
    entity.remove('gravity');
    entity.has('gravity');      // false

    // Access components
    entity.get('health').amount = 100;

## Systems

Systems are where you define your game logic and behaviour. It's up to you how you want to write them, but Ecos provides efficient entity iterators to iterate
through relevant entities that contain a certain combination of components.

    // Create a iterator for all entities that have both a position and a vector component
    var moveableEntities = ecos.createIterator(['position', 'vector']);

    ...

    // In your update loop
    moveableEntities.each(function (position, vector, entity) {
        /**
         * This callback is called for each matching entity
         * The components for each entity are injected in the order you specified when creating the iterator (position, vector)
         * The entity itself is passed as the last argument
         */

        // Update entity position based on its movement vector values
        position.x += vector.getVectorX();
        position.y += vector.getVectorY();
    });

    // or you can use a while loop
    moveableEntities.reset();
    while (var entity = moveableEntities.next()) {

    }

    // or just get the array of entities
    var entities = moveableEntities.toArray();
