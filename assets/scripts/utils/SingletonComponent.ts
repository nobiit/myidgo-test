export default function SingletonComponent<T>() {
  class Singleton extends cc.Component {
    private static instance: T;

    static get Instance(): T {
      return this.instance;
    }

    onLoad() {
      if (!Singleton.instance) {
        Singleton.instance = this as unknown as T;
      } else {
        throw `${Singleton.instance.constructor.name} instance already exist`;
      }
    }
  }

  return Singleton;
}
