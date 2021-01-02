import { createAction } from './createAction';
import type { Action, P } from './types';

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
  TCallable extends <_T>(...args: any[]) => Action<TType> | Promise<Action<TType>>
>(
  type: TType,
  executor: (
    resolve: <Payload = undefined, Meta = undefined>(
      payload?: Payload,
      meta?: P<Meta>,
    ) => Action<TType, Payload, NonNullable<P<Meta>>>,
  ) => TCallable = (resolve) => ((() => resolve()) as unknown) as TCallable,
) {
  const callable = executor((payload, meta) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return createAction(type, payload!, meta!);
  });

  return Object.assign(callable, {
    type,
    toString() {
      return type;
    },
  });
}
