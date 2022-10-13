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

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <React.StrictMode>
      <Provider store={store}>
        <Routes>
          <Route path='login' element={<Login />} />
          <Route element={<App />}>
            <Route index element={<DashBroad />} />
            <Route path='UserInfo' element={<UserInfo />}>
              <Route index element={<List />} />
              <Route path='/UserInfo/updateInfo' element={<UpdateInfo />} />
              <Route path='/UserInfo/changePass' element={<List />} />
            </Route>
            <Route path='Statistic/businessUnit' element={<List />} />

            <Route path='Statistic/placeInfo' element={<List />} />
            <Route path='ContentManage/CityList' element={<List />} />
            <Route path='ContentManage/utilities' element={<List />} />
            <Route path='ContentManage/placeList' element={<List />} />
            <Route path='ContentManage/news' element={<List />} />
            <Route path='ContentManage/events' element={<List />} />
            <Route path='Manage/placeType' element={<List />} />
            <Route path='Manage/newsCategory' element={<List />} />
            <Route path='Manage/utilitiesType' element={<List />} />
          </Route>
        </Routes>
      </Provider>
    </React.StrictMode>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
