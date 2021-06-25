import { createActionCreator } from './createActionCreator';
import { getType } from './getType';
import type { Action, P } from './types';

/**
 * Creates a set of life-cycle actions that are
 * useful for asynchronous actions like fetching data
 *
 * ```ts
 * const fetchFoo = createRoutine<Foo, { id: string }>('FETCH_FOO')
 * const fetchAll = createRoutine<Foo[]>('FETCH_ALL_FOO')
 * ```
 *
 * @param typePrefix    prefix for action type
 * @typeparam Payload   the data to be merged into state, usually a domain object from your API
 * @typeparam Params    the metadata required to start a routine, for example the ID of an object
 */
export const createRoutine: RoutineCreator = <Payload = void, Params = void>(
  typePrefix: string,
): Routine<Payload, Params> => {
  const request = createActionCreator(
    `${typePrefix}/REQUEST`,
    (resolve) => (
      params: P<Params> extends void ? { requestId?: string } | void : P<Params> & { requestId?: string },
    ) => resolve(undefined, params),
  );
  const success = createActionCreator(
    `${typePrefix}/SUCCESS`,
    (resolve) => (
      payload: Payload,
      params: P<Params> extends void ? { requestId?: string } | void : P<Params> & { requestId?: string },
    ) => resolve(payload, params),
  );
  const failure = createActionCreator(
    `${typePrefix}/FAILURE`,
    (resolve) => (
      error: Error,
      params: P<Params> extends void ? { requestId?: string } | void : P<Params> & { requestId?: string },
    ) => resolve(error, params),
  );

  return {
    request,
    success,
    failure,
    PREFIX: typePrefix,
    REQUEST: getType(request),
    SUCCESS: getType(success),
    FAILURE: getType(failure),
  };
};

export const createPlainAction = <Params = void>(
  type: string,
): ((
  params: P<Params> extends void ? { requestId?: string } | void : P<Params> & { requestId?: string },
) => Action<
  string,
  undefined,
  NonNullable<P<Params> extends void ? { requestId?: string } | void : P<Params> & { requestId?: string }>
>) & {
  type: string;
  toString(): string;
} => {
  const plainAction = createActionCreator(
    type,
    (resolve) => (
      params: P<Params> extends void ? { requestId?: string } | void : P<Params> & { requestId?: string },
    ) => resolve(() => undefined, params),
  );
  return plainAction;
};

export interface Routine<Payload, Params> {
  /**
   * Request the start of a Routine
   * ```ts
   * dispatch(fetchFoo.request({ id: '5'}))
   * ```
   */

  request: ((
    payload: P<Params> extends void ? { requestId?: string } | void : P<Params> & { requestId?: string },
  ) => Action<
    string,
    undefined,
    NonNullable<P<Params> extends void ? { requestId?: string } | void : P<Params> & { requestId?: string }>
  >) & {
    type: string;
    toString(): string;
  };

  /**
   * Signal the end of a Routine that was successful
   *
   * ```ts
   * dispatch(fetchFoo.success(foo))
   * ```
   */
  success: ((
    payload: Payload,
    params: P<Params> extends void ? { requestId?: string } | void : P<Params> & { requestId?: string },
  ) => Action<
    string,
    Payload,
    NonNullable<P<Params> extends void ? { requestId?: string } | void : P<Params> & { requestId?: string }>
  >) & {
    type: string;
    toString(): string;
  };

  /**
   * Signal the end of a Routine that failed
   *
   * ```ts
   * dispatch(fetchFoo.failure(error))
   * ```
   */
  failure: ((
    error: Error,
    params: P<Params> extends void ? { requestId?: string } | void : P<Params> & { requestId?: string },
  ) => Action<
    string,
    Error,
    NonNullable<P<Params> extends void ? { requestId?: string } | void : P<Params> & { requestId?: string }>
  >) & {
    type: string;
    toString(): string;
  };

  /**
   * The prefix the routine was created with
   */
  PREFIX: string;

  /**
   * Type used by `request()`, subscribe to this in your Saga
   */
  REQUEST: string;
  /**
   * Type used by `success()`, subscribe to this in your Saga
   */
  SUCCESS: string;
  /**
   * Type used by `failure()`, subscribe to this in your Saga
   */
  FAILURE: string;
}

export type RoutineCreator = <Payload = void, Params = void>(prefix: string) => Routine<Payload, Params>;
