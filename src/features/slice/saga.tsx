import { call, put, takeLatest } from "redux-saga/effects";

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
function* login(action) {
  try {
    const params = new URLSearchParams(action.payload).toString();

    const res = yield fetch(
      "https://8811-2405-4802-132-dfc0-1065-41b-916-84b4.ap.ngrok.io/api/auth/login",
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        method: "POST",
        body: params,
      }
    ).then((response) => response.json());
    if (res.status === 0) {
      console.log(res.error.message);
      yield put({ type: "LOGIN_FAILED", message: res.error.message });
    }
    if (res.status === 1) {
      console.log(res.token);
      yield put({ type: "LOGIN-SUCCESS", payload: res.token });
    }
  } catch (e) {
    yield put({ type: "LOGIN_FAILED", message: e });
  }
}
function* mySaga() {
  yield takeLatest("USER_FETCH_REQUESTED", fetchItem);
  yield takeLatest("USER_LOGIN_REQUESTED", login);
}

export default mySaga;
