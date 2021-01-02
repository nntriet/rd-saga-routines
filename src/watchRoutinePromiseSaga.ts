import { all, call, put, race, take, takeEvery } from 'redux-saga/effects';

import { PromiseActionType, ROUTINE_PROMISE_ACTION } from './promisifyRoutine';

function* handleRoutinePromiseFlow<Payload, Meta>(action: PromiseActionType<Payload, Meta>) {
  const {
    payload,
    meta: {
      routine,
      defer: { resolve, reject },
    },
  } = action;

  const [{ success, failure }] = yield all([
    race({
      success: take(routine.SUCCESS),
      failure: take(routine.FAILURE),
    }),
    put(routine.request(payload)),
  ]);

  if (failure) {
    const { payload } = failure;
    yield call(reject, payload);
    return;
  }

  if (success) {
    const { payload, meta } = success;
    yield call(resolve, {
      payload,
      meta,
    } as any);
  }
}

export default function* watchRoutinePromise() {
  yield takeEvery(ROUTINE_PROMISE_ACTION, handleRoutinePromiseFlow);
}
