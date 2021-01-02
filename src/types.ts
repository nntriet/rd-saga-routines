/* eslint-disable @typescript-eslint/no-empty-interface */

// eslint-disable-next-line @typescript-eslint/ban-types
type Primitive = undefined | null | boolean | string | number | Function;

export interface DeepImmutableArray<T> extends ReadonlyArray<DeepImmutable<T>> {}
export interface DeepImmutableMap<K, V> extends ReadonlyMap<DeepImmutable<K>, DeepImmutable<V>> {}
export type DeepImmutableObject<T> = {
  readonly [K in keyof T]: DeepImmutable<T[K]>;
};

export type Immutable<T> = T extends Primitive
  ? T
  : T extends Array<infer U>
  ? ReadonlyArray<U>
  : T extends Map<infer K, infer V>
  ? ReadonlyMap<K, V>
  : T extends ReadonlyArray<any>
  ? T
  : T extends ReadonlyMap<any, any>
  ? T
  : Readonly<T>;

export type DeepImmutable<T> = T extends Primitive
  ? T
  : T extends Array<infer U>
  ? DeepImmutableArray<U>
  : T extends Map<infer K, infer V>
  ? DeepImmutableMap<K, V>
  : T extends ReadonlyArray<infer U>
  ? DeepImmutableArray<U>
  : T extends ReadonlyMap<infer K, infer V>
  ? DeepImmutableMap<K, V>
  : DeepImmutableObject<T>;

export type Handler<TPrevState, TAction, TNextState extends TPrevState = TPrevState> = (
  prevState: TPrevState,
  action: TAction,
) => TNextState;

export type Reducer<TPrevState, TAction, TNextState extends TPrevState = TPrevState> = (
  state: TPrevState | undefined,
  action: TAction,
) => TNextState;

export type Action<TType extends string, TPayload = undefined, TMeta = undefined> = TPayload extends undefined
  ? TMeta extends undefined
    ? {
        type: TType;
      }
    : {
        type: TType;
        meta: TMeta;
      }
  : TPayload extends Error
  ? TMeta extends undefined
    ? {
        type: TType;
        payload: TPayload;
        error: true;
      }
    : {
        type: TType;
        payload: TPayload;
        meta: TMeta;
        error: true;
      }
  : TMeta extends undefined
  ? {
      type: TType;
      payload: TPayload;
    }
  : {
      type: TType;
      payload: TPayload;
      meta: TMeta;
    };

export type AnyAction = Action<string>;

export type ActionCreator<T extends AnyAction | string> = {
  (...args: any[]): T extends string ? Action<T> : T;
  type: T extends AnyAction ? T['type'] : T;
  toString(): T extends AnyAction ? T['type'] : T;
};
export type P<Params> = Params extends undefined ? void : Params;

export type ActionType<
  T extends ActionCreator<AnyAction> | Reducer<any, Action<any>>
> = T extends ActionCreator<AnyAction> ? ReturnType<T> : T extends Reducer<any, infer U> ? U : never;

export type ExtractAction<TAction, TKey> = TKey extends string
  ? TAction extends Action<TKey>
    ? TAction & Action<TKey>
    : AnyAction extends TAction
    ? TAction & Action<TKey>
    : never
  : TKey extends ActionCreator<AnyAction>
  ? ReturnType<TKey> extends TAction
    ? ReturnType<TKey>
    : never
  : TKey extends AnyAction
  ? TKey extends TAction
    ? TKey
    : never
  : never;
