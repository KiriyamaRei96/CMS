import { call, put, select, take, takeLatest } from "redux-saga/effects";

import Cookies from "js-cookie";
import { callApi } from "../../../../Api/Axios";
import openNotificationWithIcon from "../../../function/toast";
import { selectData } from "../../../../store/store";
import { setSucces } from "./slice";

const headers = { Authorization: Cookies.get("token") };
function* waitFor(selector) {
  if (yield select(selector)) return; // (1)

  while (true) {
    yield take("SET-SUCCESS"); // (1a)
    if (yield select(selector)) return; // (1b)
  }
}
function* fetchItem(action) {
  const State = yield select(selectData);
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
      yield put({ type: "SET-SUCCESS" });
    }
    if (result.status === 0) {
      yield put({ type: "FETCH_FAILED" });
    }
  } catch (e) {
    console.log(e);
  }
  // yield take("SET-SUCCESS");
  yield call(waitFor, (state) => selectData(state) != null);
  yield put({ type: "SET-IDLE" });
}
function* getLocale(action) {
  const State = yield select(selectData);
  const data = new URLSearchParams({ parentUser: String(State.parentID) });
  yield put({ type: "TABLE_LOADING" });
  try {
    const cookie = Cookies.get("token");
    const result = yield callApi
      .get(`/v1/languages/user-get`, {
        headers: { Authorization: cookie },
        data: data,
      })
      .then((response) => response.data)
      .catch((err) => console.log(err));

    if (result.status === 1) {
      yield put({
        type: "GET_LOCALE",
        payload: result.data,
      });
      yield put({ type: "SET-SUCCESS" });
    }
    if (result.status === 0) {
      yield put({ type: "FETCH_FAILED" });
    }
  } catch (e) {
    console.log(e);
  }
  // yield take("SET-SUCCESS");
  yield call(waitFor, (state) => selectData(state) != null);
  yield put({ type: "SET-IDLE" });
}
function* deleteRow(action) {
  const State = yield select(selectData);
  try {
    const deleteID = new URLSearchParams({
      ...action.payload,
      parentUser: State.parentID,
    }).toString();

    const res = yield callApi({
      method: "DELETE",
      url: action.payload.action + "/delete",
      headers,
      data: deleteID,
    })
      .then((res) => res.data)
      .catch((err) => console.log(err));
    yield put({ type: "DELETE_ROW", payload: action.payload.id });
    yield put({ type: "SET-SUCCESS" });
  } catch (e) {
    console.log(e);
  }
  // yield take("SET-SUCCESS");
  yield call(waitFor, (state) => selectData(state) != null);
  yield put({ type: "SET-IDLE" });
}
function* getRow(action) {
  const State = yield select(selectData);
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
        action.payload.locale +
        "&parentUser=" +
        State.parentID,
      headers: { Authorization: cookie },
    })
      .then((res) => res.data)
      .catch((err) => console.log(err));

    if (res.status === 1) {
      yield put({
        type: "UPDATE_ROW",
        payload: res.data,
      });
      yield put({ type: "SET-SUCCESS" });
    }
  } catch (e) {
    console.log(e);
  }
  // yield take("SET-SUCCESS");
  yield call(waitFor, (state) => selectData(state) != null);
  yield put({ type: "SET-IDLE" });
}
function* searchRow(action) {
  yield put({ type: "TABLE_LOADING" });
  const cookie = Cookies.get("token");
  const State = yield select(selectData);
  try {
    const res = yield callApi({
      method: "GET",
      url:
        action.payload.action +
        `/gets?limit=${action.payload.limit}&page=${
          action.payload.page
        }&locale=${action.payload.locale}&search=${
          action.payload.search ? action.payload.search : ""
        }&parentUser=${State.parentID}`,
      headers: { Authorization: cookie },
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
      yield put({ type: "SET-SUCCESS" });
    }
  } catch (e) {
    console.log(e);
  }
  // yield take("SET-SUCCESS");
  yield call(waitFor, (state) => selectData(state) != null);
  yield put({ type: "SET-IDLE" });
}
function* addRow(action) {
  const State = yield select(selectData);
  const createTile = new URLSearchParams({
    ...action.payload.title,
    parentUser: State.parentID,
  }).toString();
  yield put({ type: "TABLE_LOADING" });
  const cookie = Cookies.get("token");
  try {
    const res = yield callApi({
      method: "POST",
      url: action.payload.action + "/create",
      headers: { Authorization: cookie },
      data: createTile,
    })
      .then((res) => res.data)
      .catch((err) => console.log(err));
    if (res.status === 1) {
      yield put({
        type: "ADD_ROW",
        payload: res.data,
      });
      yield put({ type: "SET-SUCCESS" });
    }
    if (res.status === 0) {
      yield put({
        type: "ADD_ROW_FAILED",
        payload: res.errors ? res.errors : res.error,
      });
    }
  } catch (e) {
    console.log(e);
  }
  // yield take("SET-SUCCESS");
  // yield call(waitFor, (state) => selectData(state) != null);
  // yield put({ type: "SET-IDLE" });
}
function* updateRow(action) {
  const State = yield select(selectData);
  const cookie = Cookies.get("token");
  const createInfo = new URLSearchParams({
    ...action.payload.info,
    parentUser: State.parentID,
  }).toString();
  yield put({ type: "TABLE_LOADING" });
  try {
    const res = yield callApi({
      method: "PUT",
      url: action.payload.action + "/update",
      headers: { Authorization: cookie },
      data: createInfo,
    })
      .then((res) => res.data)
      .catch((err) => console.log(err));
    if (res.status === 1) {
      openNotificationWithIcon("success", "Cập nhật thông tin thành công", "b");
      yield put({
        type: "UPDATE_ROW",
        payload: res.data,
      });
      yield put({ type: "SET-SUCCESS" });
    }
  } catch (e) {
    console.log(e);
  }
  // yield take("SET-SUCCESS");
  yield call(waitFor, (state) => selectData(state) != null);
  yield put({ type: "SET-IDLE" });
}
function* deleteSnippets(action) {
  const State = yield select(selectData);
  const data = new URLSearchParams({
    ...action.payload.data,
    parentUser: State.parentID,
  }).toString();
  const cookie = Cookies.get("token");
  yield put({ type: "TABLE_LOADING" });
  try {
    const res = yield callApi({
      method: "DELETE",
      url: "v1/snippet/delete",
      headers: { Authorization: cookie },
      data,
    })
      .then((res) => res.data)
      .catch((err) => console.log(err));
    if (res.status === 1) {
      yield put({
        type: "GET_ROW_REQUESTED",
        payload: {
          action: action.payload.actionApi,
          ID: { name: action.payload.name },
          locale: action.payload.locale,
        },
      });
      yield put({ type: "SET-SUCCESS" });
    }
  } catch (e) {
    console.log(e);
  }
  // yield take("SET-SUCCESS");
  yield call(waitFor, (state) => selectData(state) != null);
  yield put({ type: "SET-IDLE" });
}
function* updateSnippets(action) {
  const State = yield select(selectData);
  // const data = new URLSearchParams({
  //   ...action.payload.data,
  //   parentUser: State.parentID,
  // }).toString();

  yield put({ type: "TABLE_LOADING" });
  try {
    const res = yield callApi({
      method: "PUT",
      url: "v1/snippet/update",
      headers: { Authorization: Cookies.get("token") },
      data: action.payload.data,
    })
      .then((res) => res.data)
      .catch((err) => console.log(err));
    if (res.status === 1) {
      openNotificationWithIcon("success", "Cập nhật thông tin thành công", "");
      yield put({
        type: "GET_ROW_REQUESTED",
        payload: {
          action: action.payload.actionApi,
          ID: { name: action.payload.name },
          locale: action.payload.locale,
        },
      });
      yield put({ type: "SET-SUCCESS" });
    }
  } catch (e) {
    console.log(e);
  }
  // yield take("SET-SUCCESS");
  yield call(waitFor, (state) => selectData(state) != null);
  yield put({ type: "SET-IDLE" });
}
function* setLocate(action) {
  const State = yield select(selectData);
  const langArr = new URLSearchParams();
  // yield put({ type: "TABLE_LOADING" });
  const cookie = Cookies.get("token");
  action.payload.forEach((lang) => langArr.append("languages[]", lang));
  langArr.append("parentUser", State.parentID);
  try {
    const res = yield callApi({
      method: "PUT",
      url: "/v1/languages/change",
      headers: { Authorization: cookie },
      data: langArr,
    })
      .then((res) => res.data)
      .catch((err) => console.log(err));
    if (res.status === 1) {
      yield put({
        type: "GET_LOCALE_REQUESTED",
      });
      yield put({ type: "SET-SUCCESS" });
    }
  } catch (e) {
    console.log(e);
  }
  // yield take("SET-SUCCESS");
  yield call(waitFor, (state) => selectData(state) != null);
  yield put({ type: "SET-IDLE" });
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
  yield takeLatest("DELETE_SNIPPETS_REQUESTED", deleteSnippets);
}
export default listSaga;
