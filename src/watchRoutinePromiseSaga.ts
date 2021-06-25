import { all, call, put, race, take, takeEvery } from 'redux-saga/effects';

import { PromiseActionType, ROUTINE_PROMISE_ACTION } from './promisifyRoutine';

function* handleRoutinePromiseFlow<Payload, Meta>(action: PromiseActionType<Payload, Meta>, isSkipRequest?: boolean) {
  const {
    payload: requestPayload,
    meta: {
      routine,
      defer: { resolve, reject },
    },
  } = action;

  const [{ success, failure }, request]: [
    { success: any; failure: any },
    ReturnType<typeof routine.request> | undefined,
  ] = yield all(
    !isSkipRequest
      ? [
          race({
            success: take(routine.SUCCESS),
            failure: take(routine.FAILURE),
          }),
          put(routine.request(requestPayload)),
        ]
      : [
          race({
            success: take(routine.SUCCESS),
            failure: take(routine.FAILURE),
          }),
        ],
  );

  if (failure) {
    const { payload, meta } = failure;
    if (request && meta?.requestId !== (request.meta as { requestId: string })?.requestId) {
      yield call(handleRoutinePromiseFlow as any, action, true);
      return;
    }
    yield call(reject, payload);
  }

  if (success) {
    const { payload, meta } = success;
    if (request && meta?.requestId !== (request.meta as { requestId: string })?.requestId) {
      yield call(handleRoutinePromiseFlow as any, action, true);
      return;
    }
    yield call(resolve, {
      payload,
      meta,
    } as any);
  }
}

export default function* watchRoutinePromise() {
  yield takeEvery(ROUTINE_PROMISE_ACTION, handleRoutinePromiseFlow as any);
}
