export default function Singleton<T>() {
  class Singleton {
    private static instance: T;

    static get Instance(): T {
      return this.instance;
    }

    constructor() {
      if (!Singleton.instance) {
        Singleton.instance = this as unknown as T;
      } else {
        throw `${Singleton.instance.constructor.name} instance already exist`;
      }
    }
  }

  return Singleton;
}
