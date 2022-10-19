import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserInfo from "./features/Component/UserInfo";
import List from "./features/Component/List";
import DashBroad from "./features/Component/Dashboard";
import Login from "./features/Component/Login";
import { UpdateInfo } from "./features/Component/UserInfo/Component/UpdateInfo";
import Info from "./features/Component/UserInfo/Component/Info";
import { ChangePass } from "./features/Component/UserInfo/Component/ChangePass";
import System from "./features/Component/System";

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <BrowserRouter>
    {/* <React.StrictMode> */}
    <Provider store={store}>
      <Routes>
        <Route path='login' element={<Login />} />
        <Route element={<App />}>
          <Route index element={<DashBroad />} />
          <Route path='UserInfo' element={<UserInfo />}>
            <Route index element={<Info />} />
            <Route path='/UserInfo/updateInfo' element={<UpdateInfo />} />
            <Route path='/UserInfo/changePass' element={<ChangePass />} />
          </Route>
          <Route path='Statistic/businessUnit' element={<DashBroad />} />

          <Route path='Statistic/placeInfo' element={<DashBroad />} />
          {/* quản lý chung  */}
          <Route path='Manage/newsCategory' element={<List />} />
          <Route path='Manage/utilitiesType' element={<List />} />
          <Route path='Manage/System' element={<System />} />

          {/* quảng lý nội dung  */}
          <Route path='ContentManage/CityList' element={<DashBroad />} />
          <Route path='ContentManage/utilities' element={<List />} />
          <Route path='ContentManage/placeList' element={<List />} />
          <Route path='ContentManage/news' element={<List />} />
          <Route path='ContentManage/events' element={<List />} />
          <Route path='ContentManage/placeType' element={<List />} />
          <Route path='Pages' element={<List />} />

          <Route path='ContentManage/hotelType' element={<List />} />
          <Route path='ContentManage/hotelList' element={<List />} />
          <Route path='ContentManage/restaurantType' element={<List />} />
          <Route path='ContentManage/restaurantList' element={<List />} />
          <Route path='ContentManage/tour' element={<List />} />
          <Route path='ContentManage/travelCompanies' element={<List />} />
        </Route>
      </Routes>
    </Provider>
    {/* </React.StrictMode> */}
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
