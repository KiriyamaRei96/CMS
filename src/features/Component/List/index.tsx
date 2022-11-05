import React, { memo, useEffect, useState } from "react";
import clsx from "clsx";
import style from "./style.module.scss";
import Search from "./Component/Search";
import TableItems from "./Component/Table";

import { useLocation } from "react-router-dom";
import getCookie from "../../../Api/getCookie";
import { Select, Tag } from "antd";
import { v4 as uuid } from "uuid";
import { selectData } from "../../../store/store";
import { userInfoSelector } from "../Login/slice/UserSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";

import { titleMap } from "./titleMap";
import { setActionApi, setLocate } from "./slice/slice";
import Cookies from "js-cookie";
import { callApi } from "../../../Api/Axios";
import openNotificationWithIcon from "../../function/toast";

export interface ListProps {}

const List = memo((props: ListProps) => {
  const dispatch = useAppDispatch();
  const location = useLocation().pathname;
  const loginSate = useAppSelector(userInfoSelector).loginSate;
  const infoArray = useAppSelector(selectData).infoArray;
  const actionApi = useAppSelector(selectData).actionApi;
  const locale = useAppSelector(selectData).locale;
  const parentID = useAppSelector(selectData).parentID;
  const infoRole = useAppSelector(userInfoSelector).info?.role;

  const [name, setName] = useState("");
  const [columns, setColumns] = useState(Array<any>);

  useEffect(() => {
    if (infoArray.length > 0) {
      let menu: any = [];
      Object.keys(infoArray[infoArray.length - 1]).forEach((key) => {
        if (titleMap[key] !== undefined) {
          let menuObj = {};
          if (key == "title") {
            menuObj = {
              title: titleMap[key],
              dataIndex: key,
              key: key,
              render: (text) => (
                <span key={uuid()}>{text ? text : "chưa nhập tiêu đề"}</span>
              ),
            };
          }
          if (key == "role") {
            menuObj = {
              title: titleMap[key],
              dataIndex: key,
              key: key,
              render: (value) => <span color="green">{value?.name}</span>,
            };
          }
          if (
            typeof infoArray[0][key] === "string" ||
            typeof infoArray[0][key] === "number"
          ) {
            menuObj = {
              title: titleMap[key],
              dataIndex: key,
              key: key,
              render: (text) => <span key={uuid()}>{text}</span>,
            };
          }
          if (typeof infoArray[0][key] === "boolean") {
            menuObj = {
              title: titleMap[key],
              dataIndex: key,
              key: key,
              render: (value) =>
                value ? (
                  <Tag key={uuid()} color="green">
                    Đã phát hành
                  </Tag>
                ) : (
                  <Tag key={uuid()} color="red">
                    Chưa phát hành
                  </Tag>
                ),
            };
          }
          if (key == "featureImage") {
            menuObj = {
              title: titleMap[key],
              dataIndex: key,
              key: key,
              render: (value) => (
                <img
                  className={clsx(style.img)}
                  alt=""
                  src={value?.["path_150px"]}
                ></img>
              ),
              width: 64,
            };
          }
          if (key == "category") {
            menuObj = {
              title: titleMap[key],
              dataIndex: key,
              key: key,
              render: (value) => {
                if (Array.isArray(value) && value.length > 0) {
                  if (value[0]?.published) {
                    return (
                      <Tag key={uuid()} color="green">
                        {value[0]?.title}
                      </Tag>
                    );
                  } else {
                    return (
                      <Tag key={uuid()} color="red">
                        {value[0]?.title
                          ? value[0]?.title
                          : `Chưa có ${titleMap[key]}`}
                      </Tag>
                    );
                  }
                } else {
                  if (value?.published) {
                    return (
                      <Tag key={uuid()} color="green">
                        {value?.title}
                      </Tag>
                    );
                  } else {
                    return (
                      <Tag key={uuid()} color="red">
                        {value?.title
                          ? value?.title
                          : `Chưa có ${titleMap[key]}`}
                      </Tag>
                    );
                  }
                }
              },
            };
          }

          menu.push(menuObj);
        }
      });
      if (Object.keys(infoArray[infoArray.length - 1]).includes("sort")) {
        menu.splice(0, 0, {
          title: "STT",
          dataIndex: "sort",
          key: uuid(),
          sorter: (a, b) => a - b,
          render: (text) => <span key={uuid()}>{text}</span>,
        });
      }
      setColumns(menu);
    }
  }, [infoArray]);
  useEffect(() => {
    if (getCookie("token") !== undefined || loginSate) {
      if (locale !== "vi") {
        dispatch(setLocate("vi"));
      }
      switch (location) {
        case "/Statistic/businessUnit":
          setName("Thống kê các đơn vị kinh doanh");

          break;
        case "/Statistic/placeInfo":
          setName("Thống kê thông tin địa điểm");

          break;
        case "/ContentManage/CityList":
          dispatch(setActionApi("v1/system/city"));
          dispatch({
            type: "USER_FETCH_REQUESTED",
            payload: {
              getApi: `v1/system/city/gets?limit=10&page=1&search=&parentUser=${parentID}`,
              actionApi: "v1/system/city",
            },
          });

          setName("Quản lý thành phố");

          break;
        case "/ContentManage/placeList":
          dispatch(setActionApi("v1/point"));
          dispatch({
            type: "USER_FETCH_REQUESTED",
            payload: {
              getApi: `v1/point/gets?limit=10&page=1&search=&parentUser=${parentID}`,
              actionApi: "v1/point",
            },
          });
          setName("Quản lý địa điểm");

          break;
        case "/ContentManage/utilities":
          dispatch(setActionApi("v1/utilities"));
          dispatch({
            type: "USER_FETCH_REQUESTED",
            payload: {
              getApi: `v1/utilities/gets?limit=10&page=1&search=&parentUser=${parentID}`,
              actionApi: "v1/utilities",
            },
          });
          setName("Quản lý các tiện ích");

          break;
        case "/ContentManage/news":
          dispatch(setActionApi("v1/news"));
          dispatch({
            type: "USER_FETCH_REQUESTED",
            payload: {
              getApi: `v1/news/gets?limit=10&page=1&search=&parentUser=${parentID}`,
              actionApi: "v1/news",
            },
          });
          setName("Quản lý tin tức");

          break;
        case "/ContentManage/events":
          dispatch(setActionApi("v1/event"));
          dispatch({
            type: "USER_FETCH_REQUESTED",
            payload: {
              getApi: `v1/event/gets?limit=10&page=1&search=&parentUser=${parentID}`,
              actionApi: "v1/event",
            },
          });

          setName("Quản lý sự kiện");

          break;
        case "/ContentManage/placeType":
          dispatch(setActionApi("v1/point-type"));
          dispatch({
            type: "USER_FETCH_REQUESTED",
            payload: {
              getApi: `v1/point-type/gets?limit=10&page=1&search=&parentUser=${parentID}`,
              actionApi: "v1/point-type",
            },
          });
          setName("Quản lý loại địa điểm");

          break;
        case "/Manage/newsCategory":
          dispatch(setActionApi("v1/category"));
          dispatch({
            type: "USER_FETCH_REQUESTED",
            payload: {
              getApi: `v1/category/gets?limit=10&page=1&search=&parentUser=${parentID}`,
              actionApi: "v1/category",
            },
          });
          setName("Quản lý danh mục tin tức");

          break;
        case "/ContentManage/hotelType":
          dispatch(setActionApi("v1/hotel-type"));
          dispatch({
            type: "USER_FETCH_REQUESTED",
            payload: {
              getApi: `v1/hotel-type/gets?limit=10&page=1&search=&parentUser=${parentID}`,
              actionApi: "v1/hotel-type",
            },
          });
          setName("Quản lý loại hình lưu trú");

          break;
        case "/ContentManage/hotelList":
          dispatch(setActionApi("v1/hotel"));
          dispatch({
            type: "USER_FETCH_REQUESTED",
            payload: {
              getApi: `v1/hotel/gets?limit=10&page=1&search=&parentUser=${parentID}`,
              actionApi: "v1/hotel",
            },
          });
          setName("Quản lý khách sạn");

          break;
        case "/Manage/utilitiesType":
          dispatch(setActionApi("v1/utilities-type"));
          dispatch({
            type: "USER_FETCH_REQUESTED",
            payload: {
              getApi: `v1/utilities-type/gets?limit=10&page=1&search=&parentUser=${parentID}`,
              actionApi: "v1/utilities-type",
            },
          });
          setName("Danh mục loại tiện ích");

          break;
        case "/ContentManage/restaurantType":
          dispatch(setActionApi("v1/restaurant-type"));
          dispatch({
            type: "USER_FETCH_REQUESTED",
            payload: {
              getApi: `v1/restaurant-type/gets?limit=10&page=1&search=&parentUser=${parentID}`,
              actionApi: "v1/restaurant-type",
            },
          });
          setName("Quản lý loại hình ẩm thực");

          break;
        case "/ContentManage/restaurantList":
          dispatch(setActionApi("v1/restaurant"));
          dispatch({
            type: "USER_FETCH_REQUESTED",
            payload: {
              getApi: `v1/restaurant/gets?limit=10&page=1&search=&parentUser=${parentID}`,
              actionApi: "v1/restaurant",
            },
          });
          setName("Quản lý điểm ẩm thực");

          break;
        case "/ContentManage/tour":
          dispatch(setActionApi("v1/tour"));
          dispatch({
            type: "USER_FETCH_REQUESTED",
            payload: {
              getApi: `v1/tour/gets?limit=10&page=1&search=&parentUser=${parentID}`,
              actionApi: "v1/tour",
            },
          });
          setName("Quản lý Tour du lịch");

          break;
        case "/ContentManage/travelCompanies":
          dispatch(setActionApi("v1/travel-companies"));
          dispatch({
            type: "USER_FETCH_REQUESTED",
            payload: {
              getApi: `v1/travel-companies/gets?limit=10&page=1&search=&parentUser=${parentID}`,
              actionApi: "v1/travel-companies",
            },
          });
          setName("Quản lý công ty lữ hành");

          break;
        case "/Pages":
          dispatch(setActionApi("v1/page"));
          dispatch({
            type: "USER_FETCH_REQUESTED",
            payload: {
              getApi: `v1/page/gets?limit=10&page=1&search=&parentUser=${parentID}`,
              actionApi: "v1/page",
            },
          });
          setName("Quản lý trang");

          break;

        case "/UserManager/roleList":
          dispatch(setActionApi("v1/city/role"));
          dispatch({
            type: "USER_FETCH_REQUESTED",
            payload: {
              getApi: `v1/city/role/gets?limit=10&page=1&search=&parentUser=${parentID}`,
              actionApi: "v1/city/role",
            },
          });
          setName("Quản lý quyền truy cập");

          break;
        case "/UserManager/userList":
          dispatch(setActionApi("v1/city/user"));
          dispatch({
            type: "USER_FETCH_REQUESTED",
            payload: {
              getApi: `v1/city/user/gets?limit=10&page=1&search=&parentUser=${parentID}`,
              actionApi: "v1/city/user",
            },
          });
          setName("Danh sách người dùng");

          break;
        case "/Manage/district":
          dispatch(setActionApi("v1/district"));
          dispatch({
            type: "USER_FETCH_REQUESTED",
            payload: {
              getApi: `v1/district/gets?limit=10&page=1&search=&parentUser=${parentID}`,
              actionApi: "v1/district",
            },
          });
          setName("Quản lý Quận/Huyện");

          break;
        case "/Manage/RestaurantCategory":
          dispatch(setActionApi("/v1/restaurant-category"));
          dispatch({
            type: "USER_FETCH_REQUESTED",
            payload: {
              getApi: `/v1/restaurant-category/gets?limit=10&page=1&search=&parentUser=${parentID}`,
              actionApi: "/v1/restaurant-category",
            },
          });
          setName("Quản lý kiểu ẩm thực");

          break;
        case "/Manage/TourType":
          dispatch(setActionApi("/v1/tour-type"));
          dispatch({
            type: "USER_FETCH_REQUESTED",
            payload: {
              getApi: `/v1/tour-type/gets?limit=10&page=1&search=&parentUser=${parentID}`,
              actionApi: "/v1/tour-type",
            },
          });
          setName("Quản lý danh mục loại hình tour");

          break;
        case "/Manage/DestinationsType":
          dispatch(setActionApi("/v1/destinations-type"));
          dispatch({
            type: "USER_FETCH_REQUESTED",
            payload: {
              getApi: `/v1/destinations-type/gets?limit=10&page=1&search=&parentUser=${parentID}`,
              actionApi: "/v1/destinations-type",
            },
          });
          setName("Quản lý danh mục loại hình tour");

          break;
        case "/Manage/Room":
          dispatch(setActionApi("/v1/room"));
          dispatch({
            type: "USER_FETCH_REQUESTED",
            payload: {
              getApi: `/v1/room/gets?limit=10&page=1&search=&parentUser=${parentID}`,
              actionApi: "/v1/room",
            },
          });
          setName("Quản lý danh mục loại hình tour");

          break;
      }
    }
  }, [location, loginSate]);

  return (
    <div className={clsx("content", "d-flex")}>
      <div className={clsx(style.header)}>
        <h3>{name}</h3>
      </div>
      <div className={clsx(style.main, "d-flex")}>
        <Search locale={locale} />
        <TableItems columns={columns} />
      </div>
    </div>
  );
});
export default List;
