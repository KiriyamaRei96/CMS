import React, { memo, useEffect, useState } from "react";
import clsx from "clsx";
import style from "./style.module.scss";
import Search from "./Component/Search";
import TableItems from "./Component/Table";

import { useLocation } from "react-router-dom";
import getCookie from "../../../Api/getCookie";
import { Button, Modal, Popconfirm, Tag } from "antd";
import { v4 as uuid } from "uuid";
import { selectData } from "../../../store/store";
import { userInfoSelector } from "../Login/slice/UserSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import CreateForm from "./Component/CreateForm";
import { titleMap } from "./titleMap";
import { setLocate } from "./slice/slice";

export interface ListProps {}

const List = memo((props: ListProps) => {
  const dispatch = useAppDispatch();
  const location = useLocation().pathname;
  const loginSate = useAppSelector(userInfoSelector).loginSate;
  const infoArray = useAppSelector(selectData).infoArray;
  const actionApi = useAppSelector(selectData).actionApi;
  const locale = useAppSelector(selectData).locale;

  const [name, setName] = useState("");
  const [columns, setColumns] = useState(Array<any>);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ID, setID] = useState();

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
                    {value?.title}
                  </Tag>
                ),
            };
          }

          menu.push(menuObj);
        }
      });

      setColumns([
        ...menu,
        {
          title: "Chức Năng",
          key: "action",
          fixed: "right",
          render: (_, record) => (
            <div key={uuid()}>
              <Popconfirm
                onConfirm={() => {
                  dispatch({
                    type: "DELETE_REQUESTED",
                    payload: {
                      id: record.id ? record.id : record.name,
                      name: record?.name,
                      action: actionApi,
                    },
                  });
                }}
                title='Bạn muốn xóa thông tin này ?'
                okText='Xóa'
                cancelText='Hủy'
              >
                <Button size='small' key={uuid()}>
                  Xóa
                </Button>
              </Popconfirm>

              <Button
                size='small'
                onClick={() => {
                  setID(record.id ? record.id : record.name);
                  setIsModalOpen(true);
                }}
                key={uuid()}
              >
                Sửa
              </Button>
            </div>
          ),
        },
      ]);
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
          setName("Quản lý thành phố");

          break;
        case "/ContentManage/placeList":
          dispatch({
            type: "USER_FETCH_REQUESTED",
            payload: {
              getApi: "v1/point/gets?limit=10&page=1&search=",
              actionApi: "v1/point",
            },
          });
          setName("Quản lý địa điểm");

          break;
        case "/ContentManage/utilities":
          dispatch({
            type: "USER_FETCH_REQUESTED",
            payload: {
              getApi: "v1/utilities/gets?limit=10&page=1&search=",
              actionApi: "v1/utilities",
            },
          });
          setName("Quản lý các tiện ích");

          break;
        case "/ContentManage/news":
          dispatch({
            type: "USER_FETCH_REQUESTED",
            payload: {
              getApi: "v1/news/gets?limit=10&page=1&search=",
              actionApi: "v1/news",
            },
          });
          setName("Quản lý tin tức");

          break;
        case "/ContentManage/events":
          dispatch({
            type: "USER_FETCH_REQUESTED",
            payload: {
              getApi: "v1/event/gets?limit=10&page=1&search=",
              actionApi: "v1/event",
            },
          });

          setName("Quản lý sự kiện");

          break;
        case "/ContentManage/placeType":
          dispatch({
            type: "USER_FETCH_REQUESTED",
            payload: {
              getApi: "v1/point-type/gets?limit=10&page=1&search=",
              actionApi: "v1/point-type",
            },
          });
          setName("Quản lý loại địa điểm");

          break;
        case "/Manage/newsCategory":
          dispatch({
            type: "USER_FETCH_REQUESTED",
            payload: {
              getApi: "v1/category/gets?limit=10&page=1&search=",
              actionApi: "v1/category",
            },
          });
          setName("Quản lý danh mục tin tức");

          break;
        case "/ContentManage/hotelType":
          dispatch({
            type: "USER_FETCH_REQUESTED",
            payload: {
              getApi: "v1/hotel-type/gets?limit=10&page=1&search=",
              actionApi: "v1/hotel-type",
            },
          });
          setName(" Quản lý loại khách sạn");

          break;
        case "/ContentManage/hotelList":
          dispatch({
            type: "USER_FETCH_REQUESTED",
            payload: {
              getApi: "v1/hotel/gets?limit=10&page=1&search=",
              actionApi: "v1/hotel",
            },
          });
          setName("Quản lý khách sạn");

          break;
        case "/Manage/utilitiesType":
          dispatch({
            type: "USER_FETCH_REQUESTED",
            payload: {
              getApi: "v1/utilities-type/gets?limit=10&page=1&search=",
              actionApi: "v1/utilities-type",
            },
          });
          setName("Danh mục loại tiện ích");

          break;
        case "/ContentManage/restaurantType":
          dispatch({
            type: "USER_FETCH_REQUESTED",
            payload: {
              getApi: "v1/restaurant-type/gets?limit=10&page=1&search=",
              actionApi: "v1/restaurant-type",
            },
          });
          setName(" Quản lý loại nhà hàng");

          break;
        case "/ContentManage/restaurantList":
          dispatch({
            type: "USER_FETCH_REQUESTED",
            payload: {
              getApi: "v1/restaurant/gets?limit=10&page=1&search=",
              actionApi: "v1/restaurant",
            },
          });
          setName("Quản lý khách sạn");

          break;
        case "/ContentManage/tour":
          dispatch({
            type: "USER_FETCH_REQUESTED",
            payload: {
              getApi: "v1/tour/gets?limit=10&page=1&search=",
              actionApi: "v1/tour",
            },
          });
          setName("Quản lý Tour du lịch");

          break;
        case "/ContentManage/travelCompanies":
          dispatch({
            type: "USER_FETCH_REQUESTED",
            payload: {
              getApi: "v1/travel-companies/gets?limit=10&page=1&search=",
              actionApi: "v1/travel-companies",
            },
          });
          setName("Quản lý công ty lữ hành");

          break;
        case "/Pages":
          dispatch({
            type: "USER_FETCH_REQUESTED",
            payload: {
              getApi: "v1/page/gets?limit=10&page=1&search=",
              actionApi: "v1/page",
            },
          });
          setName("Quản lý trang");

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
      <Modal
        centered={true}
        open={isModalOpen}
        width='70vw'
        onCancel={() => {
          setIsModalOpen(false);
        }}
        footer={false}
        title={"Sửa thông tin"}
      >
        <CreateForm id={ID} setIsModalOpen={setIsModalOpen} />
      </Modal>
    </div>
  );
});
export default List;
