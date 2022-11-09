import { call, put, select, take, takeLatest } from "redux-saga/effects";

import Cookies from "js-cookie";
import { callApi } from "../../../../Api/Axios";
import openNotificationWithIcon from "../../../function/toast";
import { selectData } from "../../../../store/store";

function* getPlaceinfo(action) {
  const State = yield select(selectData);

  try {
    const cookie = Cookies.get("token");

    const hotel = yield callApi
      .get("v1/hotel/gets?limit=10&page=1&locale=vi&search=", {
        headers: { Authorization: cookie },
      })
      .then((response) => response.data)
      .catch((err) => console.log(err));
    const restaurant = yield callApi
      .get("v1/restaurant/gets?limit=10&page=1&locale=vi&search=", {
        headers: { Authorization: cookie },
      })
      .then((response) => response.data)
      .catch((err) => console.log(err));
    const point = yield callApi
      .get("v1/point/gets?limit=10&page=1&locale=vi&search=", {
        headers: { Authorization: cookie },
      })
      .then((response) => response.data)
      .catch((err) => console.log(err));
    const utilities = yield callApi
      .get("v1/utilities/gets?limit=10&page=1&locale=vi&search=", {
        headers: { Authorization: cookie },
      })
      .then((response) => response.data)
      .catch((err) => console.log(err));
    yield put({
      type: "SET_DASBROAD_DATA",
      payload: {
        point: point?.paginationVariables?.totalCount,
        restaurant: restaurant?.paginationVariables?.totalCount,
        hotel: hotel?.paginationVariables?.totalCount,
        utilities: utilities?.paginationVariables?.totalCount,
      },
    });
  } catch (e) {
    console.log(e);
  }
}

function* dasbroadSaga() {
  yield takeLatest("GET_PLACE_INFO", getPlaceinfo);
}
export default dasbroadSaga;
