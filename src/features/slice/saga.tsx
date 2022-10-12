import { call, put, takeLatest } from "redux-saga/effects";
import { json } from "stream/consumers";
const api =
  "https://notion-api.splitbee.io/v1/table/ab1ce04cac764dffb6f105c7abb4a97c";

// worker Saga: will be fired on USER_FETCH_REQUESTED actions
function* fetchItem(action) {
  try {
    const itemArr = yield fetch(api).then((response) => response.json());
    yield put({ type: "FETCH-SUCCESS", payload: itemArr });
  } catch (e) {
    yield put({ type: "FETCH_FAILED", message: e });
  }
}

function* mySaga() {
  yield takeLatest("USER_FETCH_REQUESTED", fetchItem);
}

export default mySaga;
