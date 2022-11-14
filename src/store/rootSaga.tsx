import { all } from "redux-saga/effects";
import dasbroadSaga from "../features/Component/Dashboard/slice/saga";
import listSaga from "../features/Component/List/slice/saga";
import userInfoSaga from "../features/Component/UserInfo/slice/saga";
import settingSaga from "../features/Component/WebSetting/slice/saga";

export default function* rootSaga() {
  yield all([listSaga(), userInfoSaga(), dasbroadSaga(), settingSaga()]);
}
