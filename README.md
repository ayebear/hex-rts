# Hex RTS
A fast-paced RTS game with minimal micro-management, and a hexagonal grid for placing structures to distribute energy. Unique unit and structure mechanics allow for varying strategies.

## About
This repository contains code for both the server and client. Currently this is a prototype to figure out the most fun game design.

### Libraries/frameworks
The client is written in JavaScript, and the server is written in [Go](https://golang.org/).

Client libraries:
* [Pixi.js](http://www.pixijs.com/)
* [CES.js](https://github.com/qiao/ces.js)
* [Howler.js](https://github.com/goldfire/howler.js/)
* [SockJS](https://github.com/sockjs/sockjs-client)
* [Mousetrap](https://craig.is/killing/mice)

Server libraries:
* [Gorilla websocket](http://www.gorillatoolkit.org/pkg/websocket)

## Gameplay Overview
There are already detailed design documents, which I may decide to share later. For now, here's an overview of what is planned.

### Units
Unlike a traditional RTS with various units that are mostly for doing damage, there's only one for that. There are three main units:

* Warriors: These do damage
* Mages: These passively provide abilities for nearby ally units
  * Some examples: Health regen, shields, and invisibility
* Hackers: These permanently convert enemy units to your side

These units naturally counter each other like this:

* Warrior > Hacker > Mage > Warrior

Note: There are no worker units.

### Structures
Unlike a traditional RTS with disconnected structures (buildings) that can be placed anywhere or in allowed regions, the way your structures are placed is very important.

Structures must receive enough energy in order to function. Adjacent structures distribute energy between them. Energy is produced from any structure that produces energy.

Creating structures cost metal, and take a certain amount of time to complete.

Walls can be built around structures, which will cover all six sides of the hexagonal area, and will take all damage before the surrounded structure will. Ally units can pass through these walls.

#### Structure Types

* Energy production: Generator, solar field, nuclear reactor
* Metal production: Mine, metal factory
* Research facility: Research and upgrades are done here
* Barracks: Creates any researched unit type
* Turret: Attacks nearby enemy units
* Stealth disabler: Temporarily uncovers enemy invisible units

### Economy
Unlike a traditional RTS with various discrete resource types, this game only has one: Metal. Too many games require multiple combinations of the resource types for creating units and doing upgrades. This creates an imbalance of your resources, so you will always have too much of one resource and not enough of another. These games typically solve this issue with some kind of resource conversion building to buy/sell resources for a loss.

These issues are solved by having each resource type completely devoted for different purposes (or just not requiring multiple resource types for anything). A resource just for creating units, or just for creating structures is fine, because you can fully utilize your resources without needing to convert anything.

#### Resource Types

* Metal
  * Discrete
  * Used for creating structures and units
  * Used for doing research and upgrades
* Energy
  * Continuous
  * Used to power all structures

### Upgrades
Unlike most RTS games that have some kind of a tech tree with dependencies, this game has a "flat" upgrade system. This means all upgrades are available from the beginning, and can be applied in any order you wish, as long as you have enough resources.

This allows for a huge number of strategies, whether it's simply focusing on upgrading attack damage, getting invisible units first, getting super-fast hackers, or building strong walls and turrets.

Almost every structure and unit can be upgraded, and they are all global, permanent, and apply to existing units/structures.

All upgrades are done at a research facility. Multiple research facilities can be built for getting upgrades in parallel.

All unit types and some structure types need to be "researched" (unlocked) first, before being able to make them.

Detailed information on all of the upgrades will be available later.

## Author
Eric Hebert
