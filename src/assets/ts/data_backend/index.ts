import localForage from 'localforage';
// import "firebase/auth";

import DataBackend, { SynchronousDataBackend } from '../../../shared/data_backend';
import { ExtendableError } from '../../../shared/utils/errors';

export type BackendType = 'local' | 'inmemory';

export class MultipleUsersError extends ExtendableError {
  constructor() {
    super(
      'This document has been modified (in another tab) since opening it in this tab. Please refresh to continue!'
    );
  }
}

// NOTE: not very elegant, but this won't collide with other keys
// since prefix always contains either '*save' or 'settings:'.
// Future backends don't need to use this, as long as they prefix the key passed to them.
// Backends can prefix internal usage with internalPrefix to avoid namespace collision.
const internalPrefix: string = 'internal:';

export class SynchronousLocalStorageBackend extends SynchronousDataBackend {
  // constructor() {
  //   super();
  // }

  public get(key: string): string | null {
    const val = localStorage.getItem(key);
    if ((val == null) || (val === 'undefined')) {
      return null;
    }
    return val;
  }

  public set(key: string, value: string): void {
    return localStorage.setItem(key, value);
  }
}

export class LocalStorageBackend extends DataBackend {
  private lastSave: number;
  private docname: string;
  private sync_backend: SynchronousLocalStorageBackend;

  private _lastSaveKey_(): string {
    return `${internalPrefix}${this.docname}:lastSave`;
  }

  constructor(docname = '') {
    super();
    this.docname = docname;
    this.lastSave = Date.now();
    this.sync_backend = new SynchronousLocalStorageBackend();
  }

  public async get(key: string): Promise<string | null> {
    return this.sync_backend.get(key);
  }

  public async set(key: string, value: string): Promise<void> {
    if (this.getLastSave() > this.lastSave) {
      throw new MultipleUsersError();
    }
    this.lastSave = Date.now();
    this.sync_backend.set(this._lastSaveKey_(), this.lastSave + '');
    this.sync_backend.set(key, value);
  }

  // determine last time saved (for multiple tab detection)
  // note that this doesn't cache!
  public getLastSave(): number {
    return JSON.parse(this.sync_backend.get(this._lastSaveKey_()) || '0');
  }
}

export class IndexedDBBackend extends DataBackend {
  private lastSave: number;
  private docname: string;

  private _lastSaveKey_(): string {
    return `${internalPrefix}${this.docname}:lastSave`;
  }

  constructor(docname = '') {
    super();
    this.docname = docname;
    this.lastSave = Date.now();
  }

  public async get(key: string): Promise<string | null> {
    return localForage.getItem(key);
  }

  public async set(key: string, value: string): Promise<void> {
    if (await this.getLastSave() > this.lastSave) {
      throw new MultipleUsersError();
    }
    this.lastSave = Date.now();
    await localForage.setItem(this._lastSaveKey_(), this.lastSave + '');
    await localForage.setItem(key, value);
    return Promise.resolve();
  }

  // determine last time saved (for multiple tab detection)
  // note that this doesn't cache!
  public async getLastSave(): Promise<number> {
    return JSON.parse(await localForage.getItem(this._lastSaveKey_()) || '0');
  }
}
