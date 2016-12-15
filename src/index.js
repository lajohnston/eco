import { ComponentCollection } from './components/ComponentCollection';
import { Component } from './components/Component';
import { Eco } from './Eco';
import { Entity } from './entities/Entity';
import { IdFactory } from './entities/IdFactory';
import { Iterator } from './entities/Iterator';
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

function createEcoInstance() {
  const componentCollection = createComponentCollection();

  return new Eco(
    componentCollection,
    new IdFactory(1),
    createInstanceFactory(Entity),
    createInstanceFactory(Iterator)
  );
}

export default createEcoInstance;
