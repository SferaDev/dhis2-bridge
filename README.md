# dhis2-bridge
Fast and simple d2 replacement written in TypeScript

## Initial notes

This project is being developed as a submodule of https://github.com/SferaDev/Metadata-Management.

Once the project is ready for public usage it will be imported as a node dependency.

## Key concepts

### Multiple instance support

You can use the Bridge library on different DHIS2 instances, including the current instance of a React App or external instances with basic authentication. 

When using the init method you receive a different Bridge Class Instance with independent cache/preheat/subscriptions...

You can always retrieve all the existing Bridge Class Instances through an static method. 

### Cache and consistence

The main goal for the Bridge library is to be ```fast```, that's why one of our core principles is to re-use metadata.

Once we ask the API for an item we store it in a cache, so that if you re-request the same item the local version is used.

To preserve consistence over time, the cache updates any metadata element modified in the instance during the previous ```5 minutes```.

Cache is enabled by default but can be disabled with a flag during the configuration process.

### Metadata update subscription 

Since we keep consistency of the Metadata of remote instances, we can offer a subscription pattern so you can be notified when there are changes for either any element or an specific one. 

You can either wait for the consistency background task to detect the changes, reduce the wait time of the consistency task or even invalidate the cache to force a reload. 

This is different from the RabbitMQ or Kafka features from DHIS2 and only depends on the ```/metadata``` endpoint. 

### Preheating

But we do not stop by adding an intelligent cache, we introduce the core concept of **preheat**.

Based on the metadata previously loaded in Bridge, we automatically pre-load or ```preheat``` the dependencies found in the element.
With that ```preheat``` we determine what will you need next and make it available in the cache before you even need it.

Also during the cache-consistence clean-up, we **preheat** any recently metadata modified in the instance even if it wasn't called on Bridge.

Preheat is disabled by default because it's a network greedy feature, it can be enabled during the configuration process.
Even if you disable the automatic **preheat**, we expose the API so you can manually use the feature.

### Model independence

The main difference of Bridge and d2, is the model independence. We use an agnostic approach to obtain the metadata.
Instead of using the ```/api/xxx/uid.json``` endpoint we rely on the ```/api/metadata.json``` alternative.

This allows to mix metadata types in the same request and define generic model implementations.

You can still browse the **schemas** directly and list their elements with ease as you used in d2.

### Search and look-up

We are still working on the look-up implementation, some of the ideas include storing internally all the ids and names.
