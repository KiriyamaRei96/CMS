import { all } from "redux-saga/effects";
import listSaga from "../features/Component/List/slice/saga";
import userInfoSaga from "../features/Component/UserInfo/slice/saga";

export default function* rootSaga() {
  yield all([listSaga(), userInfoSaga()]);
}
