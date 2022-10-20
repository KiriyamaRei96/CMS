import { call, put, take, takeLatest } from "redux-saga/effects";

import Cookies from "js-cookie";
import { callApi } from "../../../../Api/Axios";
import openNotificationWithIcon from "../../../function/toast";

const headers = { Authorization: Cookies.get("token") };

function* fetchItem(action) {
  yield put({ type: "TABLE_LOADING" });
  try {
    const cookie = Cookies.get("token");
    const result = yield callApi
      .get(action.payload.getApi, { headers: { Authorization: cookie } })
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
function* getLocale(action) {
  yield put({ type: "TABLE_LOADING" });
  try {
    const cookie = Cookies.get("token");
    const result = yield callApi
      .get("/v1/languages/user-get", { headers: { Authorization: cookie } })
      .then((response) => response.data)
      .catch((err) => console.log(err));

    if (result.status === 1) {
      yield put({
        type: "GET_LOCALE",
        payload: result.data,
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
  try {
    const deleteID = new URLSearchParams(action.payload).toString();

    const res = yield callApi({
      method: "DELETE",
      url: action.payload.action + "/delete",
      headers,
      data: deleteID,
    })
      .then((res) => res.data)
      .catch((err) => console.log(err));
    yield put({ type: "DELETE_ROW", payload: action.payload.id });
  } catch (e) {
    console.log(e);
  }
}
function* getRow(action) {
  try {
    const getID = new URLSearchParams(action.payload.ID).toString();
    const cookie = Cookies.get("token");
    const res = yield callApi({
      method: "GET",
      url:
        action.payload.action +
        "/get?" +
        getID +
        "&locale=" +
        action.payload.locale,
      headers: { Authorization: cookie },
    })
      .then((res) => res.data)
      .catch((err) => console.log(err));

    if (res.status === 1) {
      yield put({
        type: "UPDATE_ROW",
        payload: res.data,
      });
    }
  } catch (e) {
    console.log(e);
  }
}
function* searchRow(action) {
  yield put({ type: "TABLE_LOADING" });
  try {
    const res = yield callApi({
      method: "GET",
      url:
        action.payload.action +
        `/gets?limit=${action.payload.limit}&page=${action.payload.page}&locale=${action.payload.locale}&search=${action.payload.search}`,
      headers,
    })
      .then((res) => res.data)
      .catch((err) => console.log(err));
    if (res.status === 1) {
      yield put({
        type: "SEARCH-SUCCESS",
        payload: {
          itemArray: res.data,
          pagination: res.paginationVariables,
        },
      });
    }
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
function* updateRow(action) {
  const createInfo = new URLSearchParams(action.payload.info).toString();
  yield put({ type: "TABLE_LOADING" });
  try {
    const res = yield callApi({
      method: "PUT",
      url: action.payload.action + "/update",
      headers,
      data: createInfo,
    })
      .then((res) => res.data)
      .catch((err) => console.log(err));
    if (res.status === 1) {
      openNotificationWithIcon(
        "success",
        "Cập nhật thông tin thành công",
        "bạn đã cập nhật thông tin thành công"
      );
      yield put({
        type: "UPDATE_ROW",
        payload: res.data,
      });
    }
  } catch (e) {
    console.log(e);
  }
}
function* updateSnippets(action) {
  const data = new URLSearchParams(action.payload).toString();
  yield put({ type: "TABLE_LOADING" });
  try {
    const res = yield callApi({
      method: "PUT",
      url: "v1/snippet/update",
      headers,
      data: data,
    })
      .then((res) => res.data)
      .catch((err) => console.log(err));
    if (res.status === 1) {
      openNotificationWithIcon(
        "success",
        "Cập nhật thông tin thành công",
        "bạn đã cập nhật thông tin thành công"
      );
      // yield put({
      //   type: "UPDATE_ROW",
      //   payload: res.data,
      // });
    }
  } catch (e) {
    console.log(e);
  }
}
function* setLocate(action) {
  const langArr = new URLSearchParams();
  // yield put({ type: "TABLE_LOADING" });
  action.payload.forEach((lang) => langArr.append("languages[]", lang));

  try {
    const res = yield callApi({
      method: "PUT",
      url: "/v1/languages/change",
      headers,
      data: langArr,
    })
      .then((res) => res.data)
      .catch((err) => console.log(err));
    if (res.status === 1) {
      yield put({
        type: "GET_LOCALE_REQUESTED",
      });
    }
  } catch (e) {
    console.log(e);
  }
}
function* listSaga() {
  yield takeLatest("USER_FETCH_REQUESTED", fetchItem);
  yield takeLatest("GET_LOCALE_REQUESTED", getLocale);
  yield takeLatest("DELETE_REQUESTED", deleteRow);
  yield takeLatest("ADD_ROW_REQUESTED", addRow);
  yield takeLatest("UPDATE_ROW_REQUESTED", updateRow);
  yield takeLatest("GET_ROW_REQUESTED", getRow);
  yield takeLatest("SEARCH_ROW_REQUESTED", searchRow);
  yield takeLatest("SET_LOCALE_REQUESTED", setLocate);
  yield takeLatest("UPDATE_SNIPPETS_REQUESTED", updateSnippets);
}
export default listSaga;
