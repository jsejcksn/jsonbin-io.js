'use strict';

export default class {
  constructor (secretKey) {
    if (secretKey) {
      this.key = secretKey;
    }
    this.url = {
      origin: 'https://api.jsonbin.io',
      path: {
        bin: '/b',
        collection: '/c',
        experimental: '/e',
        geolocation: '/g'
      }
    };
  }

  get c () {
    return {
      key: this.key ? this.key : undefined,
      transmit: this.transmit,
      url: this.url,
      async create (name) {
        const init = {
          method: 'POST',
          headers: {'Content-Type': 'application/json'}
        };
        if (this.key) {
          Object.assign(init.headers, {'secret-key': this.key});
          if (name) {
            Object.assign(init, {body: JSON.stringify({name: name})});
          }
        }
        return this.transmit(new Request(`${this.url.origin}${this.url.path.collection}`, init), 'c.create');
      },
      async update (id, name) {
        const init = {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'}
        };
        if (this.key) {
          Object.assign(init.headers, {'secret-key': this.key});
          if (name) {
            Object.assign(init, {body: JSON.stringify({name: name})});
          }
        }
        return this.transmit(new Request(`${this.url.origin}${this.url.path.collection}/${id}`, init), 'c.update');
      }
    };
  }

  get e () {
    return {
      key: this.key ? this.key : undefined,
      transmit: this.transmit,
      url: this.url,
      async versions (id) {
        const init = {
          method: 'GET'
        };
        if (this.key) {
          init.headers = {'secret-key': this.key};
        }
        return this.transmit(new Request(`${this.url.origin}${this.url.path.experimental}/${id}/versions`, init), 'e.versions');
      }
    };
  }

  get g () {
    return {
      transmit: this.transmit,
      url: this.url,
      async lookup (address) {
        return this.transmit(new Request(`${this.url.origin}${this.url.path.geolocation}/${address}`), 'g.lookup');
      }
    };
  }

  async create (data, collectionId, name, makePublic) {
    const init = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    };
    if (this.key) {
      Object.assign(init.headers, {'secret-key': this.key});
      if (collectionId) {
        Object.assign(init.headers, {'collection-id': collectionId});
      }
      if (name) {
        Object.assign(init.headers, {'name': name});
      }
      if (makePublic) {
        Object.assign(init.headers, {'private': false});
      }
    }
    return this.transmit(new Request(`${this.url.origin}${this.url.path.bin}`, init), 'create');
  }

  async delete (id) {
    const init = {
      method: 'DELETE'
    };
    if (this.key) {
      init.headers = {'secret-key': this.key};
    }
    return this.transmit(new Request(`${this.url.origin}${this.url.path.bin}/${id}`, init), 'delete');
  }

  async read (id, version = '/latest') {
    const init = {
      method: 'GET'
    };
    if (typeof version === 'number') {
      version = parseInt(version, 10);
      if (version === 0) {
        version = '';
      }
      version = `/${version}`;
    }
    if (this.key) {
      init.headers = {'secret-key': this.key};
    }
    return this.transmit(new Request(`${this.url.origin}${this.url.path.bin}/${id}${version}`, init), 'read');
  }

  async update (id, data, replaceLatest) {
    const init = {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    };
    if (this.key) {
      Object.assign(init.headers, {'secret-key': this.key});
      if (replaceLatest) {
        Object.assign(init.headers, {'versioning': false});
      }
    }
    return this.transmit(new Request(`${this.url.origin}${this.url.path.bin}/${id}`, init), 'update');
  }

  async transmit (request, operation) {
    try {
      const res = await fetch(request);
      if (res.ok) {
        const json = await res.json();
        switch (operation) {
          case 'create':
            return json.id;
          case 'delete':
            return json.message;
          case 'read':
            return json;
          case 'update':
            return json.version;
          case 'c.create':
            return json.id;
          case 'c.update':
            return json.success;
          case 'g.lookup':
            return json.data;
          default:
            return json;
        }
      }
      else {
        const json = await res.json();
        throw new Error(`Error ${res.status}: ${json.message}`);
      }
    }
    catch (err) {
      const msg = err.message;
      console.error(msg); // eslint-disable-line no-console
    }
  }
}
