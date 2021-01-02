import type { Dispatch } from 'redux';

import type { Routine } from './createRoutine';
import type { P } from './types';

export type PromiseActionType<Payload, Meta> = {
  type: string;
  payload: P<Meta>;
  meta: {
    defer: {
      resolve: (
        value: Payload extends void
          ? Meta extends void
            ? void
            : { meta: Meta }
          : Meta extends void
          ? { payload: Payload }
          : { payload: Payload; meta: Meta },
      ) => void;
      reject: (error: any) => void;
    };
    routine: Routine<Payload, Meta>;
  };
};

export const ROUTINE_PROMISE_ACTION = 'ROUTINE_PROMISE_ACTION';
export default function promisifyRoutine<Payload, Meta>(routine: Routine<Payload, Meta>, dispatch: Dispatch) {
  return (
    payload: Meta,
  ): Promise<
    Payload extends void
      ? Meta extends void
        ? void
        : { meta: Meta }
      : Meta extends void
      ? { payload: Payload }
      : { payload: Payload; meta: Meta }
  > =>
    new Promise((resolve, reject) =>
      dispatch({
        type: ROUTINE_PROMISE_ACTION,
        payload,
        meta: {
          defer: { resolve, reject },
          routine,
        },
      } as PromiseActionType<Payload, Meta>),
    );
}
