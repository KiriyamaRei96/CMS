import { put, takeLatest } from "redux-saga/effects";
import { callApi } from "../../../../Api/Axios";
import getCookie from "../../../../Api/getCookie";
import Cookies from "js-cookie";
import openNotificationWithIcon from "../../../function/toast";

const headers = { Authorization: Cookies.get("token") };

// worker Saga: will be fired on USER_FETCH_REQUESTED actions
// table part

// auth part
function* getSetting(action) {
  try {
    const cookie = Cookies.get("token");
    const res = yield callApi
      .get(`/v1/web-setting/get?locale=${action.payload}`, {
        headers: { Authorization: cookie },
      })
      .then((res) => res.data)
      .catch((err) => console.log(err));

    if (res.status === 0) {
      console.log(res.error.message);
    }
    if (res.status === 1) {
      yield put({ type: "SET_SETTING", payload: res.data });
    }
  } catch (e) {
    console.log(e);
    // yield put({ type: "LOGIN_FAILED", message: e });
  }
}
function* updateSetting(action) {
  try {
    const res = yield callApi({
      method: "PUT",
      url: "v1/web-setting/update",
      headers: { Authorization: Cookies.get("token") },
      data: action.payload,
    })
      .then((res) => res.data)
      .catch((err) => console.log(err));
    if (res.status === 1) {
      openNotificationWithIcon("success", "Cập nhật thông tin thành công", "");
      yield put({ type: "SET_SETTING", payload: res.data });
    }
  } catch (e) {
    console.log(e);
  }
}

function* settingSaga() {
  yield takeLatest("GET_SETTING_REQUESTED", getSetting);
  yield takeLatest("UPDATE_SETTING_REQUESTED", updateSetting);
}

export default settingSaga;
