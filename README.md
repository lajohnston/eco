# Ecos Entity-Component-System microframework

Ecos is a lightweight, entity-component-system framework. Its purpose is to allow you to define your game data and logic using plain JavaScript organised into components and systems,
decoupled from both this framework and the game framework you wish to use with it.

## Components

Components are data structures. They don't need to contain any logic, so you can define them as simple objects containing default attributes and values:

    var ecos = new Ecos();
    ecos.components.add(
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

Entities are simply bags of components. Components can be added and removed at runtime allowing behaviour to be changed dynamically.

    ecos.entities.add({
        isPlayer: { value: true },
        position: { x: 0, y: 0 },
        vector: { x: 0, y: 0] },
        friction: { value: -1 },
        gravity: { value: -1 },
        health: { value: 5 }
    });

## Systems

Systems provide the logic. Each system defines what components it's interested in and only listens for entities that contain all of these components.

    var systems = ecos.systems('ingame');

    systems.add(
        'VectorMovement',           // the name of the system
        ['position', 'vector'],     // only listen for entities with both the 'position' and 'vector' components
        function (position, vector, entity) {
            /**
             * This callback is called for each matching entity, each update cycle.
             * Each entity's 'position' and 'vector' components are injected in for you
             * in the order you provided in the second argument
             */
            position.x += vector.getVectorX();
            position.y += vector.getVectorY();
        }
    );

    // This calls each system in turn, in the order they were registered
    systems.update();

You can group systems into named categories and update them independently:

    var logicSystems  = ecos.systems('logic');
    var renderSystems = ecos.systems('render');

    logicSystems.update();
    renderSystems.update();

A system's callback can of course be a method in a plain JavaScript class.

    var Counter = function () {
        this.counter = 0;
    }

    Counter.prototype.update = function (foo) {
        this.counter++;
        foo.frameCount = this.counter;
    }

    var counter = new Counter();
    ecos.systems('logic').add(
        'Counter',      // the name of the system
        ['foo'],        // listen for foo components
        counter.update  // the method to call for each matching entity
    );
