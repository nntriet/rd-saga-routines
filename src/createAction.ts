import type { Action } from './types';

/**
 * Minimal (type-only) action factory
 * @example
 * const clearTodos = action('[Todo] truncate');
 */
export function createAction<TType extends string>(
  requestId: string,
  type: TType,
): Action<TType, undefined, { requestId?: string }>;
/**
 * Action with error factory
 * @example
 * const fetchTodosRejected = (payload: Error) => action('[Todo] fetch rejected', payload);
 */
export function createAction<TType extends string, TPayload extends Error>(
  requestId: string,
  type: TType,
  payload: TPayload,
): Action<TType, TPayload, { requestId?: string }>;
/**
 * Action with non-error payload factory
 * @example
 * const addTodo = ({ name, completed = false }: Todo) => action('[Todo] add', { name, completed });
 */
export function createAction<TType extends string, TPayload>(
  requestId: string,
  type: TType,
  payload: TPayload,
): Action<TType, TPayload, { requestId?: string }>;
/**
 * Action with error and meta factory
 * @example
 * const fetchTodosRejected = (payload: Error, meta?: Meta) => action('[Todo] fetch rejected', payload, meta);
 */
export function createAction<TType extends string, TPayload extends Error, TMeta>(
  requestId: string,
  type: TType,
  payload: TPayload,
  meta: TMeta,
): Action<TType, TPayload, TMeta & { requestId?: string }>;
/**
 * Action with payload and meta factory
 * @example
 * const addTodo = ({ name, completed = false }: Todo, meta?: Meta) => action('[Todo] add', { name, completed }, meta);
 */
export function createAction<TType extends string, TPayload, TMeta>(
  requestId: string,
  type: TType,
  payload: TPayload,
  meta: TMeta,
): Action<TType, TPayload, TMeta & { requestId?: string }>;

/**
 * Flux standard action factory
 * @example
 * const clearTodos = action('[Todo] truncate');
 * @example
 * const fetchTodosRejected = (payload: Error) => action('[Todo] fetch rejected', payload);
 * @example
 * const addTodo = ({ name, completed = false }: Todo) => action('[Todo] add', { name, completed });
 * @example
 * const fetchTodosRejected = (payload: Error, meta?: Meta) => action('[Todo] fetch rejected', payload, meta);
 * @example
 * const addTodo = ({ name, completed = false }: Todo, meta?: Meta) => action('[Todo] add', { name, completed }, meta);
 */

export function createAction<TType extends string, TPayload, TMeta>(
  requestId: string,
  type: TType,
  payload?: TPayload,
  meta?: TMeta,
) {
  return {
    type,
    ...(payload !== undefined ? { payload } : {}),
    ...{ meta: { ...meta, requestId } },
    ...(payload instanceof Error ? { error: true } : {}),
  };
}
