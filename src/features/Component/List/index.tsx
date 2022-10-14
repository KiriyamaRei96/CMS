import React, { memo, useEffect, useState } from "react";
import clsx from "clsx";
import style from "./style.module.scss";
import Search from "./Component/Search";
import TableItems from "./Component/Table";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import getCookie from "../../../Api/getCookie";
import { Button, Space, Tag } from "antd";
import { v4 as uuid } from "uuid";
import { selectData } from "../../../app/store";
import { userInfoSelector } from "../Login/slice/UserSlice";

export interface ListProps {}

const List = memo((props: ListProps) => {
  const dispatch = useDispatch();
  const location = useLocation().pathname;
  const actionApi = useSelector(selectData).actionApi;
  const loginSate = useSelector(userInfoSelector).loginSate;
  const [name, setName] = useState("");
  const [columns, setColumns] = useState(Array<any>);

  useEffect(() => {
    if (getCookie("token") !== undefined || loginSate) {
      console.log("change");
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
          dispatch({
            type: "USER_FETCH_REQUESTED",
            payload: {
              getApi: "v1/point-type/gets?limit=10&page=1&search=",
              actionApi: "v1/point-type",
            },
          });
          setName("Quản lý loại địa điểm");
          setColumns([
            {
              title: "ID",
              dataIndex: "id",
              key: "id",
              render: (text) => <span key={uuid()}>{text}</span>,
            },
            {
              title: "Tiêu đề",
              dataIndex: "title",
              key: "title",
              render: (text) => <span key={uuid()}>{text}</span>,
            },
            {
              title: "Phát Hành",
              dataIndex: "published",
              key: "published",
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
            },
            {
              title: "Ngày khởi tạo",
              dataIndex: "creationDate",
              key: "creationDate",
              render: (text) => <span key={uuid()}>{text}</span>,
            },
            {
              title: "Chức Năng",
              key: "action",
              render: (_, record) => (
                <Space key={uuid()} size='small'>
                  <Button>Xóa Loại địa điểm </Button>
                  <Button>Sửa thông tin</Button>
                </Space>
              ),
            },
          ]);

          break;
        case "/Manage/newsCategory":
          setName("Quản lý category tin tức");

          break;
        case "/Manage/utilitiesType":
          setName("Danh mục loại tiện ích");

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
        <Search />
        <TableItems columns={columns} />
      </div>
    </div>
  );
});
export default List;
