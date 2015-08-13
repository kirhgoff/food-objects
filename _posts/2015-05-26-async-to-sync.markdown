---
layout: post
title:  "Async to sync"
date:   2015-05-26 22:29:00
categories: dev java
---

I feel so silly posting this question, sure there is an obvious answer, but spent pair of hours trying to guess how to did this with no luck. Probably community will help.

My question: is there any standard mechnism in Java for converting async code to sync one. For example (from, surprisingly, real code), its in Scala, but my question about Java, think of this as of pseudocode (btw in Scala it wont work):

var finalWorld:WorldModel = null
LifeActors.run(world, new WorldModelListener {
  override def worldUpdated(world: WorldModel) = {
    finalWorld = world
  }
}, 3) //3 iterations
val alive = finalWorld.getElements.filter(_.isAlive)

I want to have something like this:

val superFuture = LifeActors.run(world, new WorldModelListener {
  override def worldUpdated(world: WorldModel) = {
    setSuperFutureValue(world)
  }
}, 3) //3 iterations
val alive = superFuture.getValue() //Blocks until is ready

I see that futures are used as running some process which returns result. My problem is that I dont want to use cumbersome variable which is accesed from another thread's scope. Is there something like future with a state? Or this is does not make sense at all?

   




