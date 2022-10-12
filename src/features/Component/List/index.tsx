import React, { memo, useEffect, useState } from "react";
import clsx from "clsx";
import style from "./style.module.scss";
import Search from "./Component/Search";
import TableItems from "./Component/Table";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

export interface ListProps {}

const List = memo((props: ListProps) => {
  const dispatch = useDispatch();
  const location = useLocation().pathname;
  const [name, setName] = useState("");

  useEffect(() => {
    dispatch({ type: "USER_FETCH_REQUESTED", payload: {} });

    switch (location) {
      case "/Statistic/businessUnit":
        setName("Thống kê các đơn vị kinh doanh");

        break;
      case "/Statistic/placeInfo":
        setName("Thống kê thông tin địa điểm");

        break;
      case "/ContentManage/CityList":
        setName("Quản lý thành phố");

        break;
      case "/ContentManage/placeList":
        setName("Quản lý địa điểm");

        break;
      case "/ContentManage/utilities":
        setName("Quản lý các tiện ích");

        break;
      case "/ContentManage/news":
        setName("Quản lý tin tức");

        break;
      case "/ContentManage/events":
        setName("Quản lý sự kiện");

        break;
      case "/Manage/placeType":
        setName("Quản lý loại địa điểm");

        break;
      case "/Manage/newsCategory":
        setName("Quản lý category tin tức");

        break;
      case "/Manage/utilitiesType":
        setName("Danh mục loại tiện ích");

        break;
    }
  }, [location]);

  return (
    <div className={clsx("content", "d-flex")}>
      <div className={clsx(style.header)}>
        <h3>{name}</h3>
      </div>
      <div className={clsx(style.main, "d-flex")}>
        <Search />
        <TableItems />
      </div>
    </div>
  );
});
export default List;
