import { Menu } from "antd";
import React, { memo } from "react";
import { v4 as uuid } from "uuid";
import clsx from "clsx";
import style from "./style.module.scss";
import { Link, useLocation } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";

import { userInfoSelector } from "../Component/Login/slice/UserSlice";
import { spawn } from "child_process";
interface SideBarProps {}

const SideBar = memo((props: SideBarProps) => {
  const info = useAppSelector(userInfoSelector).info;
  const cityMenu = [
    {
      key: uuid(),
      icon: <i className='fa-solid fa-bars-progress'></i>,
      title: "Quản trị cấu hình thông tin cổng",
      label: <span>Cấu hình thông tin cổng</span>,
      children: [
        {
          key: uuid(),
          title: "Quản lý chung",
          icon: <i className='fa-solid fa-gear'></i>,
          label: <span>Quản lý chung</span>,
          children: [
            {
              key: uuid(),
              title: "Quản lý website ",
              label: <Link to='Manage/website'>Quản lý website</Link>,
            },
            {
              key: uuid(),
              title: "Quản lý ngôn ngữ ",
              label: <Link to='Manage/System'>Quản lý ngôn ngữ</Link>,
            },
            {
              key: uuid(),
              title: "Quản lý Quận/Huyện",
              label: <Link to='Manage/district'>Quản lý Quận/Huyện</Link>,
            },
            {
              key: uuid(),
              title: "Quản lý category tin tức",
              label: (
                <Link to='Manage/newsCategory'>Quản lý danh mục tin tức</Link>
              ),
            },
            {
              key: uuid(),
              title:
                "Danh mục loại tiện ích (địa điểm tiện ích dùng để hiển thị bản đồ)",
              label: (
                <Link to='Manage/utilitiesType'>
                  Quản lý danh mục loại tiện ích
                </Link>
              ),
            },
          ],
        },
        {
          key: uuid(),
          title: "Quản lý danh mục lưu trú",
          label: <span>Quản lý danh mục lưu trú</span>,
          icon: <i className='fa-solid fa-hotel'></i>,
          children: [
            {
              key: uuid(),
              title: "Quản lý loại hình lưu trú",
              label: (
                <Link to='ContentManage/hotelType'>
                  Quản lý loại hình lưu trú
                </Link>
              ),
            },
          ],
        },
        {
          key: uuid(),
          icon: <i className='fa-solid fa-utensils'></i>,
          title: "Quản lý danh mục ẩm thực",
          label: <span>Quản lý danh mục ẩm thực</span>,
          children: [
            {
              key: uuid(),
              title: "Quản lý loại hình ẩm thực",
              label: (
                <Link to='ContentManage/restaurantType'>
                  Quản lý loại hình ẩm thực
                </Link>
              ),
            },
            {
              key: uuid(),
              title: "Quản lý kiểu ẩm thực",
              label: (
                <Link to='Manage/RestaurantCategory'>Quản lý kiểu ẩm thực</Link>
              ),
            },
          ],
        },
        {
          key: uuid(),
          icon: <i className='fa-solid fa-map-location-dot'></i>,
          title: "Quản lý danh mục địa điểm",
          label: <span>Quản lý danh mục địa điểm</span>,
          children: [
            {
              key: uuid(),
              title: "Quản lý loại địa điểm",
              label: (
                <Link to='ContentManage/placeType'>Quản lý loại địa điểm</Link>
              ),
            },
          ],
        },
        {
          key: uuid(),
          icon: <i className='fa-solid fa-plane'></i>,
          title: "Quản lý danh mục lữ hành",
          label: <span>Quản lý danh mục lữ hành</span>,
          children: [
            {
              key: uuid(),
              title: "Quản lý công ty lữ hành",
              label: (
                <Link to='ContentManage/travelCompanies'>
                  Quản lý công ty lữ hành
                </Link>
              ),
            },
            {
              key: uuid(),
              title: "Quản lý loại hình tour",
              label: <Link to='Manage/TourType'>Quản lý loại hình tour</Link>,
            },
            {
              key: uuid(),
              title: " Quản lý số điểm đến",
              label: (
                <Link to='Manage/DestinationsType'>Quản lý số điểm đến</Link>
              ),
            },
          ],
        },
      ],
    },

    {
      key: uuid(),
      title: "Quản lý trang",
      icon: <i className='fa-solid  fa-folder-open'></i>,
      label: <Link to='Pages'>Quản lý trang</Link>,
    },
    {
      key: uuid(),
      title: "Quản lý nội dung",
      icon: <i className='fa-solid fa-folder'></i>,
      label: <span>Quản lý nội dung</span>,
      children: [
        {
          key: uuid(),
          title: "Quản lý địa điểm",
          label: <Link to='ContentManage/placeList'>Quản lý địa điểm</Link>,
        },
        {
          key: uuid(),
          title: "Quản lý điểm lưu trú",
          label: <Link to='ContentManage/hotelList'>Quản lý điểm lưu trú</Link>,
        },
        {
          key: uuid(),
          title: "Quản lý điểm ẩm thực",
          label: (
            <Link to='ContentManage/restaurantList'>Quản lý điểm ẩm thực</Link>
          ),
        },
        {
          key: uuid(),
          title: "Quản lý tour lữ hành",
          label: <Link to='ContentManage/tour'>Quản lý tour lữ hành</Link>,
        },

        {
          key: uuid(),
          title: "Quản lý tin tức",
          label: <Link to='ContentManage/news'>Quản lý tin tức</Link>,
        },
        {
          key: uuid(),
          title: "Quản lý sự kiện",
          label: <Link to='ContentManage/events'>Quản lý sự kiện</Link>,
        },
        {
          key: uuid(),
          title:
            "Quản lý các tiện ích (địa điểm tiện ích dùng để hiển thị bản đồ)",
          label: <Link to='ContentManage/utilities'>Quản lý tiện ích</Link>,
        },
      ],
    },

    {
      key: "Quản trị người dùng",
      title: "Quản trị người dùng",
      icon: <i className='fa-solid fa-users-gear'></i>,
      label: <span>Quản trị người dùng</span>,
      children: [
        {
          key: uuid(),
          title: "Danh sách người dùng",
          label: <Link to='UserManager/userList'>Danh sách người dùng</Link>,
        },
        {
          key: uuid(),
          title: "Danh sách nhóm quyền",
          label: <Link to='UserManager/roleList'>Danh sách nhóm quyền</Link>,
        },
      ],
    },

    {
      key: "Báo cáo - thống kê",
      title: "Báo cáo - thống kê",
      icon: <i className='fa-solid fa-chart-simple'></i>,
      label: <span>Báo cáo - thống kê</span>,
      children: [
        {
          key: uuid(),
          icon: <i className='fa-solid fa-gauge'></i>,
          title: "Tổng quan",
          label: <Link to='/'>Tổng quan</Link>,
        },
        {
          key: uuid(),
          title: "Thống kê các đơn vị kinh doanh trên địa bàn",
          label: (
            <Link to='Statistic/businessUnit'>
              Thống kê các đơn vị kinh doanh
            </Link>
          ),
        },
        {
          key: uuid(),
          title: "Thống kê thông tin địa điểm",
          label: (
            <Link to='Statistic/placeInfo'>Thống kê thông tin địa điểm</Link>
          ),
        },
      ],
    },

    {
      key: "/UserInfo",
      title: "Thông tin cá nhân",
      icon: <i className='fa-regular fa-user'></i>,
      label: <Link to='/UserInfo'>Thông tin cá nhân</Link>,
    },
  ];
  const managerMenu = [
    {
      icon: <i className='fa-solid fa-city'></i>,
      key: uuid(),
      title: "Quản lý thành phố",
      label: <Link to='ContentManage/CityList'>Quản lý thành phố</Link>,
    },
  ];
  return (
    <div className={clsx(style.sideBar, "d-flex")}>
      <Menu
        mode='inline'
        defaultSelectedKeys={["/"]}
        defaultOpenKeys={["/"]}
        // selectable
        // selectedKeys={[location.pathname]}
        items={
          info?.role.id !== "2" && info?.role.parentUser === null
            ? managerMenu
            : cityMenu
        }
      ></Menu>
    </div>
  );
});

export default SideBar;
