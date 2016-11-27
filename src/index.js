import { ComponentCollection } from './components/ComponentCollection';
import { Component } from './components/Component';
import { Ecos } from './Ecos';
import { EntityFactory } from './entities/EntityFactory';
import { Entity } from './entities/Entity';
import { NullComponent } from './components/NullComponent';

function createInstanceFactory(Newable) {
  return {
    create(...args) {
      return new Newable(...args);
    },
  };
}

function createComponentCollection() {
  const collection = new ComponentCollection(
    createInstanceFactory(Component)
  );

  collection.setNullObject(new NullComponent());

  return collection;
}

function createEntityFactory(componentCollection) {
  return new EntityFactory(
    createInstanceFactory(Entity),
    componentCollection || createComponentCollection()
  );
}

function createEcosInstance() {
  const componentCollection = createComponentCollection();

  return new Ecos(
    createEntityFactory(componentCollection),
    componentCollection
  );
}

export default createEcosInstance;
