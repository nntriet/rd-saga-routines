import {
  createHandlerMap,
  CreateHandlerMap,
  HandlerMap,
  InferActionFromHandlerMap,
  InferNextStateFromHandlerMap,
} from './createHandlerMap';
import type { AnyAction } from './types';

/**
 * Reducer factory
 * @description combines multiple handler map into single reducer
 * @example
 * const counter = createReducer(0, handleAction => [
 *   handleAction(increment, state => state + 1),
 *   handleAction(decrement, state => state - 1),
 * ])
 */
const merge = <T extends Record<string, any>>(...objs: T[]): T => Object.assign({}, ...objs);

export function createReducer<TPrevState, THandlerMap extends HandlerMap<TPrevState, any, any>>(
  defaultState: TPrevState,
  handlerMapsCreator: (handle: CreateHandlerMap<TPrevState>) => THandlerMap[],
) {
  const handlerMap = merge(...handlerMapsCreator(createHandlerMap));

  return (
    state = defaultState,
    action: InferActionFromHandlerMap<THandlerMap> | AnyAction,
  ): InferNextStateFromHandlerMap<THandlerMap> => {
    const handler = handlerMap[(<any>action).type];

    return handler ? handler(<any>state, action) : state;
  };
}
