import type { AnyAction, ActionCreator, Handler, ImmerHandler } from './types';
import { getType } from './getType';

export type HandlerMap<TPrevState, TAction extends AnyAction, TNextState extends TPrevState = TPrevState> = {
  [type in TAction['type']]: Handler<TPrevState, TAction, TNextState>;
};
export type ImmerHandlerMap<TPrevState, TAction extends AnyAction> = {
	[type in TAction['type']]: ImmerHandler<TPrevState, TAction>;
};

export type InferActionFromHandlerMap<THandlerMap extends HandlerMap<any, any>> = THandlerMap extends HandlerMap<
  any,
  infer T
>
  ? T
  : never;
export type InferActionFromImmerHandlerMap<THandlerMap extends ImmerHandlerMap<any, any>> = THandlerMap extends ImmerHandlerMap<
  any,
  infer T
>
  ? T
  : never;

export type InferNextStateFromHandlerMap<THandlerMap extends HandlerMap<any, any>> = THandlerMap extends HandlerMap<
  any,
  any,
  infer T
>
  ? T
  : never;

export type InferNextStateFromImmerHandlerMap<THandlerMap extends ImmerHandlerMap<any, any>> = THandlerMap extends ImmerHandlerMap<
  infer T,
  any
>
  ? T
  : never;

export type CreateHandlerMap<TPrevState> = <
  TActionCreator extends ActionCreator<any>,
  TNextState extends TPrevState,
  TAction extends AnyAction = TActionCreator extends (...args: any[]) => infer T ? T : never
>(
  actionCreators: TActionCreator | TActionCreator[],
  handler: Handler<TPrevState, TAction, TNextState>,
) => HandlerMap<TPrevState, TAction, TNextState>;
export type CreateImmerHandlerMap<TPrevState> = <
	TActionCreator extends ActionCreator<any>,
	TAction extends AnyAction = TActionCreator extends (...args: any[]) => infer T ? T : never,
>(
	actionCreators: TActionCreator | TActionCreator[],
	handler: ImmerHandler<TPrevState, TAction>,
) => ImmerHandlerMap<TPrevState, TAction>;

/**
 * Handler map factory
 * @description create an action(s) to reducer map
 * @example
 * createHandlerMap(increment, (state: number) => state + 1)
 * @example
 * createHandlerMap([increment, increase], (state: number) => state + 1)
 */
export function createHandlerMap<
  TActionCreator extends ActionCreator<any>,
  TPrevState,
  TNextState extends TPrevState,
  TAction extends AnyAction = TActionCreator extends (...args: any[]) => infer T ? T : never
>(actionCreators: TActionCreator | TActionCreator[], handler: Handler<TPrevState, TAction, TNextState>) {
  return (Array.isArray(actionCreators) ? actionCreators : [actionCreators])
    .map(getType)
    .reduce<HandlerMap<TPrevState, TAction, TNextState>>((acc, type) => {
      acc[type] = handler;
      return acc;
    }, {} as any);
}
