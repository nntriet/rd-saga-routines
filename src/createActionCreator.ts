/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createAction } from './createAction';
import type { Action, P } from './types';

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    // eslint-disable-next-line no-bitwise
    const r = (Math.random() * 16) | 0;
    // eslint-disable-next-line no-bitwise
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Flux standard action creator factory
 * @example
 * createActionCreator('[Todo] truncate');
 * @example
 * createActionCreator(
 *   '[Todo] fetch rejected',
 *   resolve => (error: Error) => resolve(error)
 * );
 * @example
 * createActionCreator(
 *   '[Todo] fetch rejected',
 *   resolve => (error: Error, meta?: { status: number }) => resolve(error, meta)
 * )
 * @example
 * createActionCreator(
 *   '[Todo] add',
 *   resolve => (name: string, completed = false) => resolve({ name, completed })
 * )
 * @example
 * createActionCreator(
 *   '[Todo] add',
 *   resolve => (name: string, completed = false) => resolve({ name, completed }, 'Meta data of all todos')
 * )
 *
 */
export function createActionCreator<
  TType extends string,
  // eslint-disable-next-line @typescript-eslint/naming-convention,
  TCallable extends <_T>(...args: any[]) => Action<TType>
>(
  type: TType,
  executor: (
    resolve: <Payload = undefined, Meta = undefined>(
      payload?: Payload,
      meta?: P<Meta> extends void ? { requestId?: string } | void : P<Meta> & { requestId?: string },
    ) => Action<TType, Payload, P<Meta> extends void ? { requestId: string } : P<Meta> & { requestId: string }>,
  ) => TCallable = (resolve) => ((() => resolve()) as unknown) as TCallable,
) {
  const callable = executor((payload, meta) => {
    let requestId = meta?.requestId || '';
    if (type.endsWith('/REQUEST')) requestId = uuidv4();
    return createAction(requestId, type, payload!, meta!);
  });
  return Object.assign(callable, {
    type,
    toString() {
      return type;
    },
  });
}
