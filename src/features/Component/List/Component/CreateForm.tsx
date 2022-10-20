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
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { selectData } from "../../../../app/store";
import { v4 as uuid } from "uuid";
import { titleMap } from "../titleMap";
import style from "../style.module.scss";
import clsx from "clsx";
import { callApi } from "../../../../Api/Axios";
import Cookies from "js-cookie";
import moment from "moment";
import { UploadOutlined } from "@ant-design/icons";
import { RcFile } from "antd/lib/upload";
import getCookie from "../../../../Api/getCookie";
import GoogleMapReact from "google-map-react";
import Snippets from "./Snippets";
export interface CreateFormProps {
  setIsModalOpen?: any;
  setCurrent?: any;
  id?: number | string;
}

const Marker = ({ child, lat, lng }) => <div>{child}</div>;

const CreateForm = ({
  setCurrent,
  setIsModalOpen,
  id = 0,
}: CreateFormProps) => {
  const dataItem: any = useAppSelector(selectData).infoArray;
  const storeSate = useAppSelector(selectData).storeState;
  const actionApi = useAppSelector(selectData).actionApi;
  const locale = useAppSelector(selectData).locale;
  const localeArr = useAppSelector(selectData).localeArr;

  const dispatch = useAppDispatch();
  const [data, setData] = useState<any>();
  const [typeOption, setTypeOption] = useState<any>();

  useEffect(() => {
    if (id) {
      dispatch({
        type: "GET_ROW_REQUESTED",
        payload: {
          ID: { id: id, name: id },
          action: actionApi,
          locale,
        },
      });
    }
  }, [id]);
  useEffect(() => {
    if (data?.category !== undefined) {
      getSelectList("v1/category/gets?limit=10&page=1&search=");
    } else if (data?.pointType !== undefined) {
      getSelectList("v1/point-type/gets?limit=10&page=1&search=");
    } else if (data?.hotelType !== undefined) {
      getSelectList("v1/hotel-type/gets?limit=10&page=1&search=");
    } else if (data?.utilitiesType !== undefined) {
      getSelectList("v1/utilities-type/gets?limit=10&page=1&search=");
    } else if (data?.restaurantType !== undefined) {
      getSelectList("v1/restaurant-type/gets?limit=10&page=1&search=");
    }
  }, [data, typeOption, id]);

  useEffect(() => {
    setTypeOption(false);
    if (storeSate !== "loading") {
      if (id) {
        typeof id === "number"
          ? setData(dataItem[dataItem.findIndex((obj) => obj.id === id)])
          : setData(dataItem[dataItem.findIndex((obj) => obj.name === id)]);
      }

      if (!id) {
        setData(dataItem[id]);
      }
    }
  }, [dataItem, storeSate, id, locale]);
  const getSelectList = async (getApi) => {
    if (!typeOption)
      try {
        const cookie = Cookies.get("token");
        const result = await callApi
          .get(getApi, { headers: { Authorization: cookie } })
          .then((response) => response.data)
          .catch((err) => console.log(err));

        const option = result.data.map((obj) => {
          if (obj?.title) {
            return <Select.Option value={obj.id}>{obj?.title}</Select.Option>;
          }
        });
        setTypeOption(option);
      } catch (err) {
        console.log(err);
      }
  };
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

            info.date = moment(info.date, "DD-MM-YYYY").format("YYYY-MM-DD");
            if (info.featureImage !== undefined && info.featureImage !== null) {
              info.featureImage = data.featureImage.id;
            }
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
          layout='inline'
        >
          <div className='d-flex'>
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
                  loading={!typeOption}
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
                  loading={!typeOption}
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
                  loading={!typeOption}
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
                  loading={!typeOption}
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
                  loading={!typeOption}
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
                label='Thời gian cập nhật cuối'
              >
                <DatePicker
                  defaultPickerValue={moment()}
                  key={uuid()}
                ></DatePicker>
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
                        className='icon'
                        src={localeArr[key].icon}
                        alt=''
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
                label='Địa chỉ'
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
                label='Mô tả'
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
                label='Ảnh'
              >
                <Upload
                  action={`${process.env.REACT_APP_CMS_API}/v1/asset/upload`}
                  headers={{ Authorization: getCookie("token") }}
                  maxCount={1}
                  onChange={(e: any) => {
                    if (e.file.status === "done") {
                      setData({
                        ...data,
                        featureImage: {
                          img: e.file?.response?.data["path_150px"],
                          id: e.file?.response?.data.id,
                        },
                      });
                    }
                  }}
                >
                  <Button icon={<UploadOutlined />}>Click để Upload</Button>
                </Upload>
              </Form.Item>
            ) : data?.featureImage?.img !== undefined ? (
              <Form.Item
                className={clsx(style.formDes)}
                key={uuid()}
                name={"featureImage"}
                label='Ảnh'
              >
                <img src={data.featureImage.img} alt='example'></img>
              </Form.Item>
            ) : (
              false
            )}
            {data.ar !== undefined ? (
              <Form.Item
                className={clsx(style.formDes)}
                key={uuid()}
                name={"ar"}
                label='AR'
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
                label='VR'
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
                label='Định danh trang'
              >
                <Input placeholder={data?.name}></Input>
              </Form.Item>
            ) : (
              false
            )}
          </div>

          {data.content !== undefined ? (
            <Form.Item
              className={clsx(style.formItem)}
              key={uuid()}
              name={"content"}
              label='Nội dung'
            >
              <ReactQuill
                theme='snow'
                className={clsx(style.quill)}
                value={data.content}
                placeholder={data.content}
                defaultValue={"text text text"}
              ></ReactQuill>
            </Form.Item>
          ) : (
            false
          )}

          {data.lat !== undefined && data.lng !== undefined ? (
            <Form.Item
              className={clsx(style.formItem)}
              key={uuid()}
              name={"content"}
              label='Chọn vị trí trên bản đồ '
            >
              <div style={{ width: "100%", height: "500px" }}>
                <GoogleMapReact
                  bootstrapURLKeys={{
                    key: key ? key : "",
                  }}
                  defaultCenter={{
                    lat: Number(data?.lat)
                      ? Number(data?.lat)
                      : 21.028344147220377,
                    lng: Number(data?.lng)
                      ? Number(data?.lng)
                      : 105.83696287966175,
                  }}
                  defaultZoom={15}
                  onClick={(e) =>
                    setData({
                      ...data,
                      lat: e.lat.toString(),
                      lng: e.lng.toString(),
                    })
                  }
                >
                  <Marker
                    lat={
                      Number(data?.lat) ? Number(data?.lat) : 21.028344147220377
                    }
                    lng={
                      Number(data?.lng) ? Number(data?.lng) : 105.83696287966175
                    }
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
              name={"content"}
              label='Khối nội dung'
            >
              <Snippets data={data?.snippets} pageName={id}></Snippets>
            </Form.Item>
          ) : (
            false
          )}
          <Form.Item key={uuid()}>
            <Button
              className={clsx(style.submit)}
              key={uuid()}
              htmlType='submit'
              type='primary'
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
