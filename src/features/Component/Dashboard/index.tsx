import React, { memo, useEffect, useState } from "react";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { Link, useLocation } from "react-router-dom";
import style from "./style.module.scss";
import { dashBroadSelector } from "./slice/slice";

export interface DashBroadProps {}

const DashBroad = memo((props: DashBroadProps) => {
  const dispatch = useAppDispatch();
  const location = useLocation().pathname;
  const [name, setName] = useState("");
  const dashBroad = useAppSelector(dashBroadSelector).dashBroad;
  console.log(dashBroad);

  useEffect(() => {
    switch (location) {
      case "/Statistic/placeInfo":
        dispatch({
          type: "GET_PLACE_INFO",
        });
        setName("Thống kê điểm đến");
        break;
    }
  }, []);
  const getTotal = (dashBroad) => {
    let total = 0;
    Object.keys(dashBroad).forEach((num) => (total += dashBroad[num]));
    return total;
  };
  return (
    <div className={clsx("content d-flex")}>
      <div className={clsx(style.header)}>
        <h2>{name}</h2>
      </div>
      {location === "/Statistic/placeInfo" ? (
        <div>
          <div className={clsx(style.total)}>
            <h3>Tổng số lượng điểm đến:{getTotal(dashBroad)}</h3>
          </div>
          <div className={clsx(style.list, "d-flex")}>
            <div>
              <span>Điểm thăm quan:</span>
              <h4>{dashBroad.point}</h4>
              <Link to="/ContentManage/placeList"> Xem chi tiết </Link>
            </div>
            <div>
              <span>Điểm ẩm thực:</span>
              <h4>{dashBroad.restaurant}</h4>
              <Link to="/ContentManage/restaurantList"> Xem chi tiết </Link>
            </div>{" "}
            <div>
              <span>Điểm lưu trú</span>
              <h4>{dashBroad.hotel}</h4>
              <Link to="/ContentManage/hotelList">Xem chi tiết</Link>
            </div>
            <div>
              <span>Điểm tiện ích</span>
              <h4>{dashBroad.utilities}</h4>
              <Link to="/ContentManage/utilities"> Xem chi tiết </Link>
            </div>
          </div>
        </div>
      ) : (
        false
      )}
    </div>
  );
});
export default DashBroad;
