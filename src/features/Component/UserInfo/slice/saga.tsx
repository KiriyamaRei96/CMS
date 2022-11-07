import { put, takeLatest } from "redux-saga/effects";
import { callApi } from "../../../../Api/Axios";
import getCookie from "../../../../Api/getCookie";
import Cookies from "js-cookie";

const headers = { Authorization: Cookies.get("token") };

// worker Saga: will be fired on USER_FETCH_REQUESTED actions
// table part

// auth part
function* login(action) {
  yield put({ type: "LOADING" });
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
      Cookies.set("token", res.token);
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
  yield put({ type: "LOADING" });
  const cookie = Cookies.get("token");

  try {
    const userInfo = yield callApi
      .get("v1/account/profile", {
        headers: { Authorization: cookie },
      })
      .then((response) => response.data)
      .catch((err) => console.log(err));
    yield put({ type: "GET_USER_INFO", payload: userInfo.data });
  } catch (e) {
    console.log(e);
  }
}
function* updateInfo(action) {
  yield put({ type: "LOADING" });
  try {
    const updateData = new URLSearchParams(action.payload).toString();

    const res = yield callApi({
      method: "PUT",
      url: "/v1/account/profile",
      headers,
      data: updateData,
    })
      .then((res) => res.data)
      .catch((err) => console.log(err));

    if (res.status === 0) {
      console.log(res.error.message);
    }
    if (res.status === 1) {
      yield put({ type: "UPDATE-SUCCESS", payload: res });
    }
  } catch (e) {
    console.log(e);
  }
}
function* changePass(action) {
  yield put({ type: "LOADING" });
  try {
    const passWordData = new URLSearchParams(action.payload).toString();

    const res = yield callApi({
      method: "PUT",
      url: "/v1/account/change-password",
      headers,
      data: passWordData,
    })
      .then((res) => res.data)
      .catch((err) => console.log(err));

    if (res.status === 0) {
      yield put({ type: "CHANGE_PASS_FAIL" });
    }
    if (res.status === 1) {
      yield put({ type: "CHANGE_PASS_SUCCESS" });
    }
  } catch (e) {
    console.log(e);
  }
}

function* userInfoSaga() {
  yield takeLatest("USER_LOGIN_REQUESTED", login);
  yield takeLatest("USER_LOGOUT_REQUESTED", logout);
  yield takeLatest("USER_GETINFO_REQUESTED", getUserInfo);
  yield takeLatest("USER_UPDATE_INFO_REQUESTED", updateInfo);
  yield takeLatest("USER_CHANGE_PASS_REQUESTED", changePass);
}

export default userInfoSaga;
