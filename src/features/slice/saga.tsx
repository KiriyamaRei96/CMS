import { put, takeLatest } from "redux-saga/effects";
import { callApi } from "../../Api/Axios";
import getCookie from "../../Api/getCookie";
const headers = { Authorization: getCookie("token") };
// worker Saga: will be fired on USER_FETCH_REQUESTED actions
// table part
function* fetchItem(action) {
  yield put({ type: "TABLE_LOADING" });
  try {
    const result = yield callApi
      .get(action.payload.getApi, {
        headers,
      })
      .then((response) => response.data)
      .catch((err) => console.log(err));

    if (result.status === 1) {
      yield put({
        type: "FETCH-SUCCESS",
        payload: {
          itemArray: result.data,
          pagination: result.paginationVariables,
          actionApi: action.payload.actionApi,
        },
      });
    }
    if (result.status === 0) {
      yield put({ type: "FETCH_FAILED" });
    }
  } catch (e) {
    console.log(e);
  }
}
function* deleteRow(action) {
  const deleteID = new URLSearchParams(action.payload.id).toString();

  try {
    const res = yield callApi({
      method: "DELETE",
      url: action.payload.action + "/delete",
      headers,
      data: deleteID,
    })
      .then((res) => res.data)
      .catch((err) => console.log(err));
  } catch (e) {
    console.log(e);
  }
}
function* addRow(action) {
  const createTile = new URLSearchParams(action.payload.title).toString();
  yield put({ type: "TABLE_LOADING" });
  try {
    const res = yield callApi({
      method: "POST",
      url: action.payload.action + "/create",
      headers,
      data: createTile,
    })
      .then((res) => res.data)
      .catch((err) => console.log(err));
    if (res.status === 1) {
      yield put({
        type: "ADD_ROW",
        payload: res.data,
      });
    }
  } catch (e) {
    console.log(e);
  }
}
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
  yield put({ type: "LOADING" });
  try {
    const userInfo = yield callApi
      .get("v1/account/profile", {
        headers,
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

function* mySaga() {
  yield takeLatest("USER_FETCH_REQUESTED", fetchItem);
  yield takeLatest("USER_LOGIN_REQUESTED", login);
  yield takeLatest("USER_LOGOUT_REQUESTED", logout);
  yield takeLatest("USER_GETINFO_REQUESTED", getUserInfo);
  yield takeLatest("USER_UPDATE_INFO_REQUESTED", updateInfo);
  yield takeLatest("USER_CHANGE_PASS_REQUESTED", changePass);
  yield takeLatest("DELETE_REQUESTED", deleteRow);
  yield takeLatest("ADD_ROW_REQUESTED", addRow);
}

export default mySaga;
