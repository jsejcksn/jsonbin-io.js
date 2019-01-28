# Front-end JavaScript API for [JSONbin.io](https://jsonbin.io) {☁️}

[View API Reference](https://jsonbin.io/api-reference/)


## Table of Contents

  - [Download](#download)
  - [Use](#use)
  - [Get your API secret key](#get-your-api-secret-key)
  - [Endpoints](#endpoints)
    - [Bins](#bins)
      - [Create](#create)
      - [Read](#read)
      - [Update](#update)
      - [Delete](#delete)
    - [Collections](#collections)
      - [Create](#create-1)
      - [Update](#update-1)
    - [Experimental](#experimental)
      - [Versions](#versions)
    - [Geolocation](#geolocation)
      - [Lookup](#lookup)
  - [CodePen Demo](#codepen-demo)


# Download

``` shell
npm i jsonbin-io.js
```

[or download file directly from GitHub](https://github.com/jsejcksn/jsonbin-io.js/raw/master/src/jsonbin-io.js)


# Use

``` js
// Import the class from module
import JSONbin from './node_modules/jsonbin-io.js/src/jsonbin-io.js';

// Initialize an object from the imported class
const jsonbinPrivate = new JSONbin(🔑); // Secret key: private data and more features
const jsonbinPublic = new JSONbin(); // No secret key: only interact with public data
```


# Get your API secret key

A secret key is not required in order to use the core functionality of JSONbin.io. However, one is needed in order to create private bins, and to use more features of the API. You can get one at [https://jsonbin.io/api-keys](https://jsonbin.io/api-keys).


# Endpoints

> All methods in this library return promises

🔑 = feature that requires using a secret key  
🔐 = parameter that requires using a secret key


## Bins


### [Create](https://jsonbin.io/api-reference/bins/create)

Create a public bin

🔑 Create a private bin (or—optionally—a public bin) and link it to your account

> ⚠️ **Bins created without a secret key are public and cannot be deleted.**

#### Syntax

``` js
jsonbin.create(data[, collectionId[, name[, makePublic]]]);
```

#### Parameters

**`data`** _object_  
The data content of the bin—will be passed to `JSON.stringify()`.

🔐 **`collectionId`** _string_ or _null_  
(Optional) To add the bin to a collection that you created, set the ID of that collection.

🔐 **`name`** _string_ or _null_  
(Optional) Set the name of the bin. 128-character max length.

🔐 **`makePublic`** _boolean_  
(Optional) When using a secret key, bins are created private by default. Set to `true` to make the bin public.

#### Return value

📬 _string_  
ID of the created bin.

#### Example

``` js
(async () => {
  const data = {a: 1, b: 2, c: ['dogs', 'cats', 'motorcycles']};
  const id = await jsonbin.create(data);
  console.log(id); //-> 5c4cc6e7a1021c254834adab
})();
```


### [Read](https://jsonbin.io/api-reference/bins/read)

Read a public bin

🔑 Read a private bin

#### Syntax

``` js
jsonbin.read(id[, version]);
```

#### Parameters

**`id`** _string_  
ID of the bin to read.

**`version`** _integer_  
(Optional) Version of the bin to read. Set to `0` to get the original version. Defaults to "latest".

#### Return value

📬 _object_  
The data content of the bin.

#### Example

``` js
(async () => {
  const id = '5c4cc6e7a1021c254834adab';
  const data = await jsonbin.read(id, 0);
  console.log(data); //-> {"c":["dogs","cats","motorcycles"],"b":2,"a":1}
})();
```


### [Update](https://jsonbin.io/api-reference/bins/update)

Crate a new version in a public bin

🔑 Create a new version in a private bin

#### Syntax

``` js
jsonbin.update(id, data[, replaceLatest]);
```

#### Parameters

**`id`** _string_  
ID of the bin to update.

**`data`** _object_  
The data content of the bin—will be passed to `JSON.stringify()`.

🔐 **`replaceLatest`** _boolean_  
(Optional, Private bins only) Set to `true` to replace the content of the latest version of the bin instead of creating a new version.

#### Return value

📬 _integer_  
Version of the bin.

#### Example

``` js
(async () => {
  const id = '5c4cc6e7a1021c254834adab';
  const newData = [1, 2, 'dogs', 'cats', 'motorcycles'];
  const version = await jsonbin.update(id, newData);
  console.log(version); //-> 1
  console.log(await jsonbin.read(id, version)); //-> [1,2,"dogs","cats","motorcycles"]
})();
```


### [Delete](https://jsonbin.io/api-reference/bins/delete)

🔑 Delete a bin that was created with a secret key from your account

#### Syntax

``` js
jsonbin.delete(id);
```

#### Parameters

🔐 **`id`** _string_  
ID of the bin to delete.

#### Return value

📬 _string_  
A message indicating that the bin has been deleted and the number of versions that it had.

#### Example

``` js
// Won't work without secret key

import JSONbin from './node_modules/jsonbin-io.js/src/jsonbin-io.js';
const jsonbin = new JSONbin(); // No secret key

(async () => {
  const id = '5c4cc6e7a1021c254834adab';
  const message = await jsonbin.delete(id); // "Error 401: Need to provide a secret-key to DELETE bins"
  console.log(message); //-> undefined
  console.log(await jsonbin.read(id)); //-> [1,2,"dogs","cats","motorcycles"]
})();
```

``` js
// Works!

import JSONbin from './node_modules/jsonbin-io.js/src/jsonbin-io.js';
const jsonbin = new JSONbin(🔑); // Secret key

(async () => {
  const data = {a: 1, b: 2, c: [3, 4, 5]};
  const id = await jsonbin.create(data);
  console.log(id); //-> 5c4ce1de5bc16725808d4056
  const version = await jsonbin.update(id, data.c);
  console.log(version); //-> 1

  const msg = await jsonbin.delete(id);
  console.log(msg); //-> "Bin 5c4ce1de5bc16725808d4056 is deleted successfully. 1 versions removed."
})();
```


## Collections


### [Create](https://jsonbin.io/api-reference/collections/create)

🔑 Create a collection

#### Syntax

``` js
jsonbin.c.create(name);
```

#### Parameters

🔐 **`name`** _string_  
(Optional) Set the name of the collection. 3 to 32 characters.

#### Return value

📬 _string_  
ID of the created collection.


### [Update](https://jsonbin.io/api-reference/collections/update)

🔑 Update the name of a collection

#### Syntax

``` js
jsonbin.c.update(id , name);
```

#### Parameters

🔐 **`id`** _string_  
ID of the collection to update.

🔐 **`name`** _string_  
Set the new name of the collection. 3 to 32 characters.

#### Return value

📬 _boolean_  
`true`


## Experimental

> These are part of the experimental API and are subject to change.


### [Versions](https://jsonbin.io/api-reference/experimental/request-versions)

Get a list of the versions of a public bin

🔑 Get a list of the versions of a private bin

#### Syntax

``` js
jsonbin.e.versions(id);
```

#### Parameters

**`id`** _string_  
ID of the bin to query.

#### Return value

📬 _object_  
Contains a count of bin versions and a list of versions with associated timestamps.

#### Example

``` js
(async () => {
  const id = '5c4cc6e7a1021c254834adab';
  const versions = await jsonbin.e.versions(id);
  console.log(versions); //-> (See next code block for formatted output 👇)
})();
```

```js
// Formatted console output:

{
  "binVersions": [
    {
      "version": 2,
      "created": "2019-01-27T04:22:55.847Z"
    },
    {
      "version": 1,
      "created": "2019-01-26T21:00:55.558Z"
    }
  ],
  "versionCount": 2,
  "success": true
}
```


## Geolocation


### [Lookup](https://jsonbin.io/api-reference/geoip/lookup)

Get geographical information about an IP address

#### Syntax

``` js
jsonbin.g.lookup(address);
```

#### Parameters

**`address`** _string_  
IPv4 or IPv6 address to query.

#### Return value

📬 _object_  
Geographical properties associated to the reported location of the IP address.

#### Example

``` js
(async () => {
  const address = '199.59.149.165';
  const features = await jsonbin.g.lookup(address);
  console.log(features); //-> (See next code block for formatted output 👇)
})();
```

``` js
// Formatted console output:

{
  "range": [
    3342570496,
    3342571519
  ],
  "country": "US",
  "region": "NA",
  "eu": "0",
  "timezone": "America/Los_Angeles",
  "city": "San Francisco",
  "ll": [
    37.7758,
    -122.4128
  ],
  "metro": 807,
  "area": 1000
}
```


# CodePen Demo

You can experiment and learn using [this interactive CodePen example](https://codepen.io/anon/pen/rPeRrb?editors=0012).
