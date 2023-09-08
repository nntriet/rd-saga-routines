import { all, call, put, race, take, takeEvery } from 'redux-saga/effects';

import { ROUTINE_PROMISE_ACTION, PromiseActionType } from './promisifyRoutine';

import type { Routine } from './createRoutine';

function* handleRoutinePromiseFlow<Payload, Meta>(
	action: PromiseActionType<Payload, Meta>,
	request?: ReturnType<Routine<Payload, Meta>['request']> | undefined,
) {
	const {
		payload: requestPayload,
		meta: {
			routine,
			defer: { resolve, reject },
		},
	} = action;

	const [{ success, failure }, _request]: [
		{ success: any; failure: any },
		ReturnType<typeof routine.request> | undefined,
	] = yield all(
		!request
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

	request = _request || request;

	if (failure) {
		const { payload, meta } = failure;
		if (request && meta?.requestId && meta.requestId !== request.meta.requestId) {
			yield call(handleRoutinePromiseFlow as any, action, _request);
			return;
		}
		yield call(reject, payload);
	}

	if (success) {
		const { payload, meta } = success;
		if (request && meta?.requestId && meta.requestId !== request.meta.requestId) {
			yield call(handleRoutinePromiseFlow as any, action, _request);
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
