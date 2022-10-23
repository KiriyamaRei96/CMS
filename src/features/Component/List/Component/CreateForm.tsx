import "react-quill/dist/quill.snow.css";
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  Select,
  Skeleton,
  Upload,
} from "antd";
import ReactQuill from "react-quill";
import React, { ReactElement, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { selectData } from "../../../../store/store";
import { v4 as uuid } from "uuid";
import { titleMap } from "../titleMap";
import style from "../style.module.scss";
import clsx from "clsx";
import { callApi } from "../../../../Api/Axios";
import Cookies from "js-cookie";
import moment, { now } from "moment";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { RcFile } from "antd/lib/upload";
import getCookie from "../../../../Api/getCookie";
import GoogleMapReact from "google-map-react";
import Snippets from "./Snippets";
import { useLocation } from "react-router-dom";
import Permissions from "./Permissions";
import { env } from "process";
import openNotificationWithIcon from "../../../function/toast";
export interface CreateFormProps {
  setIsModalOpen?: any;
  setCurrent?: any;
  id?: number | string;
  typeOption?: Array<ReactElement>;
  data: any;
}

const Marker = ({ child, lat, lng }) => <div>{child}</div>;
const uploadButton = (
  <div>
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>Upload</div>
  </div>
);
const CreateForm = ({
  setCurrent,
  setIsModalOpen,
  id = 0,
  typeOption,
  data,
}: CreateFormProps) => {
  const storeSate = useAppSelector(selectData).storeState;
  const actionApi = useAppSelector(selectData).actionApi;
  const locale = useAppSelector(selectData).locale;
  const localeArr = useAppSelector(selectData).localeArr;
  const parentID = useAppSelector(selectData).parentID;

  const location = useLocation().pathname;
  const [point, setPoint] = useState<any>();
  const [fileList, setFileList] = useState<any>();
  const [content, setContent] = useState<any>();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (data?.featureImage !== null && data?.featureImage !== undefined) {
      setFileList([
        {
          name: data?.featureImage.name,
          status: "done",
          id: data?.featureImage.id,
          url: data?.featureImage.path,
        },
      ]);
    } else setFileList(undefined);
    if (data?.content !== null) {
      setContent(data?.content);
    }
    setPoint({ lat: data?.lat, lng: data?.lng });
  }, [data]);
  const key = process.env.REACT_APP_GOOGLE_KEY;
  return (
    <>
      {storeSate !== "loading" && data ? (
        <Form
          className={clsx(style.form)}
          onFinish={(value) => {
            Object.keys(value).forEach((key) => {
              if (value[key] === undefined) {
                delete value[key];
              }
            });
            const info = { ...data, ...value };
            if (info.date === null) {
              info.date = moment();
            }
            info.date = moment(info.date, "DD-MM-YYYY").format("YYYY-MM-DD");
            if (fileList) {
              info.featureImage = fileList.map((img) => img.id);
            }
            if (content) {
              info.content = content;
            }

            if (point.lat) {
              info.lat = point?.lat;
              info.lng = point?.lng;
            }
            delete info.role;
            delete info.username;

            info.locale = locale;

            dispatch({
              type: "UPDATE_ROW_REQUESTED",
              payload: {
                info,
                action: actionApi,
              },
            });

            if (setCurrent) {
              setCurrent(0);
            }
            if (setIsModalOpen) {
              setIsModalOpen(false);
            }
          }}
          layout="inline"
        >
          <div className="d-flex flex-wrap">
            {data.id ? (
              <Form.Item key={uuid()} label={titleMap.id}>
                <span key={uuid()}>{data.id}</span>
              </Form.Item>
            ) : (
              false
            )}

            {data.published !== undefined ? (
              <Form.Item
                key={uuid()}
                name={"published"}
                label={titleMap.published}
              >
                <Checkbox
                  key={uuid()}
                  defaultChecked={data.published}
                  onChange={(e) => {
                    callApi(actionApi + "/published", {
                      method: "PUT",
                      headers: { Authorization: Cookies.get("token") },
                      data: {
                        id: data.id,
                        published: e.target.checked ? 1 : 0,
                        name: data.name,
                        parentUser: parentID,
                      },
                    });
                  }}
                ></Checkbox>
              </Form.Item>
            ) : (
              false
            )}
            {data.category !== undefined ? (
              <Form.Item
                key={uuid()}
                name={"category"}
                label={titleMap.category}
              >
                <Select
                  defaultValue={
                    data?.category?.id ? data?.category?.id : undefined
                  }
                  placeholder={"Chọn danh mục"}
                >
                  {typeOption}
                </Select>
              </Form.Item>
            ) : (
              false
            )}
            {data.pointType !== undefined ? (
              <Form.Item
                key={uuid()}
                name={"pointType"}
                label={"Loại địa điểm"}
              >
                <Select
                  defaultValue={
                    data?.pointType?.id !== null
                      ? data?.pointType?.id
                      : undefined
                  }
                  placeholder={"Chọn loại địa điểm"}
                >
                  {typeOption}
                </Select>
              </Form.Item>
            ) : (
              false
            )}
            {data.restaurantType !== undefined ? (
              <Form.Item
                key={uuid()}
                name={"restaurantType"}
                label={"Loại nhà hàng"}
              >
                <Select
                  defaultValue={
                    data?.restaurantType?.id !== null
                      ? data?.restaurantType.id
                      : undefined
                  }
                  placeholder={"Chọn loại nhà hàng"}
                >
                  {typeOption}
                </Select>
              </Form.Item>
            ) : (
              false
            )}
            {data.hotelType !== undefined ? (
              <Form.Item
                key={uuid()}
                name={"hotelType"}
                label={"Loại khách sạn"}
              >
                <Select
                  defaultValue={
                    data?.hotelType?.id !== null
                      ? data?.hotelType?.id
                      : undefined
                  }
                  placeholder={"Chọn loại khách sạn"}
                >
                  {typeOption}
                </Select>
              </Form.Item>
            ) : (
              false
            )}
            {data.utilitiesType !== undefined ? (
              <Form.Item
                key={uuid()}
                name={"utilitiesType"}
                label={"Loại tiện ích"}
              >
                <Select
                  defaultValue={
                    data?.utilitiesType?.id !== null
                      ? data?.utilitiesType?.id
                      : undefined
                  }
                  placeholder={"Chọn loại tiện ích"}
                >
                  {typeOption}
                </Select>
              </Form.Item>
            ) : (
              false
            )}
            {data.date !== undefined ? (
              <Form.Item
                key={uuid()}
                name={"date"}
                label="Thời gian cập nhật cuối"
              >
                <DatePicker key={uuid()}></DatePicker>
              </Form.Item>
            ) : (
              false
            )}

            <Form.Item key={uuid()} name={"locale"} label={"Ngôn ngữ"}>
              <Select defaultValue={locale} placeholder={"Chọn Ngôn ngữ"}>
                {Object.keys(localeArr).map((key) => {
                  return (
                    <Select.Option value={key}>
                      <img
                        className="icon"
                        src={localeArr[key].icon}
                        alt=""
                      ></img>
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </div>
          <div className={clsx(style.titleWraper, "d-flex")}>
            {data.title !== undefined ? (
              <Form.Item
                className={clsx(style.formDes)}
                key={uuid()}
                label={"Tiêu đề"}
                name={"title"}
              >
                <Input
                  placeholder={data?.title ? data?.title : "Chưa nhập tiêu đề"}
                ></Input>
              </Form.Item>
            ) : (
              false
            )}
            {data.address !== undefined ? (
              <Form.Item
                className={clsx(style.formDes)}
                key={uuid()}
                name={"address"}
                label="Địa chỉ"
              >
                <Input placeholder={data?.address}></Input>
              </Form.Item>
            ) : (
              false
            )}
            {data.description !== undefined ? (
              <Form.Item
                className={clsx(style.formDes)}
                key={uuid()}
                name={"description"}
                label="Mô tả"
              >
                <Input placeholder={data?.description}></Input>
              </Form.Item>
            ) : (
              false
            )}
            {data.featureImage !== undefined &&
            data?.featureImage?.img === undefined ? (
              <Form.Item
                className={clsx(style.formDes)}
                key={uuid()}
                name={"featureImage"}
                label="Ảnh"
              >
                <Upload
                  action={`${process.env.REACT_APP_CMS_API}/v1/asset/upload`}
                  headers={{ Authorization: getCookie("token") }}
                  maxCount={1}
                  listType="picture-card"
                  fileList={fileList}
                  data={(file) => {
                    return { parentUser: parentID };
                  }}
                  onChange={(e: any) => {
                    if (e.fileList.length === 0) {
                      setFileList(undefined);
                    }
                    if (e.file.status === "uploading" && fileList) {
                      openNotificationWithIcon(
                        "warning",
                        "Cập nhật hình ảnh không thành công",
                        "Bạn đã có hình ảnh cũ thông tin chỉ cho phép 1 hình ảnh, vui lòng xóa hình ảnh cũ trước khi cập nhật mới"
                      );
                    }
                    if (e.file.status === "done") {
                      setFileList([
                        {
                          name: e.file.response.data.name,
                          status: "done",
                          id: e.file.response.data.id,
                          url: e.file.response.data.path,
                        },
                      ]);
                    }
                  }}
                >
                  {uploadButton}
                </Upload>
              </Form.Item>
            ) : data?.featureImage?.img !== undefined ? (
              <Form.Item
                className={clsx(style.formDes)}
                key={uuid()}
                name={"featureImage"}
                label="Ảnh"
              >
                <img src={data.featureImage.img} alt="example"></img>
              </Form.Item>
            ) : (
              false
            )}
            {data.ar !== undefined ? (
              <Form.Item
                className={clsx(style.formDes)}
                key={uuid()}
                name={"ar"}
                label="AR"
              >
                <Input placeholder={data?.ar}></Input>
              </Form.Item>
            ) : (
              false
            )}
            {data.vr !== undefined ? (
              <Form.Item
                className={clsx(style.formDes)}
                key={uuid()}
                name={"vr"}
                label="VR"
              >
                <Input placeholder={data?.vr}></Input>
              </Form.Item>
            ) : (
              false
            )}
            {data.name !== undefined ? (
              <Form.Item
                className={clsx(style.formDes)}
                key={uuid()}
                name={"name"}
                label="Định danh"
              >
                <Input placeholder={data?.name}></Input>
              </Form.Item>
            ) : (
              false
            )}
            {data.username !== undefined ? (
              <Form.Item
                className={clsx(style.formDes)}
                key={uuid()}
                label="Tên tài khoản"
              >
                <span>{data?.username}</span>
              </Form.Item>
            ) : (
              false
            )}
            {data.firstname !== undefined ? (
              <Form.Item
                className={clsx(style.formDes)}
                key={uuid()}
                label="Họ và tên"
              >
                <div className="d-flex">
                  <Form.Item
                    name={"firstname"}
                    style={{
                      display: "inline-block",
                      width: "calc(50% - 8px)",
                    }}
                  >
                    <Input placeholder={data.firstname} />
                  </Form.Item>
                  <Form.Item
                    name="lastname"
                    style={{
                      display: "inline-block",
                      width: "calc(50% - 8px)",
                    }}
                  >
                    <Input placeholder={data.lastname} />
                  </Form.Item>
                </div>
              </Form.Item>
            ) : (
              false
            )}
            {data.email !== undefined ? (
              <Form.Item
                className={clsx(style.formDes)}
                key={uuid()}
                name={"email"}
                label="Email"
              >
                <Input placeholder={data?.email}></Input>
              </Form.Item>
            ) : (
              false
            )}
            {data.phone !== undefined ? (
              <Form.Item
                className={clsx(style.formDes)}
                key={uuid()}
                name={"phone"}
                label="Số điện thoại"
              >
                <Input placeholder={data?.phone}></Input>
              </Form.Item>
            ) : (
              false
            )}
            {data.firstname !== undefined ? (
              <Form.Item
                className={clsx(style.formDes)}
                key={uuid()}
                name={"password"}
                label="Mật khẩu"
              >
                <Input></Input>
              </Form.Item>
            ) : (
              false
            )}
            {data.role !== undefined ? (
              <Form.Item
                className={clsx(style.formDes)}
                key={uuid()}
                name={"role"}
                label={"Nhóm quyền"}
              >
                <Select
                  defaultValue={
                    data?.role?.id !== null ? data?.role?.id : undefined
                  }
                  placeholder={"Chọn Nhóm quyền"}
                >
                  {typeOption}
                </Select>
              </Form.Item>
            ) : (
              false
            )}
          </div>

          {data.content !== undefined ? (
            <>
              <label>Nội dung:</label>
              <ReactQuill
                onChange={(value) => {
                  setContent(value);
                }}
                value={content}
                theme="snow"
                className={clsx(style.quill)}
              ></ReactQuill>
            </>
          ) : (
            false
          )}

          {data.lat !== undefined && data.lng !== undefined ? (
            <Form.Item
              className={clsx(style.formItem)}
              key={uuid()}
              label="Chọn vị trí trên bản đồ "
            >
              <div style={{ width: "100%", height: "500px" }}>
                <GoogleMapReact
                  bootstrapURLKeys={{
                    key: key ? key : "",
                  }}
                  defaultCenter={{
                    lat: Number(point?.lat ? point?.lat : 21.027105947174572),
                    lng: Number(point?.lng ? point?.lng : 105.8380794988938),
                  }}
                  defaultZoom={15}
                  onClick={(e) =>
                    setPoint({
                      lat: e.lat.toString(),
                      lng: e.lng.toString(),
                    })
                  }
                >
                  <Marker
                    lat={Number(point?.lat ? point?.lat : 21.027105947174572)}
                    lng={Number(point?.lng ? point?.lng : 105.8380794988938)}
                    child={
                      <i
                        className={clsx(
                          "fa-solid fa-location-dot",
                          style.marker
                        )}
                      ></i>
                    }
                  ></Marker>
                </GoogleMapReact>
              </div>
            </Form.Item>
          ) : (
            false
          )}
          {data.snippets !== undefined ? (
            <Form.Item
              className={clsx(style.formItem)}
              key={uuid()}
              label="Khối nội dung"
            >
              <Snippets data={data?.snippets} pageName={data?.name}></Snippets>
            </Form.Item>
          ) : (
            false
          )}
          {location.includes("UserManager") ? (
            <Form.Item
              className={clsx(style.formItem)}
              key={uuid()}
              label="Chọn quyền truy cập"
            >
              <Permissions
                id={
                  data.firstname
                    ? {
                        user_id: data.id,
                      }
                    : { role_id: data.id }
                }
              />
            </Form.Item>
          ) : (
            false
          )}
          <Form.Item key={uuid()}>
            <Button
              className={clsx(style.submit)}
              key={uuid()}
              htmlType="submit"
              type="primary"
            >
              Xác Nhận
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <Skeleton active />
      )}
    </>
  );
};
export default CreateForm;
