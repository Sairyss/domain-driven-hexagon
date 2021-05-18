_**This repo is work in progress**_

# Domain-Driven Hexagon

Main emphasis of this project is to provide recommendations on how to design software applications. In this readme are presented some of the techniques, tools, best practices, architectural patterns and guidelines gathered from different sources.

**Everything below should be seen as a recommendation**. Keep in mind that different projects have different requirements, so any pattern mentioned in this readme can be replaced or skipped if needed.

Code examples are written using [NodeJS](https://nodejs.org/en/), [TypeScript](https://www.typescriptlang.org/), [NestJS](https://docs.nestjs.com/) framework and [Typeorm](https://www.npmjs.com/package/typeorm) for the database access.

Though patterns and principles presented here are **framework/language agnostic**, so above technologies can be easily replaced with any alternative. No matter what language or framework is used, any application can benefit from principles described below.

**Note**: code examples are adapted to TypeScript and mentioned above frameworks so may not fit well for other languages. Also remember that code examples presented here are just examples and must be changed according to project's needs or personal preference.

## Table of Contents

- [Architecture](#Architecture)

  - [Diagram](#Diagram)
  - [Modules](#Modules)
  - [Application Core](#Application-Core)
  - [Application layer](#Application-layer)
    - [Application Services](#Application-Services)
    - [Commands and Queries](#Commands-and-Queries)
    - [Ports](#Ports)
  - [Domain Layer](#Domain-Layer)
    - [Entities](#Entities)
    - [Aggregates](#Aggregates)
    - [Domain Events](#Domain-Events)
    - [Domain Services](#Domain-Services)
    - [Value Objects](#Value-Objects)
    - [Enforcing invariants of Domain Objects](#Enforcing-invariants-of-Domain-Objects)
    - [Using libraries inside application's core](#Using-libraries-inside-applications-core)
  - [Interface Adapters](#Interface-Adapters)
    - [Controllers](#Controllers)
    - [DTOs](#DTOs)
  - [Infrastructure](#Infrastructure)
    - [Adapters](#Adapters)
    - [Repositories](#Repositories)
    - [Persistence models](#Persistence-models)
    - [Other things that can be a part of Infrastructure layer](#Other-things-that-can-be-a-part-of-Infrastructure-layer)
  - [Recommendations for smaller APIs](#Recommendations-for-smaller-APIs)
  - [General recommendations on architectures, best practices, design patterns and principles](#General-recommendations-on-architectures-best-practices-design-patterns-and-principles)

- [Other recommendations and best practices](#Other-recommendations-and-best-practices)

  - [Error Handling](#Error-Handling)
  - [Testing](#Testing)
    - [Load Testing](#Load-Testing)
    - [Fuzz Testing](#Fuzz-Testing)
  - [Configuration](#Configuration)
  - [Logging](#Logging)
  - [Health monitoring](#Health-monitoring)
  - [Folder and File Structure](#Folder-and-File-Structure)
  - [File names](#File-names)
  - [Static Code Analysis](#Static-Code-Analysis)
  - [Code formatting](#Code-formatting)
  - [Documentation](#Documentation)
  - [Make application easy to setup](#Make-application-easy-to-setup)
  - [Seeds](#Seeds)
  - [Migrations](#Migrations)
  - [Rate Limiting](#Rate-Limiting)
  - [Code Generation](#Code-Generation)
  - [Custom utility types](#Custom-utility-types)
  - [Pre-push/pre-commit hooks](#Pre-pushpre-commit-hooks)
  - [Prevent massive inheritance chains](#Prevent-massive-inheritance-chains)
  - [Conventional commits](#Conventional-commits)

- [Additional resources](#Additional-resources)
  - [Articles](#Articles)
  - [Repositories](#Repositories)
  - [Documentation](#Documentation)
  - [Blogs](#Blogs)
  - [Videos](#Videos)
  - [Books](#Books)

# Architecture

Mainly based on:

- [Domain-Driven Design (DDD)](https://en.wikipedia.org/wiki/Domain-driven_design)
- [Hexagonal (Ports and Adapters) Architecture ](https://blog.octo.com/en/hexagonal-architecture-three-principles-and-an-implementation-example/)
- [Secure by Design](https://www.manning.com/books/secure-by-design)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Onion Architecture](https://herbertograca.com/2017/09/21/onion-architecture/)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Software Design Patterns](https://refactoring.guru/design-patterns/what-is-pattern)

And many other sources (more links below in every chapter).

Before we begin, here are the PROS and CONS of using a complete architecture like this:

## Pros:

- Independent of external frameworks, technologies, databases, etc. Frameworks and external resources can be plugged/unplugged with much less effort.
- Easily testable and scalable.
- More secure. Some security principles are baked in design itself.
- The solution can be worked on and maintained by different teams, without stepping on each other's toes.
- Easier to add new features. As the system grows over time, the difficulty in adding new features remains constant and relatively small.
- If the solution is properly broken apart along [bounded context](https://martinfowler.com/bliki/BoundedContext.html) lines, it becomes easy to convert pieces of it into microservices if needed.

## Cons:

- This is a sophisticated architecture which requires a firm understanding of quality software principles, such as SOLID, Clean/Hexagonal Architecture, Domain-Driven Design, etc. Any team implementing such a solution will almost certainly require an expert to drive the solution and keep it from evolving the wrong way and accumulating technical debt.

- Some of the practices presented here are not recommended for small-medium sized applications with not a lot of business logic. There is added up-front complexity to support all those building blocks and layers, boilerplate code, abstractions, data mapping etc. thus implementing a complete architecture like this is generally ill-suited to simple [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) applications and could over-complicate such solutions. Some of the described below principles can be used in a smaller sized applications but must be implemented only after analyzing and understanding all pros and cons.

# Diagram

![Domain-Driven Hexagon](assets/images/DomainDrivenHexagon.png)
<sup>Diagram is mostly based on [this one](https://github.com/hgraca/explicit-architecture-php#explicit-architecture-1) + others found online</sup>

In short, data flow looks like this (from left to right):

- Request/CLI command/event is sent to the controller using plain DTO;
- Controller parses this DTO, maps it to a Command/Query object format and passes it to a Application service;
- Application service handles this Command/Query; it executes business logic using domain services and/or entities and uses the infrastructure layer through ports;
- Infrastructure layer uses a mapper to convert data to format that it needs, uses repositories to fetch/persist data and adapters to send events or do other I/O communications, maps data back to domain format and returns it back to Application service;
- After application service finishes doing it's job, it returns data/confirmation back to Controllers;
- Controllers return data back to the user (if application has presenters/views, those are returned instead).

Each layer is in charge of it's own logic and has building blocks that usually should follow a [Single-responsibility principle](https://en.wikipedia.org/wiki/Single-responsibility_principle) when possible and when it makes sense (for example, using `Repositories` only for database access, using `Entities` for business logic etc).

**Keep in mind** that different projects can have more or less steps/layers/building blocks than described here. Add more if application requires it, and skip some if application is not that complex and doesn't need all that abstraction.

General recommendation for any project: analyze how big/complex the application will be, find a compromise and use as many layers/building blocks as needed for the project and skip ones that may over-complicate things.

More in details on each step below.

# Modules

This project's code examples use separation by modules (also called components). Each module gets its own folder with a dedicated codebase, and each use case inside that module gets it's own folder to store most of the things it needs (this is also called _Vertical Slicing_).

It is easier to work on things that change together if those things are gathered relatively close to each other. Try not to create dependencies between modules or use cases, move shared logic into a separate files and make both depend on that instead of depending on each other.

Try to make every module independent and keep interactions between modules minimal. Think of each module as a mini application bounded by a single context. Try to avoid direct imports between modules (like importing a service from other domain) since this creates [tight coupling](<https://en.wikipedia.org/wiki/Coupling_(computer_programming)>). Communication between modules can be done using events, public interfaces or through a port/adapter (more on that topic below).

This approach ensures [loose coupling](https://en.wikipedia.org/wiki/Loose_coupling), and, if bounded contexts are defined and designed properly, each module can be easily separated into a microservice if needed without touching any domain logic.

Read more about modular programming benefits:

- [Modular programming: Beyond the spaghetti mess](https://www.tiny.cloud/blog/modular-programming-principle/).

Each module is separated in layers described below.

# Application Core

This is the core of the system which is built using [DDD building blocks](https://dzone.com/articles/ddd-part-ii-ddd-building-blocks):

### Domain layer:

- Entities
- Aggregates
- Domain Services
- Value Objects

### Application layer:

- Application Services
- Commands and Queries
- Ports

_More building blocks may be added if needed._

---

# Application layer

## Application Services

Are also called "Workflow Services", "User Cases", "Interactors" etc.
These services orchestrate the steps required to fulfill the commands imposed by the client.

- Typically used to orchestrate how the outside world interacts with your application and performs tasks required by the end users.
- Contain no domain-specific business logic;
- Operate on scalar types, transforming them into Domain types. A scalar type can be considered any type that's unknown to the Domain Model. This includes primitive types and types that don't belong to the Domain.
- Application services declare dependencies on infrastructural services required to execute domain logic (by using ports).
- Are used in order to fetch domain `Entities` (or anything else) from database/outside world through ports;
- Execute other out-of-process communications through `Ports` (like event emits, sending emails etc);
- In case of interacting with one Entity/Aggregate, executes its methods directly;
- In case of working with multiple Entities/Aggregates, uses a `Domain Service` to orchestrate them;
- Are basically a `Command`/`Query` handlers;
- Should not depend on other application services since it may cause problems (like cyclic dependencies);

One service per use case is considered a good practice.

<details>
<summary>What are "Use Cases"?</summary>

[wiki](https://en.wikipedia.org/wiki/Use_case):

> In software and systems engineering, a use case is a list of actions or event steps typically defining the interactions between a role (known in the Unified Modeling Language as an actor) and a system to achieve a goal.

Use cases are, simply said, list of actions required from an application.

---

</details>

Example file: [create-user.service.ts](src/modules/user/use-cases/create-user/create-user.service.ts)

More about services:

- [Domain-Application-Infrastructure Services pattern](https://badia-kharroubi.gitbooks.io/microservices-architecture/content/patterns/tactical-patterns/domain-application-infrastructure-services-pattern.html)
- [Services in DDD finally explained](https://developer20.com/services-in-ddd-finally-explained/)

<details>
<summary>Notes: Interfaces for each Use Case and Local DTOs</summary>

### Interfaces for each use case

Some people prefer having an interface for each use case (Driving Port), which `Application Service` implements and a `Controller` depends on. This is a viable option, but this project doesn't use interfaces for every use case for simplicity: it makes sense using interfaces when there are **multiple** implementations of a workflow, but use cases are too specific and should not have multiple implementations of the same workflow (**one** service per use case rule mentioned above). `Controllers` naturally depend on a concrete implementation thus making interfaces redundant. More on this topic [here](https://stackoverflow.com/questions/62818105/interface-for-use-cases-application-services).

### Local DTOs

Another thing that can be seen in some projects is local DTOs. Some people prefer never to use domain objects (like entities) outside of core (in `controllers`, for example), and are using DTOs instead. This project doesn't use this technique to avoid extra interfaces and data mapping. Either to use local DTOs or not is a matter of taste.

[Here](https://martinfowler.com/bliki/LocalDTO.html) are Martin Fowler's thoughts on local DTOs, in short (quote):

> Some people argue for them(DTOs) as part of a Service Layer API because they ensure that service layer clients aren't dependent upon an underlying Domain Model. While that may be handy, I don't think it's worth the cost of all of that data mapping.

</details>

---

## Commands and Queries

This principle is called [Command–Query Separation(CQS)](https://en.wikipedia.org/wiki/Command%E2%80%93query_separation). When possible, methods should be separated into `Commands` (state-changing operations) and `Queries` (data-retrieval operations). To make a clear distinction between those two types of operations, input objects can be represented as `Commands` and `Queries`. Before DTO reaches the domain, it is converted into a `Command`/`Query` object.

### Commands

- `Commands` are used for state-changing actions, like creating new user and saving it to the database. Create, Update and Delete operations are considered as state-changing.

Data retrieval is responsibility of `Queries`, so `Command` methods should not return anything. There are some options on how to achieve this:

- Letting consumer of a command generate a [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier) on a client-side (more info here: [CQS versus server generated IDs](https://blog.ploeh.dk/2014/08/11/cqs-versus-server-generated-ids/));
- Returning some kind of a redirect location instead of creating a new resource on POST request (described here: [CQRS and REST: the perfect match](https://lostechies.com/jimmybogard/2016/06/01/cqrs-and-rest-the-perfect-match/)).

Though, violating a `Command` CQS rule and returning a bare minimum (like `ID` of created item or a confirmation message) may simplify things for most APIs.

**Note**: `Command` has nothing to do with [Command Pattern](https://refactoring.guru/design-patterns/command), it is just a convenient name to represent that this object invokes a CQS Command. Both `Commands` and `Queries` in this example are just simple objects with data.

Example of command object: [create-user.command.ts](src/modules/user/use-cases/create-user/create-user.command.ts)

### Queries

- `Query` is used for retrieving data and should not make any state changes (like writes to the database, files etc).

Queries are usually just a data retrieval operation and have no business logic involved; so, if needed, application and domain layers can be bypassed completely. Though, if some additional non-state changing logic has to be applied before returning a query response (like calculating something), it should be done in a corresponding application service.

Example of query bypassing application/domain layers completely: [find-user-by-email.http.controller.ts](src/modules/user/use-cases/find-user-by-email/find-user-by-email.http.controller.ts)

---

**Note**: Some simple cases may not need a `Command`/`Query` object, like find query or delete command may only need an ID so there is no point in creating an object for that.

Read more about CQS:

- [Martin Fowler blog](https://martinfowler.com/bliki/CommandQuerySeparation.html)
- [Command Query Segregation](https://khalilstemmler.com/articles/oop-design-principles/command-query-segregation/).
- [Exposing CQRS Through a RESTful API](https://www.infoq.com/articles/rest-api-on-cqrs/)

---

## Ports

Ports (for Driven Adapters) are interfaces that define contracts which must be implemented by infrastructure adapters in order to execute some action more related to technology details rather than business logic. Ports act like abstractions for technology details that business logic does not care about.

In Application Core **dependencies point inwards**. Outer layers can depend on inner layers, but inner layers never depend on outer layers. Application Core shouldn't depend on frameworks or access external resources directly. Any external calls to out-of-process resources/retrieval of data from remote processes should be done through `ports` (interfaces), with class implementations created somewhere in infrastructure layer and injected into application's core ([Dependency Injection](https://en.wikipedia.org/wiki/Dependency_injection) and [Dependency Inversion](https://en.wikipedia.org/wiki/Dependency_inversion_principle)). This makes business logic independent of technology, facilitates testing, allows to plug/unplug/swap any external resources easily making application modular and [loosely coupled](https://en.wikipedia.org/wiki/Loose_coupling).

- Ports are basically just interfaces that define what has to be done and don't care about how it is done.
- Ports can be created to abstract I/O operations, technology details, invasive libraries, legacy code etc. from the Domain.
- Ports should be created to fit the Domain needs, not simply mimic the tools APIs.
- Mock implementations can be passed to ports while testing. Mocking makes your tests faster and independent from the environment.
- When designing ports, remember about [Interface segregation principle](https://en.wikipedia.org/wiki/Interface_segregation_principle). Split large interfaces into a smaller ones when it makes sense, but also keep in mind to not overdo it when not necessary.
- Ports can also help to delay decisions. Domain layer can be implemented before even deciding what technologies (frameworks, database etc) will be used.

**Note**: since most ports implementations are injected and executed in application service, Application Layer can be a good place to keep those ports. But there are times when Domain Layer's business logic depends on executing some external resource, in that case those ports can be put in a Domain Layer.

**Note**: creating ports in smaller applications/APIs may overcomplicate such solutions by adding unnecessary abstractions. Using concrete implementations directly instead of ports may be enough in such applications. Consider all pros and cons before using this pattern.

Example files:

- [repository.ports.ts](src/core/ports/repository.ports.ts)
- [logger.port.ts](src/core/ports/logger.port.ts)

---

# Domain Layer

This layer contains application's business rules.

Domain should only operate using domain objects, most important ones are described below.

## Entities

Entities are the core of the domain. They encapsulate Enterprise wide business rules and attributes. An entity can be an object with properties and methods, or it can be a set of data structures and functions.

Entities represent business models and express what properties a particular model has, what it can do, when and at what conditions it can do it. An example of business model can be a User, Product, Booking, Ticket, Wallet etc.

Entities must always protect it's [invariant](https://en.wikipedia.org/wiki/Class_invariant):

> Domain entities should always be valid entities. There are a certain number of invariants for an object that should always be true. For example, an order item object always has to have a quantity that must be a positive integer, plus an article name and price. Therefore, invariants enforcement is the responsibility of the domain entities (especially of the aggregate root) and an entity object should not be able to exist without being valid.

Entities:

- Contain Domain business logic. Avoid having business logic in your services when possible, this leads to [Anemic Domain Model](https://martinfowler.com/bliki/AnemicDomainModel.html) (domain services are exception for business logic that can't be put in a single entity).
- Have an identity that defines it and makes it distinguishable from others. It's identity is consistent during its life cycle.
- Equality between two entities is determined by comparing their identificators (usually its `id` field).
- Can contain other objects, such as other entities or value objects.
- Are responsible for collecting all the understanding of state and how it changes in the same place.
- Responsible for the coordination of operations on the objects it owns.
- Know nothing about upper layers (services, controllers etc).
- Domain entities data should be modelled to accommodate business logic, not some database schema.
- Entities must protect their invariants, try to avoid public setters - update state using methods and execute invariant validation on each update if needed (this can be a simple `validate()` method that checks if business rules are not violated by update).
- Must be consistent on creation. Validate Entities and other domain objects on creation and throw an error on first failure. [Fail Fast](https://en.wikipedia.org/wiki/Fail-fast).
- Avoid no-arg (empty) constructors, accept and validate all required properties through a constructor.
- For optional properties that require some complex setting up, [Fluent interface](https://en.wikipedia.org/wiki/Fluent_interface) and [Builder Pattern](https://refactoring.guru/design-patterns/builder) can be used.
- Make Entities partially immutable. Identify what properties shouldn't change after creation and make them `readonly` (for example `id` or `createdAt`).

**Note**: A lof of people tend to create one module per entity, but this approach is not very good. Each module may have multiple entities. One thing to keep in mind is that putting entities in a single module requires those entities to have related business logic, don't group unrelated entities in one module.

Example files:

- [user.entity.ts](src/modules/user/domain/entities/user.entity.ts)

Read more:

- [Domain Entity pattern](https://badia-kharroubi.gitbooks.io/microservices-architecture/content/patterns/tactical-patterns/domain-entity-pattern.html)
- [Secure by design: Chapter 6 Ensuring integrity of state](https://livebook.manning.com/book/secure-by-design/chapter-6/)

---

## Aggregates

[Aggregate](https://martinfowler.com/bliki/DDD_Aggregate.html) is a cluster of domain objects that can be treated as a single unit. It encapsulates entities and value objects which conceptually belong together. It also contains a set of operations which those domain objects can be operated on.

- Aggregates help to simplify the domain model by gathering multiple domain objects under a single abstraction.
- Aggregates should not be influenced by data model. Associations between domain objects are not the same as database relationships.
- Aggregate root is an entity that contains other entities/value objects and all logic to operate them.
- Aggregate root has global identity. Entities inside the boundary have local identity, unique only within the Aggregate.
- Aggregate root is a gateway to entire aggregate. Any references from outside the aggregate should **only** go to the aggregate root.
- Any operations on an aggregate must be [transactional operations](https://en.wikipedia.org/wiki/Database_transaction). Either everything gets saved/updated/deleted or nothing.
- Only Aggregate Roots can be obtained directly with database queries. Everything else must be done through traversal.
- Similar to `Entities`, aggregates must protect their invariants through entire lifecycle. When a change to any object within the Aggregate boundary is committed, all invariants of the whole Aggregate must be satisfied. Simply said, all objects in an aggregate must be consistent, meaning that if one object inside an aggregate changes state, this shouldn't conflict with other domain objects inside this aggregate (this is called _Consistency Boundary_).
- Objects within the Aggregate can hold references to other Aggregate roots. Prefer references to external aggregates only by their globally unique identity, not by holding a direct object reference.
- Try to avoid aggregates that are too big, this can lead to performance and maintaining problems.
- Aggregates can publish `Domain Events` (more on that below).

All of this rules just come from the idea of creating a boundary around Aggregates. The boundary simplifies business model, as it forces us to consider each relationship very carefully, and within a well-defined set of rules.

Example files:

- [aggregate-root.base.ts](src/core/base-classes/aggregate-root.base.ts) - abstract base class.
- [user.entity.ts](src/modules/user/domain/entities/user.entity.ts) - aggregate implementations are similar to `Entities`, with some additional rules described above.

Read more:

- [Understanding Aggregates in Domain-Driven Design](https://dzone.com/articles/domain-driven-design-aggregate)
- [What Are Aggregates In Domain-Driven Design?](https://www.jamesmichaelhickey.com/domain-driven-design-aggregates/) <- this is a series of multiple articles, don't forget to click "Next article" at the end.
- [Effective Aggregate Design Part I: Modeling a Single Aggregate](https://www.dddcommunity.org/wp-content/uploads/files/pdf_articles/Vernon_2011_1.pdf)
- [Effective Aggregate Design Part II: Making Aggregates Work Together](https://www.dddcommunity.org/wp-content/uploads/files/pdf_articles/Vernon_2011_2.pdf)

---

## Domain Events

Domain event indicates that something happened in a domain that you want other parts of the same domain (in-process) to be aware of.

For example, if a user buys something, you may want to:

- Send confirmation email to that user;
- Send notification to a corporate slack channel;
- Notify shipping department;
- Perform other side effects that are not concern of an original buy operation domain.

Typical approach that is usually used involves executing all this logic in a service that performs a buy operation. But this creates coupling between different subdomains.

A better approach would be publishing a `Domain Event`. Any side effect operations can be performed just by subscribing to a concrete `Domain Event` and creating as many event handlers as needed, without glueing any unrelated code to original domain's service that sends an event.

Domain events are just messages pushed to a domain event dispatcher in the same process. Out-of-process communications (like microservices) are called [Integration Events](https://arleypadua.medium.com/domain-events-vs-integration-events-5eb29a34fdbc). If sending a Domain Event to external process is needed then domain event handler should send an `Integration Event`.

Domain Events may be useful for creating an [audit log](https://en.wikipedia.org/wiki/Audit_trail) to track all changes to important entities by saving each event to the database. Read more on why audit logs may be useful: [Why soft deletes are evil and what to do instead](https://jameshalsall.co.uk/posts/why-soft-deletes-are-evil-and-what-to-do-instead).

There may be different ways on implementing Domain Events, for example using some kind of internal event bus/emitter, like [Event Emitter](https://www.tutorialspoint.com/nodejs/nodejs_event_emitter.htm), or using patterns like [Mediator](https://refactoring.guru/design-patterns/mediator) or slightly modified [Observer](https://refactoring.guru/design-patterns/observer).

Examples:

- [domain-events.ts](src/core/domain-events/domain-events.ts) - this class is responsible for providing publish/subscribe functionality for anyone who needs to emit or listen to events.
- [user-created.domain-event.ts](src/modules/user/domain/events/user-created.domain-event.ts) - simple object that holds data related to published event.
- [user-created.event-handler.ts](src/modules/domain-event-handlers/user-created.event-handler.ts) - this is an example of Domain Event Handler that executes actions and side-effects when a domain event is raised (in this case, user is created). Domain event handlers belong to Application layer.
- [typeorm.repository.base.ts](src/infrastructure/database/base-classes/typeorm.repository.base.ts) - repository publishes all events for execution right before or right after persisting transaction.

Events can be published right before or right after insert/update/delete transaction, chose any option that is better for a particular project:

- Before: to make side-effects part of that transaction. If any event fails all changes should be reverted.
- After: to persist transaction even if some event fails. This makes side-effects independent, but in that case [eventual consistency](https://en.wikipedia.org/wiki/Eventual_consistency) should be implemented.

Both options have pros and cons.

**Note**: this project uses custom implementation for Domain Events. Reason for not using [Node Event Emitter](https://nodejs.org/api/events.html) is that event emitter executes events immediately when called instead of when we want it (before/after transaction), and also has no option to `await` for all events to finish, which might be useful when making those events a part of transaction.

To have a better understanding on domain events and implementation read this:

- [Domain Event pattern](https://badia-kharroubi.gitbooks.io/microservices-architecture/content/patterns/tactical-patterns/domain-event-pattern.html)
- [Domain events: design and implementation](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/domain-events-design-implementation)

For integration events in distributed systems here are some patterns that may be useful in some cases:

- [The Outbox Pattern](https://www.kamilgrzybek.com/design/the-outbox-pattern/)
- [Event Sourcing pattern](https://docs.microsoft.com/en-us/azure/architecture/patterns/event-sourcing)

---

## Domain Services

Eric Evans, Domain-Driven Design:

> Domain services are used for "a significant process or transformation in the domain that is not a natural responsibility of an ENTITY or VALUE OBJECT"

- Domain Service is a specific type of domain layer class that is used to execute domain logic that relies on two or more `Entities`.
- Domain Services are used when putting the logic on a particular `Entity` would break encapsulation and require the `Entity` to know about things it really shouldn't be concerned with.
- Domain services are very granular where as application services are a facade purposed with providing an API.
- Domain services operate only on types belonging to the Domain. They contain meaningful concepts that can be found within the Ubiquitous Language. They hold operations that don't fit well into Value Objects or Entities.

---

## Value objects

Some Attributes and behaviors can be moved out of the entity itself and put into `Value Objects`.

Value Objects:

- Have no identity. Equality is determined through structural property.
- Are immutable.
- Can be used as an attribute of `entities` and other `value objects`.
- Explicitly defines and enforces important constraints (invariants).

Value object shouldn’t be just a convenient grouping of attributes but should form a well-defined concept in the domain model. This is true even if it contains only one attribute. When modeled as a conceptual whole, it carries meaning when passed around, and it can uphold its constraints.

Imagine you have a `User` entity which needs to have an `address` of a user. Usually an address is simply a complex value that has no identity in the domain and is composed of multiple other values, like `country`, `street`, `postalCode` etc; so it can be modeled and treated as a `Value Object` with it's own business logic.

`Value object` isn’t just a data structure that holds values. It can also encapsulate logic associated with the concept it represents.

Example files:

- [address.value-object.ts](src/modules/user/domain/value-objects/address.value-object.ts)

Read more about Value Objects:

- [Martin Fowler blog](https://martinfowler.com/bliki/ValueObject.html)
- [Value Objects to the rescue](https://medium.com/swlh/value-objects-to-the-rescue-28c563ad97c6).
- [Value Object pattern](https://badia-kharroubi.gitbooks.io/microservices-architecture/content/patterns/tactical-patterns/value-object-pattern.html)

## Enforcing invariants of Domain Objects

### Replacing primitives with Value Objects

Most of the code bases operate on primitive types – `strings`, `numbers` etc. In the Domain Model, this level of abstraction may be too low.

Significant business concepts can be expressed using specific types and classes. `Value Objects` can be used instead primitives to avoid [primitives obsession](https://refactoring.guru/smells/primitive-obsession).
So, for example, `email` of type `string`:

```typescript
email: string;
```

could be represented as a `Value Object` instead:

```typescript
email: Email;
```

Now the only way to make an `email` is to create a new instance of `Email` class first, this ensures it will be validated on creation and a wrong value won't get into `Entities`.

Also an important behavior of the domain primitive is encapsulated in one place. By having the domain primitive own and control domain operations, you reduce the risk of bugs caused by lack of detailed domain knowledge of the concepts involved in the operation.

Creating an object for primitive values may be cumbersome, but it somewhat forces a developer to study domain more in details instead of just throwing a primitive type without even thinking what that value represents in domain.

Using `Value Objects` for primitive types is also called a `domain primitive`. The concept and naming are proposed in the book ["Secure by Design"](https://www.manning.com/books/secure-by-design).

Using `Value Objects` instead of primitives:

- Makes code easier to understand by using [ubiquitous language](https://martinfowler.com/bliki/UbiquitousLanguage.html) instead of just `string`.
- Improves security by ensuring invariants of every property.
- Encapsulates specific business rules associated with a value.

Also an alternative for creating an object may be a [type alias](https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-aliases) just to give this primitive a semantic meaning.

Example files:

- [email.value-object.ts](src/modules/user/domain/value-objects/email.value-object.ts)

Recommended to read:

- [Primitive Obsession — A Code Smell that Hurts People the Most](https://medium.com/the-sixt-india-blog/primitive-obsession-code-smell-that-hurt-people-the-most-5cbdd70496e9)
- [Value Objects Like a Pro](https://medium.com/@nicolopigna/value-objects-like-a-pro-f1bfc1548c72)
- [Developing the ubiquitous language](https://medium.com/@felipefreitasbatista/developing-the-ubiquitous-language-1382b720bb8c)

**Use Value Objects/Domain Primitives and Types system to make illegal states unrepresentable in your program.**

Some people recommend using objects for **every** value:

Quote from [John A De Goes](https://twitter.com/jdegoes):

> Making illegal states unrepresentable is all about statically proving that all runtime values (without exception) correspond to valid objects in the business domain. The effect of this technique on eliminating meaningless runtime states is astounding and cannot be overstated.

Lets distinguish two types of protection from illegal states: at **compile time** and at **runtime**.

### At compile time

Types give useful semantic information to a developer. Good code should be easy to use correctly, and hard to use incorrectly. Types system can be a good help for that. It can prevent some nasty errors at a compile time, so IDE will show type errors right away.

The simplest example may be using enums instead of constants, and use those enums as input type for something. When passing anything that is not intended IDE will show a type error.

Or, for example, imagine that business logic requires to have contact info of a person by either having `email`, or `phone`, or both. Both `email` and `phone` could be represented as optional, for example:

```typescript
interface ContactInfo {
  email?: Email;
  phone?: Phone;
}
```

But what happens if both are not provided by a programmer? Business rule violated. Illegal state allowed.

Solution: this could be presented as a [union type](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html#union-types)

```typescript
type ContactInfo = Email | Phone | [Email, Phone];
```

Now only either `Email`, or `Phone`, or both must be provided. If nothing is provided IDE will show a type error right away. Now business rule validation is moved from runtime to a **compile time** which makes application more secure and gives a faster feedback when something is not used as intended.

This is called a _typestate pattern_.

> The typestate pattern is an API design pattern that encodes information about an object’s run-time state in its compile-time type.

Read more about typestates:

- [Typestates Would Have Saved the Roman Republic](https://blog.yoavlavi.com/state-machines-would-have-saved-the-roman-republic/)
- [The Typestate Pattern](https://cliffle.com/blog/rust-typestate/)

### At runtime

Things that can't be validated at compile time (like user input) are validated at runtime.

Domain objects have to protect their invariants. Having some validation rules here will protect their state from corruption.

`Value Object` can represent a typed value in domain (a _domain primitive_). The goal here is to encapsulate validations and business logic related only to the represented fields and make it impossible to pass around raw values by forcing a creation of valid `Value Objects` first. This object only accepts values which make sense in its context.

If every argument and return value of a method is valid by definition, you’ll have input and output validation in every single method in your codebase without any extra effort. This will make application more resilient to errors and will protect it from a whole class of bugs and security vulnerabilities caused by invalid input data.

Data should not be trusted. There are a lot of cases when invalid data may end up in a domain. For example, if data comes from external API, database, or if it's just a programmer error.

Enforcing self-validation will inform immediately when data is corrupted. Not validating domain objects allows them to be in an incorrect state, this leads to problems.

> Without domain primitives, the remaining code needs to take care of validation, formatting, comparing, and lots of other details. Entities represent long-lived objects with a distinguished identity, such as articles in a news feed, rooms in a hotel, and shopping carts in online sales. The functionality in a system often centers around changing the state of these objects: hotel rooms are booked, shopping cart contents are
> paid for, and so on. Sooner or later the flow of control will be guided to some code representing these entities. And if all the data is transmitted as generic types such as int or String , responsibilities fall on the entity code to validate, compare, and format the data, among other tasks. The entity code will be burdened with a lot of
> tasks, rather than focusing on the central business flow-of-state changes that it models. Using domain primitives can counteract the tendency for entities to grow overly complex.

Quote from: [Secure by design: Chapter 5.3 Standing on the shoulders of domain primitives](https://livebook.manning.com/book/secure-by-design/chapter-5/96)

**Note**: Though _primitive obsession_ is a code smell, some people consider making a class/object for every primitive may be an overengineering. For less complex and smaller projects it definitely may be. For bigger projects, there are people who advocate for and against this approach. If creating a class for every primitive is not preferred, create classes just for those primitives that have specific rules or behavior, or just validate only outside of domain using some validation framework. Here are some thoughts on this topic: [From Primitive Obsession to Domain Modelling - Over-engineering?](https://blog.ploeh.dk/2015/01/19/from-primitive-obsession-to-domain-modelling/#7172fd9ca69c467e8123a20f43ea76c2).

**Recommended to read**:

- [Making illegal states unrepresentable](https://v5.chriskrycho.com/journal/making-illegal-states-unrepresentable-in-ts/)
- [Domain Primitives: what they are and how you can use them to make more secure software](https://freecontent.manning.com/domain-primitives-what-they-are-and-how-you-can-use-them-to-make-more-secure-software/)
- ["Secure by Design" Chapter 5: Domain Primitives](https://livebook.manning.com/book/secure-by-design/chapter-5/) (a full chapter of the article above)

### How to do simple validation?

For simple validation like checking for nulls, empty arrays, input length etc. a library of [guards](<https://en.wikipedia.org/wiki/Guard_(computer_science)>) can be created.

Example file: [guard.ts](src/core/guard.ts)

Read more: [Refactoring: Guard Clauses](https://medium.com/better-programming/refactoring-guard-clauses-2ceeaa1a9da)

Another solution would be using an external validation library, but it is not a good practice to tie domain to external libraries and is not usually recommended.

Although exceptions can be made if needed, especially for very specific validation libraries that validate only one thing (like specific IDs, for example bitcoin wallet address). Tying only one or just few `Value Objects` to such a specific library won't cause any harm. Unlike general purpose validation libraries which will be tied to domain everywhere and it will be troublesome to change it in every `Value Object` in case when old library is no longer maintained, contains critical bugs or is compromised by hackers etc.

Though, it is fine to do full sanity checks using validation framework or library **outside** of domain (for example [class-validator](https://www.npmjs.com/package/class-validator) decorators in `DTOs`), and do only some basic checks inside of `Value Objects` (besides business rules), like checking for `null` or `undefined`, checking length, matching against simple regexp etc. to check if value makes sense and for extra security.

<details>
<summary>Note about using regexp</summary>

Be careful with custom regexp validations for things like validating `email`, only use custom regexp for some very simple rules and, if possible, let validation library do it's job on more difficult ones to avoid problems in case your regexp is not good enough.

Also, keep in mind that custom regexp that does same type of validation that is already done by validation library outside of domain may create conflicts between your regexp and the one used by a validation library.

For example, value can be accepted as valid by a validation library, but `Value Object` may throw an error because custom regexp is not good enough (validating `email` is more complex than just copy - pasting a regular expression found in google. Though, it can be validated by a simple rule that is true all the time and won't cause any conflicts, like every `email` must contain an `@`). Try finding and validating only patterns that won't cause conflicts.

---

</details>

Although there are other strategies on how to do validation inside domain, like passing validation schema as a dependency when creating new `Value Object`, but this creates extra complexity.

Either to use external library/framework for validation inside domain or not is a tradeoff, analyze all the pros and cons and choose what is more appropriate for current application.

For some projects, especially smaller ones, it might be easier and more appropriate to just use validation library/framework.

**Keep in mind** that not all validations can be done in a single `Value Object`, it should validate only rules shared by all contexts. There are cases when validation may be different depending on a context, or one field may involve another field, or even a different entity. Handle those cases accordingly.

### Types of validation

There are some general recommendations for validation order. Cheap operations like checking for null/undefined and checking length of data come early in the list, and more expensive operations that require calling the database come later.

Preferably in this order:

- _Origin - Is the data from a legitimate sender?_ When possible, accept data only from authorized users / whitelisted IPs etc. depending on the situation.
- _Existence - are provided data not empty?_ Further validations make no sense if data is empty. Check for empty values: null/undefined, empty objects and arrays.
- _Size - Is it reasonably big?_ Before any further steps, check length/size of input data, no matter what type it is. This will prevent validating data that is too big which may block a thread entirely (sending data that is too big may be a [DoS](https://en.wikipedia.org/wiki/Denial-of-service_attack) attack).
- _Lexical content - Does it contain the right characters and encoding?_ For example, if we expect data that only contains digits, we scan it to see if there’s anything else. If we find anything else, we draw the conclusion that the data is either broken by mistake or has been maliciously crafted to fool our system.
- _Syntax - Is the format right?_ Check if data format is right. Sometimes checking syntax is as simple as using a regexp, or it may be more complex like parsing a XML or JSON.
- _Semantics - Does the data make sense?_ Check data in connection with the rest of the system (like database, other processes etc). For example, checking in a database if ID of item exists.

Read more about validation types described above:

- ["Secure by Design" Chapter 4.3: Validation](https://livebook.manning.com/book/secure-by-design/chapter-4/109).

## Using libraries inside application's core

Whether or not to use libraries in application layer and especially domain layer is a subject of a lot of debates. In real world, injecting every library instead of importing it directly is not always practical, so exceptions can be made for some single responsibility libraries that help to implement domain logic (like working with numbers).

Main recommendations to keep in mind is that libraries imported in application's core **shouldn't** expose:

- Functionality to access any out-of-process resources (http calls, database access etc);
- Functionality not relevant to domain (frameworks, technology details like ORMs, Logger etc).
- Functionality that brings randomness (generating random IDs, timestamps etc) since this makes tests unpredictable (though in TypeScript world it is not that big of a deal since this can be mocked by a test library without using DI);
- Frameworks can be a real nuisance because by definition they want to be in control. Isolate them within the adapters and keep our domain model clean of them.
- If a library changes often or has a lot of dependencies of its own it most likely shouldn't be used in domain layer.

To use such libraries consider creating an `anti-corruption` layer by using [adapter](https://refactoring.guru/design-patterns/adapter) or [facade](https://refactoring.guru/design-patterns/facade) patterns.

We sometimes tolerate libraries in the center: libraries are not in control so they are less intrusive. But be careful with general purpose libraries that may scatter across many domain objects. It will be hard to replace those libraries if needed. Tying only one or just few domain objects to some single-responsibility library should be fine. It is way easier to replace a specific library that is tied to one or few objects than a general purpose library that is everywhere.

Offload as much of irrelevant responsibilities as possible from the core, especially from domain layer. In addition, try to minimize usage of dependencies in general. More dependencies your software has means more potential errors and security holes. One technique for making software more robust is to minimize what your software depends on - the less that can go wrong, the less that will go wrong. On the other hand, removing all dependencies would be counterproductive as replicating that functionality would have been a huge amount of work and less reliable than just using a widely-used dependency. Finding a good balance is important, this skill requires experience.

Read more:

- [Referencing external libs](https://khorikov.org/posts/2019-08-07-referencing-external-libs/).
- [Anti-corruption Layer — An effective Shield](https://medium.com/@malotor/anticorruption-layer-a-effective-shield-caa4d5ba548c)

---

# Interface Adapters

Interface adapters (also called driving/primary adapters) are user-facing interfaces that take input data from the user and repackage it in a form that is convenient for the use cases(services) and entities. Then they take the output from those use cases and entities and repackage it in a form that is convenient for displaying it back for the user. User can be either a person using an application or another server.

Contains `Controllers` and `Request`/`Response` DTOs (can also contain `Views`, like backend-generated HTML templates, if required).

## Controllers

- Controllers are used for parsing requests, triggering use cases and presenting the result back to the client.
- One controller per use case is considered a good practice.
- In [NestJS](https://docs.nestjs.com/) world controllers may be a good place to use [OpenAPI/Swagger decorators](https://docs.nestjs.com/openapi/operations) for documentation.

One controller per trigger type can be used to have a more clear separation. For example:

- [create-user.http.controller.ts](src/modules/user/use-cases/create-user/create-user.http.controller.ts) for http requests ([NestJS Controllers](https://docs.nestjs.com/controllers)),
- [create-user.cli.controller.ts](src/modules/user/use-cases/create-user/create-user.cli.controller.ts) for command line interface access ([NestJS Console](https://www.npmjs.com/package/nestjs-console))
- [create-user.event.controller.ts](src/modules/user/use-cases/create-user/create-user.event.controller.ts) for external events ([NetJS Microservices](https://docs.nestjs.com/microservices/basics)).
- etc.

---

## DTOs

Data Transfer Object ([DTO](https://en.wikipedia.org/wiki/Data_transfer_object)) is an object that carries data between processes. This is a contract between your API and clients.

### Request DTOs

Input data sent by a user.

- Using Request DTOs gives a contract that a client of your API has to follow to make a correct request.

Examples:

- [create-user.request.dto.ts](src/modules/user/use-cases/create-user/create-user.request.dto.ts)
- [create.user.interface.ts](src/interface-adapters/interfaces/user/create.user.interface.ts)

### Response DTOs

Output data returned to a user.

- Using Response DTOs ensures clients only receive data described in DTOs contract, not everything that your model/entity owns (which may result in data leaks).
- It also to some extent protects your clients from internal data structure changes that may happen in your API.

Examples:

- [user.response.dto.ts](src/modules/user/dtos/user.response.dto.ts)
- [user.interface.ts](src/interface-adapters/interfaces/user/user.interface.ts)

### Additional recommendations:

- When returning a `Response` prefer _whitelisting_ properties over _blacklisting_. This ensures that no sensitive data will leak in case if programmer forgets to blacklist newly added properties that shouldn't be returned to the user.
- Interfaces for `Request`/`Response` objects should be kept somewhere in shared directory instead of module directory since they may be used by a different application (like front-end page, mobile app or microservice). Consider creating git submodule or a separate package for sharing interfaces.
- `Request`/`Response` DTO classes may be a good place to use validation and sanitization decorators like [class-validator](https://www.npmjs.com/package/class-validator) and [class-sanitizer](https://www.npmjs.com/package/class-sanitizer) (make sure that all validation errors are gathered first and only then return them to the user, this is called [Notification pattern](https://martinfowler.com/eaaDev/Notification.html). Class-validator does this by default).
- `Request`/`Response` DTO classes may also be a good place to use Swagger/OpenAPI library decorators that [NestJS provides](https://docs.nestjs.com/openapi/types-and-parameters).
- If DTO decorators for validation/documentation are not used, DTO can be just an interface instead of class + interface.
- Data can be transformed to DTO format using a separate mapper or right in the constructor if DTO classes are used.

---

# Infrastructure

The Infrastructure is responsible strictly to keep technology. You can find there the implementations of database repositories for business entities, message brokers, I/O components, dependency injection, frameworks and any other thing that represents a detail for the architecture, mostly framework dependent, external dependencies, and so on.

It's the most volatile layer. Since the things in this layer are so likely to change, they are kept as far away as possible from the more stable domain layers. Because they are kept separate, it's relatively easy make changes or swap one component for another.

Infrastructure layer can contain `Adapters`, database related files like `Repositories`, `ORM entities`/`Schemas`, framework related files etc.

## Adapters

- Infrastructure adapters (also called driven/secondary adapters) enable a software system to interact with external systems by receiving, storing and providing data when requested (like persistence, message brokers, sending emails or messages, requesting 3rd party APIs etc).
- Adapters also can be used to interact with different domains inside single process to avoid coupling between those domains.
- Adapters are essentially an implementation of ports. They are not supposed to be called directly in any point in code, only through ports(interfaces).
- Adapters can be used as Anti-Corruption Layer (ACL) for legacy code.

Read more on ACL: [Anti-Corruption Layer: How to Keep Legacy Support from Breaking New Systems](https://www.cloudbees.com/blog/anti-corruption-layer-how-keep-legacy-support-breaking-new-systems)

Adapters should have:

- a `port` somewhere in application/domain layer that it implements;
- a mapper that maps data **from** and **to** domain (if it's needed);
- a DTO/interface for received data;
- a validator to make sure incoming data is not corrupted (validation can reside in DTO class using decorators, or it can be validated by `Value Objects`).

## Repositories

Repositories centralize common data access functionality. They encapsulate the logic required to access that data. Entities/aggregates can be put into a repository and then retrieved at a later time without domain even knowing where data is saved, in a database, or a file, or some other source.

We use repositories to decouple the infrastructure or technology used to access databases from the domain model layer.

Martin Fowler describes a repository as follows:

> A repository performs the tasks of an intermediary between the domain model layers and data mapping, acting in a similar way to a set of domain objects in memory. Client objects declaratively build queries and send them to the repositories for answers. Conceptually, a repository encapsulates a set of objects stored in the database and operations that can be performed on them, providing a way that is closer to the persistence layer. Repositories, also, support the purpose of separating, clearly and in one direction, the dependency between the work domain and the data allocation or mapping.

The data flow here looks something like this: repository receives a domain `Entity` from application service, maps it to database schema/ORM format, does required operations and maps it back to domain `Entity` and returns it back to service.

**Keep in mind** that application's core is not allowed to depend on repositories directly, instead it depends on abstractions (ports/interfaces). This makes data retrieval technology-agnostic.

### Examples

This project contains abstract repository class that allows to make basic CRUD operations: [typeorm.repository.base.ts](src/infrastructure/database/base-classes/typeorm.repository.base.ts). This base class is then extended by a specific repository, and all specific operations that an entity may need is implemented in that specific repo: [user.repository.ts](src/modules/user/database/user.repository.ts).

## Persistence models

Using a single entity for domain logic and database concerns leads to a database-centric architecture. In DDD world domain model and persistance model should be separated.

Since domain `Entities` have their data modeled so that it best accommodates domain logic, it may be not in the best shape to save in a database. For that purpose `Persistence models` can be created that have a shape that is better represented in a particular database that is used. Domain layer should not know anything about persistance models, and it should not care.

There can be multiple models optimized for different purposes, for example:

- Domain with it's own models - `Entities`, `Aggregates` and `Value Objects`.
- Persistence layer with it's own models - `ORM` for SQL, `Schemas` for NoSQL, `Read/Write` models if databases are separated into a read and write db ([CQRS](https://en.wikipedia.org/wiki/Command%E2%80%93query_separation)) etc.

Over time, when the amount of data grows, there may be a need to make some changes in the database like improving performance or data integrity by re-designing some tables or even changing the database entirely. Without an explicit separation between `Domain` and `Persistance` models any change to the database will lead to change in your domain `Entities` or `Aggregates`. For example, when performing a database [normalization](https://en.wikipedia.org/wiki/Database_normalization) data can spread across multiple tables rather than being in one table, or vice-versa for [denormalization](https://en.wikipedia.org/wiki/Denormalization). This may force a team to do a complete refactoring of a domain layer which may cause unexpected bugs and challenges. Separating Domain and Persistance models prevents that.

An alternative to using Persistence Models may be raw queries or some sort of a query builder, in this case you may not need to create `ORM Entities` or `Schemas`.

**Note**: separating domain and persistance models may be an overkill for smaller applications, consider all pros and cons before making this decision.

Example files:

- [user.orm-entity.ts](src/modules/user/database/user.orm-entity.ts) <- Persistence model using [ORM](https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping).
- [user.orm-mapper.ts](src/modules/user/database/user.orm-mapper.ts) <- Persistence models should also have a corresponding mapper to map from domain to persistence and back.

Read more:

- [Stack Overflow question: DDD - Persistence Model and Domain Model](https://stackoverflow.com/questions/14024912/ddd-persistence-model-and-domain-model)
- [Just Stop It! The Domain Model Is Not The Persistence Model](https://blog.sapiensworks.com/post/2012/04/07/Just-Stop-It!-The-Domain-Model-Is-Not-The-Persistence-Model.aspx)
- [Secure by Design: Chapter 6.2.2 ORM frameworks and no-arg constructors](https://livebook.manning.com/book/secure-by-design/chapter-6/40)

## Other things that can be a part of Infrastructure layer:

- Framework related files;
- Application logger implementation;
- Infrastructure related events ([Nest-event](https://www.npmjs.com/package/nest-event))
- Periodic cron jobs or tasks launchers ([NestJS Schedule](https://docs.nestjs.com/techniques/task-scheduling));
- Other technology related files.

---

# Recommendations for smaller APIs

Be careful when implementing any complex architecture in small-medium sized projects with not a lot of business logic. Some of the building blocks/patterns/principles may fit well, but others may be an overengineering.

For example:

- Separating code into modules/layers/use-cases, using some building blocks like controllers/services/entities, respecting boundaries and dependency injections etc. may be a good idea for any project.
- But practices like creating an object for every primitive, using `Value Objects` to separate business logic into smaller classes, separating `Domain Models` from `Persistence Models` etc. in projects that are more data-centric and have little or no business logic may only complicate such solutions and add extra boilerplate code, data mapping, maintenance overheads etc. without adding much benefit.

[DDD](https://en.wikipedia.org/wiki/Domain-driven_design) and other practices described here are mostly about creating software with complex business logic. But what would be a better approach for simpler applications?

For applications with not a lot of business logic consider other architectures. The most popular is probably [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller). _Model-View-Controller_ is better suited for [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) applications with little business logic since it tends to favor designs where software is mostly the view of the database.

# General recommendations on architectures, best practices, design patterns and principles

Different projects most likely will have different requirements. Some principles/patterns in such projects can be implemented in a simplified form, some can be skipped. Follow [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it) principle and don't overengineer.

Sometimes complex architecture and principles like [SOLID](https://en.wikipedia.org/wiki/SOLID) can be incompatible with [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it) and [KISS](https://en.wikipedia.org/wiki/KISS_principle). A good programmer should be pragmatic and has to be able to combine his skills and knowledge with a common sense to choose the best solution for the problem.

> You need some experience with object-oriented software development in real world projects before they are of any use to you. Furthermore, they don’t tell you when you have found a good solution and when you went too far. Going too far means that you are outside the “scope” of a principle and the expected advantages don’t appear.

> Principles, Heuristics, ‘laws of engineering’ are like hint signs, they are helpful when you know where they are pointing to and you know when you have gone too far. Applying them requires experience, that is trying things out, failing, analysing, talking to people, failing again, fixing, learning and failing some more. There is no short cut as far as I know.

**Before implementing any pattern always analyze if benefit given by using it worth extra code complexity**.

> Effective design argues that we need to know the price of a pattern is worth paying - that's its own skill.

However, remember:

> It's easier to refactor over-design than it is to refactor no design.

Read more:

- [Martin Fowler blog: Yagni](https://martinfowler.com/bliki/Yagni.html)
- [7 Software Development Principles That Should Be Embraced Daily](https://betterprogramming.pub/7-software-development-principles-that-should-be-embraced-daily-c26a94ec4ecc?gi=3b5b298ddc23)
- [SOLID Principles and the Arts of Finding the Beach](https://sebastiankuebeck.wordpress.com/2017/09/17/solid-principles-and-the-arts-of-finding-the-beach/)

# Other recommendations and best practices

## Error Handling

### Exception types

Consider extending `Error` object to make custom exception types for different situations. For example: `DomainException` etc. This is especially relevant in NodeJS world since there is no exceptions for different situations by default.

Keep in mind that application's `core` shouldn't throw HTTP exceptions or statuses since it shouldn't know in what context it is used, since it can be used by anything: HTTP controller, Microservice event handler, Command Line Interface etc.

When used in HTTP context, for returning proper status code back to user an `instanceof` check can be performed in exception interceptor or in a controller and appropriate HTTP exception can be returned depending on exception type.

Exception interceptor example: [exception.interceptor.ts](src/infrastructure/interceptors/exception.interceptor.ts) - notice how custom exceptions are converted to nest.js exceptions.

Adding a `name` string with type name for every exception is a good practice, since when that exception is transferred to another process `instanceof` check cannot be performed anymore so a `name` string is used instead. Exception `name` enum types can be stored in a separate file so they can be reused on a receiving side: [exception.types.ts](src/core/exceptions/exception.types.ts).

When using microservices, all exception types can be packed into a library and reused in each microservice for consistency.

### Differentiate between programmer errors and operational errors

Application should be protected not only from operational errors (like incorrect user input), but from a programmer errors as well by throwing exceptions when something is not used as intended.

For example:

- Operational errors can happen when validation error is thrown by validating user input, it means that input body is incorrect and a `400 Bad Request` exception should be returned to the user with details of what fields are incorrect ([notification pattern](https://martinfowler.com/eaaDev/Notification.html)). In this case user can fix the input body and retry the request.
- On the other hand, programmer error means something unexpected occurs in the program. For example, when exception happens on a new domain object creation, sometimes it can mean that a class is not used as intended and some rule is violated, for example a programmer did a mistake by assigning an incorrect value to a constructor, or value got mutated at some point and is no longer valid. In this case user cannot do anything to fix this, only a programmer can, so it may be more appropriate to throw a different type of exception that should be logged and then returned to the user as `500 Internal Server Error`, in this case without adding much additional details to the response since it may cause a leak of some sensitive data.

### Error Serialization

By default, in NodeJS Error objects serialize to JSON with output like this:

```typescript
{
  name: 'ValidationError';
}
```

Consider serializing errors by creating a `toJSON()` method so it can be easily sent to other processes as a plain object.

### Error metadata

Consider adding optional `metadata` object to exceptions (if language doesn't support anything similar by default) and pass some useful technical information about the error when throwing. This will make debugging easier.

**Important to keep in mind**: never log or add to `metadata` any sensitive information (like passwords, emails, phone or credit card numbers etc) since this information may leak into log files, and if log files are not protected properly this information can leak or be seen by developers who have access to log files. Aim adding only technical information to your logs.

### Other recommendations

- If translations of error messages to other languages is needed, consider storing those error messages in a separate object/class rather than inline string literals. This will make it easier to implement localization by adding conditional getters.
- You can use "Problem Details for HTTP APIs" standard for returned exceptions, described in [RFC 7807](https://datatracker.ietf.org/doc/html/rfc7807). Read more about this standard: [REST API Error Handling - Problem Details Response](https://blog.restcase.com/rest-api-error-handling-problem-details-response/)

Example files:

- [exception.base.ts](src/core/exceptions/exception.base.ts) - Exception abstract base class
- [domain.exception.ts](src/core/exceptions/domain.exception.ts) - Domain Exception class example
- Check [exceptions](src/core/exceptions) folder to see more examples (some of them are exceptions from other languages like C# or Java)

Read more:

- [Better error handling in JavaScript](https://iaincollins.medium.com/error-handling-in-javascript-a6172ccdf9af)
- ["Secure by design" Chapter 9: Handling failures securely](https://livebook.manning.com/book/secure-by-design/chapter-9/)

### Alternatives to exceptions

There is an alternative approach of not throwing exceptions, but returning some kind of Result object type with a Success or a Failure (an `Either` [monad](<https://en.wikipedia.org/wiki/Monad_(functional_programming)>) from functional languages like Haskell). Unlike throwing exceptions, this approach allows to define types for exceptional outcomes and will force us to handle those cases explicitly instead of using `try/catch`. For example:

```typescript
class User {
  // ...
  public createUser(): Either<User, EmailInvalidException> {
    // ...code for creating a user
    if (invalidEmail) {
      return EmailInvalidException; // <- returning instead of throwing
    }
    return User;
  }
}
```

This approach has its advantages and may work nicely in some languages, especially in functional languages which support `Either` type natively, but is not widely used in TypeScript/Javascript world.

It also has some downsides:

- It goes against [Fail-fast](https://en.wikipedia.org/wiki/Fail-fast) principle. Instead of terminating a program flow, this approach continues program execution and allows it to run in an incorrect state, which may lead to more unexpected errors.
- It adds extra complexity. Exception cases returned somewhere deep inside application have to be handled by functions in upper layers until it reaches controllers which may add a lot of extra `if` statements.

For most projects this approach may be an overkill. Use it only if you really need it and know what you are doing (unless you're using a language like [Rust](<https://en.wikipedia.org/wiki/Rust_(programming_language)>) which has this functionality built-in).

Read more:

- ["Secure by Design" Chapter 9.2: Handling failures without exceptions](https://livebook.manning.com/book/secure-by-design/chapter-9/51)

## Testing

Software Testing helps catching bugs early. Properly tested software product ensures reliability, security and high performance which further results in time saving, cost effectiveness and customer satisfaction.

Lets review two types of software testing:

- [White Box](https://en.wikipedia.org/wiki/White-box_testing) testing.
- [Black Box](https://en.wikipedia.org/wiki/Black-box_testing) testing.

Testing module/use-case internal structures (creating a test for every file/class) is called _`White Box`_ testing. _White Box_ testing is widely used technique, but it has disadvantages. It creates coupling to implementation details, so every time you decide to refactor business logic code this may also cause a refactoring of corresponding tests.

Use case requirements may change mid work, your understanding of a problem may evolve or you may start noticing new patterns that emerge during development, in other words, you start noticing a "big picture", which may lead to refactoring. For example: imagine that you defined a _`White box`_ test for a class, and while developing this class you start noticing that it does too much and should be separated into two classes. Now you'll also have to refactor your unit test. After some time, while implementing a new feature, you notice that this new feature uses some code from that class you defined before, so you decide to separate that code and make it reusable, creating a third class (which originally was one), which leads to changing your unit tests yet again, every time you refactor. Use case requirements, input, output or behavior never changed, but unit tests had to be changed multiple times. This is inefficient and time consuming.

To solve this and get the most out of your tests, prefer _`Black Box`_ testing ([Behavioral Testing](https://www.codekul.com/blog/what-is-behavioral-testing/)). This means that tests should focus on testing user-facing behavior users care about (your code's public API, for example `createUser()` method that is called by the user), not the implementation details of individual units it has inside. This avoids coupling, protects tests from changes that may happen while refactoring, makes tests easier to understand and maintain thus saving time.

> Tests that are independent of implementation details are easier to maintain since they don't need to be changed each time you make a change to the implementation.

Try to avoid _White Box_ testing when possible. Though, there are cases when _White Box_ testing may be needed, for example:

- High complexity in implementation details that are hard to cover using _Black Box_ testing.
- There is a need to increase code coverage.
- Sometimes it makes more sense to create a separate _White Box_ unit test for a class with specific logic than cluttering a _Black Box_ test file with those test cases.
- Some parts of the code can't be properly tested by _Black Box_ testing.
- etc.

Use _White Box_ testing only when it is really needed and as an addition to _Black Box_ testing, not the other way around.

It's all about investing only in the tests that yield the biggest return on your effort.

Behavioral tests can be divided in two parts:

- Fast: Use cases tests in isolation which test only your business logic, with all I/O (external API or database calls, file reads etc.) mocked. This makes tests fast so they can be run all the time (after each change or before every commit). This will inform you when something fails as fast as possible. Finding bugs early is critical and saves a lot of time.
- Slow: Full [End to End](https://www.guru99.com/end-to-end-testing.html) (e2e) tests which test a use case from end-user standpoint. Instead of injecting I/O mocks those tests should have all infrastructure up and running: like database, API routes etc. Those tests check how everything works together and are slower so can be run only before pushing/deploying. Though e2e tests live in the same project/repository, it is a good practice to have e2e tests independent from project's code. In bigger projects e2e tests are usually written by a separate QA team.

**Note**: some people try to make e2e tests faster by using in-memory or embedded databases (like [sqlite3](https://www.npmjs.com/package/sqlite3)). This makes tests faster, but reduces the reliability of those tests and should be avoided. Read more: [Don't use In-Memory Databases for Tests](https://phauer.com/2017/dont-use-in-memory-databases-tests-h2/).

Example files: // TODO

Read more:

- [Pragmatic unit testing](https://enterprisecraftsmanship.com/posts/pragmatic-unit-testing/)
- [Google Blog: Test Behavior, Not Implementation ](https://testing.googleblog.com/2013/08/testing-on-toilet-test-behavior-not.html)
- [Writing BDD Test Scenarios](https://www.departmentofproduct.com/blog/writing-bdd-test-scenarios/)
- Book: [Unit Testing Principles, Practices, and Patterns](https://www.amazon.com/gp/product/1617296279/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=1617296279&linkCode=as2&tag=vkhorikov-20&linkId=2081de4b1cb7564cb9f95526533c3dae)

### Load Testing

For projects with a bigger user base you might want to implement some kind of [load testing](https://en.wikipedia.org/wiki/Load_testing) to see how program behaves with a lot of concurrent users.

Load testing is a great way to minimize performance risks, because it ensures an API can handle an expected load. By simulating traffic to an API in development, businesses can identify bottlenecks before they reach production environments. These bottlenecks can be difficult to find in development environments in the absence of a production load.

Automatic load testing tools can simulate that load by making a lot of concurrent requests to an API and measure response times and error rates.

Example tools:

- [Artillery](https://www.npmjs.com/package/artillery) is a load testing tool based on NodeJS.

Read more:

- [Top 6 Tools for API & Load Testing](https://medium.com/@Dickson_Mwendia/top-6-tools-for-api-load-testing-7ff51d1ac1e8).

### Fuzz Testing

[Fuzzing or fuzz testing](https://en.wikipedia.org/wiki/Fuzzing) is an automated software testing technique that involves providing invalid, unexpected, or random data as inputs to a computer program.

Fuzzing is a common method hackers use to find vulnerabilities of the system. For example:

- JavaScript injections can be executed if input is not sanitized properly, so a malicious JS code can end up in a database and then gets executed in a browser when somebody reads that data.
- SQL injection attacks can occur if data is not sanitized properly, so hackers can get access to a database (though modern ORM libraries can protect from that kind of attacks when used properly).
- Sending weird unicode characters, emojis etc. can crash your application.

There are a lot of examples of a problems like this, for example [sending a certain character could crash and disable access to apps on an iPhone](https://www.theverge.com/2018/2/15/17015654/apple-iphone-crash-ios-11-bug-imessage).

Sanitizing and validating input data is very important. But sometimes we make mistakes of not sanitizing/validating data properly, opening application to certain vulnerabilities.

Automated Fuzz testing tools can prevent such vulnerabilities. Those tools contain a list of strings that are usually sent by hackers, like malicious code snippets, SQL queries, unicode symbols etc. (for example: [Big List of Naughty Strings](https://github.com/minimaxir/big-list-of-naughty-strings/)), which helps test most common cases of different injection attacks.

Fuzz testing is a nice addition to typical testing methods described above and potentially can find serious security vulnerabilities or defects.

Example tools:

- [Artillery Fuzzer](https://www.npmjs.com/package/artillery-plugin-fuzzer) is a plugin for [Artillery](https://www.npmjs.com/package/artillery) to perform Fuzz testing.
- [sqlmap](https://github.com/sqlmapproject/sqlmap) - an open source penetration testing tool that automates the process of detecting and exploiting SQL injection flaws

Read more:

- [Fuzz Testing(Fuzzing) Tutorial: What is, Types, Tools & Example](https://www.guru99.com/fuzz-testing.html)

## Configuration

- Store all configurable variables/parameters in config files. Try to avoid using in-line literals/primitives. This will make it easier to find and maintain all configurable parameters when they are in one place.
- Never store sensitive configuration variables (passwords/API keys/secret keys etc) in plain text in a configuration files or source code.
- Store sensitive configuration variables, or variables that change depending on environment, as [environment variables](https://en.wikipedia.org/wiki/Environment_variable) ([dotenv](https://www.npmjs.com/package/dotenv) is a nice package for that) or as a [Docker/Kubernetes secrets](https://www.bogotobogo.com/DevOps/Docker/Docker_Kubernetes_Secrets.php).
- Create hierarchical config files that are grouped into sections. If possible, create multiple files for different configs (like database config, API config, tasks config etc).
- Application should fail and provide the immediate feedback if the required environment variables are not present at start-up.
- For most projects plain object configs may be enough, but there are other options, for example: [NestJS Configuration](https://docs.nestjs.com/techniques/configuration), [rc](https://www.npmjs.com/package/rc), [nconf](https://www.npmjs.com/package/nconf) or any other package.

Example files:

- [ormconfig.ts](src/infrastructure/configs/ormconfig.ts) - this is typeorm database config file. Notice `process.env` - those are environmental variables.
- [.env.example](.env.example) - this is [dotenv](https://www.npmjs.com/package/dotenv) example file. This file should only store dummy example secret keys, never store actual development/production secrets in it. This file later is renamed to `.env` and populated with real keys for every environment (local, dev or prod). Don't forget to add `.env` to [.gitignore](.gitignore) file to avoid pushing it to repo and leaking all keys.

## Logging

- Try to log all meaningful events in a program that can be useful to anybody in your team.
- Use proper log levels: `log`/`info` for events that are meaningful during production, `debug` for events useful while developing/debugging, and `warn`/`error` for unwanted behavior on any stage.
- Write meaningful log messages and include metadata that may be useful. Try to avoid cryptic messages that only you understand.
- Never log sensitive data: passwords, emails, credit card numbers etc. since this data will end up in log files. If log files are not stored securely this data can be leaked.
- Avoid default logging tools (like `console.log`). Use mature logger libraries (for example [Winston](https://www.npmjs.com/package/winston)) that support features like enabling/disabling log levels, convenient log formats that are easy to parse (like JSON) etc.
- Consider including user id in logs. It will facilitate investigating if user creates an incident ticket.
- In distributed systems a gateway can generate an unique id for each request and pass it to every system that processes this request. Logging this id will make it easier to find related logs across different systems/files.
- Use consistent structure across all logs. Each log line should represent one single event and contain things like timestamp, context, unique user/request id and/or id of entity/aggregate that is being modified, as well as additional metadata if required.
- Use log managements systems. This will allow you to track and analyze logs as they happen in real-time. Here are some short list of log managers: [Sentry](https://sentry.io/for/node/), [Loggly](https://www.loggly.com/), [Logstash](https://www.elastic.co/logstash), [Splunk](https://www.splunk.com/) etc.
- Send notifications of important events that happen in production to a corporate chat like Slack or even by SMS.
- Don't write logs to a file from your program. Write all logs to [stdout](https://www.computerhope.com/jargon/s/stdout.htm) (to a terminal window) and let other tools handle writing logs to a file (for example [docker supports writing logs to a file](https://docs.docker.com/config/containers/logging/configure/)). Read more: [Why should your Node.js application not handle log routing?](https://www.coreycleary.me/why-should-your-node-js-application-not-handle-log-routing/)
- Logs can be visualized by using a tool like [Kibana](https://www.elastic.co/kibana).

Read more:

- [Make your app transparent using smart logs](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/production/smartlogging.md)

## Health monitoring

Additionally to logging tools, when something unexpected happens in production, it's critical to have thorough monitoring in place. As software hardens more and more, unexpected events will get more and more infrequent and reproducing those events will become harder and harder. So when one of those unexpected events happens, there should be as much data available about the event as possible. Software should be designed from the start to be monitored. Monitoring aspects of software are almost as important as the functionality of the software itself, especially in big systems, since unexpected events can lead to money and reputation loss for a company. Monitoring helps fixing and sometimes preventing unexpected behavior like failures, slow response times, errors etc.

Health monitoring tools are a good way to keep track of system performance, identify causes of crashes or downtime, monitor behavior, availability and load.

Some health monitoring tools already include logging management and error tracking, as well as alerts and general performance monitoring.

Here are some basic recommendation on what can be monitored:

- Connectivity – Verify if user can successfully send a request to the API endpoint and get a response with expected HTTP status code. This will confirm if the API endpoint is up and running. This can be achieved by creating some kind of 'heath check' endpoint.
- Performance – Make sure the response time of the API is within acceptable limits. Long response times cause bad user experience.
- Error rate – errors immediately affect your customers, you need to know when errors happen right away and fix them.
- CPU and Memory usage – spikes in CPU and Memory usage can indicate that there are problems in your system, for example bad optimized code, unwanted process running, memory leaks etc. This can result in loss of money for your organization, especially when cloud providers are used.
- Storage usage – servers run out of storage. Monitoring storage usage is essential to avoid data loss.

Choose health monitoring tools depending on your needs, here are some examples:

- [Sematext](https://sematext.com/), [AppSignal](https://appsignal.com/), [Prometheus](https://prometheus.io/), [Checkly](https://www.checklyhq.com/), [ClinicJS](https://clinicjs.org/)

Read more:

- [Essential Guide to API Monitoring: Basics Metrics & Choosing the Best Tools](https://sematext.com/blog/api-monitoring/)

## Folder and File Structure

So instead of using typical layered style when all application is divided into services, controllers etc, we divide everything by modules. Now, how to structure files inside those modules?

A lot of people tend to do the same thing as before: create a separate folders/files for services, controllers etc and keep all module's use-cases logic there, making those controllers and services bloated with responsibilities. This is the same approach that makes navigation harder.

Using this approach, every time something in a service changes, we might have to go to another folder to change controllers, and then go to dtos folder to change the corresponding dto etc.

It would be more logical to separate every module by components and have all the related files close together. Now if a use-case changes, those changes are usually made in a single use-case component, not everywhere across the module.

This is called [The Common Closure Principle (CCP)](https://ericbackhage.net/clean-code/the-common-closure-principle/). Folder/file structure in this project uses this principle. Related files that usually change together (and are not used by anything else outside of that component) are stored close together, in a single use-case folder. Check user [use-cases](src/modules/user/use-cases) folder for examples.

And shared files (like domain objects, repositories etc) are stored apart since those are reused by multiple use-cases. Domain layer is isolated, and use-cases which are essentially wrappers around business logic are treated as components. This approach makes navigation and maintaining easier. Check [user](src/modules/user) folder for an example.

> The aim here should to be strategic and place classes that we, from experience, know often changes together into the same component.

Keep in mind that this project's folder/file structure is an example and might not work for everyone. Main recommendations here are:

- Separate you application into modules;
- Keep files that change together close to each other (Common Closure Principle);
- Group files by their behavior that changes together, not by type of functionality that file provides;
- Keep files that are reused by multiple components apart;
- Respect boundaries in your code, keeping files together doesn't mean inner layers can import outer layers;
- Try to avoid a lot of nested folders;
- [Move files around until it feels right](https://dev.to/dance2die/move-files-around-until-it-feels-right-2lek).

There are different approaches to file/folder structuring, like explicitly separating each layer into a corresponding folder. This defines boundaries more clearly but is harder to navigate. Choose what suits better for the project/personal preference.

## File names

Consider giving a descriptive type names to files after a dot "`.`", like `*.service.ts` or `*.entity.ts`. This makes it easier to differentiate what files does what and makes it easier to find those files using [fuzzy search](https://en.wikipedia.org/wiki/Approximate_string_matching) (`CTRL+P` for Windows/Linux and `⌘+P` for MacOS in VSCode to try it out).

Read more:

- [Angular Style Guides: Separate file names with dots and dashes](https://angular.io/guide/styleguide#separate-file-names-with-dots-and-dashes).

## Static Code Analysis

> Static code analysis is a method of debugging by examining source code before a program is run.

For JavasScript and TypeScript, [Eslint](https://www.npmjs.com/package/eslint) with [typescript-eslint plugin](https://www.npmjs.com/package/@typescript-eslint/eslint-plugin) and some rules (like [airbnb](https://www.npmjs.com/package/eslint-config-airbnb) / [airbnb-typescript](https://www.npmjs.com/package/eslint-config-airbnb-typescript)) can be a great tool to enforce writing better code.

Try to make linter rules reasonably strict, this will help greatly to avoid "shooting yourself in a foot". Strict linter rules can prevent bugs and even serious security holes ([eslint-plugin-security](https://www.npmjs.com/package/eslint-plugin-security)).

> **Adopt programming habits that constrain you, to help you to limit mistakes**.

For example:

Using _explicit_ `any` type is a bad practice. Consider disallowing it (and other things that may cause problems):

```javascript
// .eslintrc.js file
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    // ...
  }
```

Also, enabling strict mode in `tsconfig.json` is recommended, this will disallow things like _implicit_ `any` types:

```json
  "compilerOptions": {
    "strict": true,
    // ...
  }
```

Example file: [.eslintrc.js](.eslintrc.js)

[Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) may be a good addition to eslint.

Read more:

- [What Is Static Analysis?](https://www.perforce.com/blog/sca/what-static-analysis)
- [Controlling Type Checking Strictness in TypeScript](https://www.carlrippon.com/controlling-type-checking-strictness-in-typescript/)

## Code formatting

The way code looks adds to our understanding of it. Good style makes reading code a pleasurable and consistent experience.

Consider using code formatters like [Prettier](https://www.npmjs.com/package/prettier) to maintain same code styles in the project.

Read more:

- [Why Coding Style Matters](https://www.smashingmagazine.com/2012/10/why-coding-style-matters/)

## Documentation

Here are some useful tips to help users/other developers to use your program.

### Document APIs

Use [OpenAPI](https://swagger.io/specification/) (Swagger) or [GraphQL](https://graphql.org/) specifications. Document in details every endpoint. Add description and examples of every request, response, properties and exceptions that endpoints may return or receive as body/parameters. This will help greatly to other developers and users of your API.

Example files:

- [user.response.dto.ts](src/modules/user/dtos/user.response.dto.ts) - notice `@ApiProperty()` decorators. This is [NestJS Swagger](https://docs.nestjs.com/openapi/types-and-parameters) module.
- [create-user.http.controller.ts](src/modules/user/use-cases/create-user/create-user.http.controller.ts) - notice `@ApiOperation()` and `@ApiResponse()` decorators.

Read more:

- [Documenting a NodeJS REST API with OpenApi 3/Swagger](https://medium.com/wolox/documenting-a-nodejs-rest-api-with-openapi-3-swagger-5deee9f50420)
- [Best Practices in API Documentation](https://swagger.io/blog/api-documentation/best-practices-in-api-documentation/)

### Add Readme

Create a simple readme file in a git repository that describes basic app functionality, available CLI commands, how to setup a new project etc.

### Try to make your code readable

Code can be self-documenting to some degree. One useful trick is to separate complex code to smaller chunks with a descriptive name. For example:

- Separating a big function into a bunch of small ones with descriptive names, each with a single responsibility;
- Moving in-line primitives or hard to read conditionals into a variable with a descriptive name.

This makes code easier to understand and maintain.

Read more:

- [Tips for Writing Self-Documenting Code](https://itnext.io/tips-for-writing-self-documenting-code-e54a15e9de2?gi=424f36cc1604)

### Avoid useless comments

Writing readable code, using descriptive function/method/variable names and creating tests can document your code well enough. Try to avoid comments when possible and try to make your code legible and tested instead.

Use comments only when it's really needed. Commenting may be a code smell in some cases, like when code gets changed but a developer forgets to update a comment (comments should be maintained, too).

> Code never lies, comments sometimes do.

Use comments only in some special cases, like when writing an counter-intuitive "hack" or performance optimization which is hard to read.

For documenting public APIs use code annotations (like [JSDoc](https://en.wikipedia.org/wiki/JSDoc)) instead of comments, this works nicely with code editor [intellisense](https://code.visualstudio.com/docs/editor/intellisense).

Read more:

- [Code Comment Is A Smell](https://fagnerbrack.medium.com/code-comment-is-a-smell-4e8d78b0415b)
- [// No comments](https://medium.com/swlh/stop-adding-comments-to-your-code-80a3575519ad)

### Prefer typed languages

Types give useful semantic information to a developer and can be useful for documenting code, so prefer static typed languages to dynamic typed (untyped) languages for larger projects (for example by using TypeScript over JavaScript).

**Note**: For smaller projects/scripts/jobs static typing may not be needed.

## Make application easy to setup

There are a lot of projects out there which take effort to configure after downloading it. Everything has to be set up manually: database, all configs etc. If new developer joins the team he has to waste a lot of time just to make application work.

This is a bad practice and should be avoided. Setting up project after downloading it should be as easy as launching one or few commands in terminal. Consider adding scripts to do this automatically:

- [package.json scripts](https://krishankantsinghal.medium.com/scripting-inside-package-json-4b06bea74c0e)
- [docker-compose file](https://docs.docker.com/compose/)
- [Makefile](https://opensource.com/article/18/8/what-how-makefile)
- Database seeding and migrations (described below)
- or any other tools.

Example files:

- [package.json](package.json) - notice all added scripts for launching tests, migrations, seeding, docker environment etc.
- [docker-compose.yml](docker/docker-compose.yml) - after configuring everything in a docker-compose file, running a database and a db admin panel (and any other additional tools) can be done using only one command. This way there is no need to install and configure a database separately.

## Seeds

To avoid manually creating data in the database, seeding is a great solution to populate database with data for development and testing purposes (e2e testing). [Wiki description](https://en.wikipedia.org/wiki/Database_seeding).

This project uses [typeorm-seeding](https://www.npmjs.com/package/typeorm-seeding#-using-entity-factory) package.

Example file: [user.seeds.ts](src/modules/user/database/seeding/user.seeds.ts)

## Migrations

Migrations are used for database table/schema changes:

> Database migration refers to the management of incremental, reversible changes and version control to relational database schemas. A schema migration is performed on a database whenever it is necessary to update or revert that database's schema to some newer or older version.

Source: [Wiki](https://en.wikipedia.org/wiki/Schema_migration)

Migrations should be generated every time database table schema is changed. When pushed to production it can be launched automatically.

**BE CAREFUL** not to drop some columns/tables that contain data by accident. Perform data migrations before table schema migrations and always backup database before doing anything.

This project uses [Typeorm Migrations](https://github.com/typeorm/typeorm/blob/master/docs/migrations.md) which automatically generates sql table schema migrations like this:

Example file: [1611765824842-CreateTables.ts](src/infrastructure/database/migrations/1611765824842-CreateTables.ts)

Seeds and migrations belong to Infrastructure layer.

## Rate Limiting

By default there is no limit on how many request users can make to your API. This may lead to problems, like [DoS](https://en.wikipedia.org/wiki/Denial-of-service_attack) or brute force attacks, performance issues like high response time etc.

To solve this, implementing [Rate Limiting](https://en.wikipedia.org/wiki/Rate_limiting) is essential for any API.

- In NodeJS world, [express-rate-limit](https://www.npmjs.com/package/express-rate-limit) is an option for simple APIs.
- Another alternative is [NGINX Rate Limiting](https://www.nginx.com/blog/rate-limiting-nginx/).
- [Kong](https://konghq.com/kong/) has [rate limiting plugin](https://docs.konghq.com/hub/kong-inc/rate-limiting/).

Read more:

- [Everything You Need To Know About API Rate Limiting ](https://nordicapis.com/everything-you-need-to-know-about-api-rate-limiting/)
- [Rate-limiting strategies and techniques](https://cloud.google.com/solutions/rate-limiting-strategies-techniques)
- [How to Design a Scalable Rate Limiting Algorithm](https://konghq.com/blog/how-to-design-a-scalable-rate-limiting-algorithm/)

## Code Generation

Code generation can be important when using complex architectures to avoid typing boilerplate code manually.

[Hygen](https://www.npmjs.com/package/hygen) is a great example.
This tool can generate building blocks (or entire modules) by using custom templates. Templates can be designed to follow best practices and concepts based on Clean/Hexagonal Architecture, DDD, SOLID etc.

Main advantages of automatic code generation are:

- Avoid manual typing or copy-pasting of boilerplate code.
- No hand-coding means less errors and faster implementations. Simple CRUD module can be generated and used right away in seconds without any manual code writing.
- Using auto-generated code templates ensures that everyone in the team uses the same folder/file structures, name conventions, architectural and code styles.

**Note**:

- To really understand and work with generated templates you need to understand what is being generated and why, so full understanding of an architecture and patterns used is required.

## Custom utility types

Consider creating a bunch of shared custom utility types for different situations.

Some examples can be found in [types](src/core/types) folder.

## Pre-push/pre-commit hooks

Consider launching tests/code formatting/linting every time you do `git push` or `git commit`. This prevents bad code getting in your repo. [Husky](https://www.npmjs.com/package/husky) is a great tool for that.

Read more:

- [Git Hooks](https://githooks.com/)

## Prevent massive inheritance chains

This can be achieved by making class `final`.

**Note**: in TypeScript, unlike other languages, there is no default way to make class `final`. But there is a way around it using a custom decorator.

Example file: [final.decorator.ts](src/core/decorators/final.decorator.ts)

Read more:

- [When to declare classes final](https://ocramius.github.io/blog/when-to-declare-classes-final/)
- [Final classes by default, why?](https://matthiasnoback.nl/2018/09/final-classes-by-default-why/)
- [Prefer Composition Over Inheritance](https://medium.com/better-programming/prefer-composition-over-inheritance-1602d5149ea1)

## Conventional commits

Conventional commits add some useful prefixes to your commit messages, for example:

- `feat: added ability to delete user's profile`

This creates a common language that makes easier communicating the nature of changes to teammates and also may be useful for automatic package versioning and release notes generation.

Read more:

- [conventionalcommits.org](https://www.conventionalcommits.org/en/v1.0.0-beta.2/)
- [Semantic Commit Messages](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716)
- [Commitlint](https://github.com/conventional-changelog/commitlint)
- [Semantic release](https://github.com/semantic-release/semantic-release)

---

# Additional resources

## Articles

- [DDD, Hexagonal, Onion, Clean, CQRS, … How I put it all together](https://herbertograca.com/2017/11/16/explicit-architecture-01-ddd-hexagonal-onion-clean-cqrs-how-i-put-it-all-together)
- [Hexagonal Architecture](https://www.qwan.eu/2020/08/20/hexagonal-architecture.html)
- [Clean architecture series](https://medium.com/@pereiren/clean-architecture-series-part-1-f34ef6b04b62)
- [Clean architecture for the rest of us](https://pusher.com/tutorials/clean-architecture-introduction)
- [An illustrated guide to 12 Factor Apps](https://www.redhat.com/architect/12-factor-app)

## Repositories

- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [The System Design Primer](https://github.com/donnemartin/system-design-primer)

## Documentation

- [The Twelve-Factor App](https://12factor.net/)
- [Refactoring guru - Catalog of Design Patterns](https://refactoring.guru/design-patterns/catalog)
- [Microsoft - Cloud Design Patterns](https://docs.microsoft.com/en-us/azure/architecture/patterns/index-patterns)

## Blogs

- [Martin Fowler](https://martinfowler.com/)
- [Kamil Grzybek](https://www.kamilgrzybek.com/)
- [Khalil Stemmler](https://khalilstemmler.com)
- [Herberto Graca](https://herbertograca.com/)

## Videos

- [More Testable Code with the Hexagonal Architecture](https://youtu.be/ujb_O6myknY)
- [Playlist: Design Patterns Video Tutorial](https://youtube.com/playlist?list=PLF206E906175C7E07)
- [Playlist: Design Patterns in Object Oriented Programming](https://youtube.com/playlist?list=PLrhzvIcii6GNjpARdnO4ueTUAVR9eMBpc)
- [Herberto Graca - Making architecture explicit](https://www.youtube.com/watch?v=_yoZN9Sb3PM&feature=youtu.be)

## Books

- ["Domain-Driven Design: Tackling Complexity in the Heart of Software" ](https://www.amazon.com/Domain-Driven-Design-Tackling-Complexity-Software/dp/0321125215) by Eric Evans
- ["Secure by Design"](https://www.manning.com/books/secure-by-design) by Dan Bergh Johnsson, Daniel Deogun, Daniel Sawano
- ["Implementing Domain-Driven Design"](https://www.amazon.com/Implementing-Domain-Driven-Design-Vaughn-Vernon/dp/0321834577) by Vaughn Vernon
- ["Clean Architecture: A Craftsman's Guide to Software Structure and Design"](https://www.amazon.com/Clean-Architecture-Craftsmans-Software-Structure/dp/0134494164/ref=sr_1_1?dchild=1&keywords=clean+architecture&qid=1605343702&s=books&sr=1-1) by Robert Martin
- [Designing Data-Intensive Applications: The Big Ideas Behind Reliable, Scalable, and Maintainable Systems](https://www.amazon.com/Designing-Data-Intensive-Applications-Reliable-Maintainable/dp/1449373321) by Martin Kleppmann
