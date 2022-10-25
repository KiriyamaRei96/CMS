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

  const [typeOption, setTypeOption] = useState<any>();
  const [city, setCity] = useState<any>();

  useEffect(() => {
    if (actionApi?.includes("news")) {
      getSelectList(
        `v1/category/gets?limit=1000&page=1&search=&parentUser=${parentID}`
      );
    } else if (actionApi?.includes("point")) {
      getSelectList(
        `v1/point-type/gets?limit=1000&page=1&search=&parentUser=${parentID}`
      );
    } else if (actionApi?.includes("hotel")) {
      getSelectList(
        `v1/hotel-type/gets?limit=1000&page=1&search=&parentUser=${parentID}`
      );
    } else if (actionApi?.includes("utilities")) {
      getSelectList(
        `v1/utilities-type/gets?limit=1000&page=1&search=&parentUser=${parentID}`
      );
    } else if (actionApi?.includes("restaurant")) {
      getSelectList(
        `v1/restaurant-type/gets?limit=1000&page=1&search=&parentUser=${parentID}`
      );
    }
    if (actionApi?.includes("system")) {
      getSelectList(
        `/v1/system/role/gets?limit=1000&page=1&search=&parentUser=${parentID}`
      );
    }
  }, [actionApi]);

  const getSelectList = async (getApi, city = false) => {
    try {
      const cookie = Cookies.get("token");
      const result = await callApi
        .get(getApi, { headers: { Authorization: cookie } })
        .then((response) => response.data)
        .catch((err) => console.log(err));

      const option = result.data.map((obj) => {
        if (obj?.title || obj?.name) {
          return (
            <Select.Option key={uuid()} value={obj.id}>
              {obj?.title ? obj?.title : obj?.name}
            </Select.Option>
          );
        }
        if (city && obj?.username) {
          return (
            <Select.Option key={uuid()} value={obj.id}>
              {obj?.username}
            </Select.Option>
          );
        }
      });

      if (city) {
        setCity(option);
      }
      if (!city) {
        setTypeOption(option);
      }
    } catch (err) {}
  };

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
              render: (value) => <span color='green'>{value?.name}</span>,
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
                  <Tag key={uuid()} color='green'>
                    Đã phát hành
                  </Tag>
                ) : (
                  <Tag key={uuid()} color='red'>
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
                  alt=''
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
              render: (value) =>
                value?.published ? (
                  <Tag key={uuid()} color='green'>
                    {value?.title}
                  </Tag>
                ) : (
                  <Tag key={uuid()} color='red'>
                    {value?.title ? value?.title : `Chưa có ${titleMap[key]}`}
                  </Tag>
                ),
            };
          }

          menu.push(menuObj);
        }
      });

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
          setName(" Quản lý loại khách sạn");

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
          setName(" Quản lý loại nhà hàng");

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
          setName("Quản lý khách sạn");

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
          dispatch(setActionApi("v1/system/role"));
          dispatch({
            type: "USER_FETCH_REQUESTED",
            payload: {
              getApi: `v1/system/role/gets?limit=10&page=1&search=&parentUser=${parentID}`,
              actionApi: "v1/system/role",
            },
          });
          setName("Quản quyền truy cập");

          break;
        case "/UserManager/userList":
          dispatch(setActionApi("v1/system/user"));
          dispatch({
            type: "USER_FETCH_REQUESTED",
            payload: {
              getApi: `v1/system/user/gets?limit=10&page=1&search=&parentUser=${parentID}`,
              actionApi: "v1/system/user",
            },
          });
          setName("Danh sách người dùng");

          break;
      }
    }
  }, [location, loginSate]);
  useEffect(() => {
    if (infoRole?.id !== "2" && infoRole?.parentUser === null) {
      getSelectList(`/v1/system/city/gets?limit=1000&page=1&search=`, true);
      if (!actionApi?.includes("system")) {
        openNotificationWithIcon(
          "warning",
          "Bạn đang truy cập với tài khoản trị",
          "Bạn hãy chọn thành phố trước khi xem thông tin"
        );
      }
    }
  }, [infoRole]);
  return (
    <div className={clsx("content", "d-flex")}>
      <div className={clsx(style.header)}>
        <h3>{name}</h3>
      </div>
      <div className={clsx(style.main, "d-flex")}>
        <Search city={city} locale={locale} />
        <TableItems typeOption={typeOption} columns={columns} />
      </div>
    </div>
  );
});
export default List;
