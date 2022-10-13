import { put, takeLatest } from "redux-saga/effects";
import { callApi } from "../../Api/Axios";

import clearCookie from "../function/clearCookie";
const api =
  "https://notion-api.splitbee.io/v1/table/ab1ce04cac764dffb6f105c7abb4a97c";

// worker Saga: will be fired on USER_FETCH_REQUESTED actions
function* fetchItem(action) {
  try {
    const itemArr = yield callApi
      .get("v1/asset/gets?page=1&limit=10&parentId=17")
      .then((response) => response.data)
      .catch((err) => console.log(err));
    console.log(itemArr);

    // yield put({ type: "FETCH-SUCCESS", payload: itemArr });
  } catch (e) {
    yield put({ type: "FETCH_FAILED", message: e });
  }
}
function* login(action) {
  try {
    const loginInfo = new URLSearchParams(action.payload).toString();

    const res = yield callApi
      .post("/auth/login", loginInfo)
      .then((res) => res.data)
      .catch((err) => console.log(err));

    if (res.status === 0) {
      console.log(res.error.message);
      yield put({ type: "LOGIN_FAILED", message: res.error.message });
    }
    if (res.status === 1) {
      yield (document.cookie = `token=${res.token}`);
      yield put({ type: "LOGIN-SUCCESS", payload: res.token });
    }
  } catch (e) {
    yield put({ type: "LOGIN_FAILED", message: e });
  }
}
function* logout(action) {
  yield put({ type: "LOG_OUT", payload: {} });
}
function* getUserInfo(action) {
  try {
    const userInfo = yield callApi
      .get("v1/account/profile")
      .then((response) => response.data)
      .catch((err) => console.log(err));
    yield put({ type: "GET_USER_INFO", payload: userInfo.data });
  } catch (e) {
    console.log(e);
  }
}
function* updateInfo(action) {
  try {
    const updateData = new URLSearchParams(action.payload).toString();

    const res = yield callApi
      .put("/v1/account/profile", updateData)
      .then((res) => res.data)
      .catch((err) => console.log(err));

    if (res.status === 0) {
      console.log(res.error.message);
      // yield put({ type: "LOGIN_FAILED", message: res.error.message });
    }
    if (res.status === 1) {
      console.log(res);

      yield put({ type: "UPDATE-SUCCESS", payload: res });
    }
  } catch (e) {
    // yield put({ type: "LOGIN_FAILED", message: e });
  }
}
function* mySaga() {
  yield takeLatest("USER_FETCH_REQUESTED", fetchItem);
  yield takeLatest("USER_LOGIN_REQUESTED", login);
  yield takeLatest("USER_LOGOUT_REQUESTED", logout);
  yield takeLatest("USER_GETINFO_REQUESTED", getUserInfo);
  yield takeLatest("USER_UPDATE_INFO_REQUESTED", updateInfo);
}

export default mySaga;
