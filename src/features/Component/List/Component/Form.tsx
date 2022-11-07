import "react-quill/dist/quill.snow.css";
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  Select,
  Skeleton,
  Tag,
  Upload,
} from "antd";
import ReactQuill from "react-quill";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
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

import getCookie from "../../../../Api/getCookie";
import GoogleMapReact from "google-map-react";
import Snippets from "./Snippets";
import { useLocation } from "react-router-dom";
import Permissions from "./Permissions";

import { setLocate } from "../slice/slice";

import Galleries from "./Galleries";
import SelectCategory from "./Select";
import Room from "./Room/Room";

export interface CreateFormProps {
  setIsModalOpen?: any;
  setCurrent?: any;
  id?: number | string;

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

  data,
}: CreateFormProps) => {
  const storeSate = useAppSelector(selectData).storeState;
  const actionApi = useAppSelector(selectData).actionApi;
  const locale = useAppSelector(selectData).locale;
  const localeArr = useAppSelector(selectData).localeArr;
  const parentID = useAppSelector(selectData).parentID;

  const location = useLocation().pathname;
  const [point, setPoint] = useState<any>();
  const [avatar, setAvatar] = useState<any>();

  const [district, setDistrict] = useState<any>();
  const [tag, setTag] = useState<string[]>();

  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (data?.featureImage !== null && data?.featureImage !== undefined) {
      setAvatar([
        {
          name: data?.featureImage.name,
          status: "done",
          id: data?.featureImage.id,
          url: data?.featureImage.path,
        },
      ]);
    } else setAvatar(undefined);

    setPoint({ lat: data?.lat, lng: data?.lng });
  }, [data]);
  const getSelectList = async (getApi) => {
    try {
      const cookie = Cookies.get("token");
      const result = await callApi
        .get(getApi, { headers: { Authorization: cookie } })
        .then((response) => response.data)
        .catch((err) => console.log(err));

      const option = result.data.map((obj) => {
        if (obj?.title !== undefined || obj?.name !== undefined) {
          return (
            <Select.Option key={uuid()} value={obj.id}>
              {obj?.title
                ? obj?.title
                : obj?.name
                ? obj?.name
                : "Chưa cớ tiêu đề"}
            </Select.Option>
          );
        }
      });

      setDistrict(option);
    } catch (err) {}
  };
  useEffect(() => {
    const formData = {};

    if (data) {
      Object.keys(data).forEach((key) => {
        if (data["date"]) {
          formData["date"] = moment();
        }
        if (data[key]?.id) {
          formData[key] = data[key]?.id;
        } else {
          formData[key] = data[key] !== "null" ? data[key] : "";
        }
        if (Array.isArray(data[key])) {
          formData[key] = data[key].map((item) => (item.id ? item.id : item));
        }
      });
    }
    if (data?.tag !== undefined) {
      setTag(data?.tag);
    }
    if (data?.district !== undefined) {
      getSelectList(
        `/v1/district/gets?limit=1000&page=1&locale=${locale}&search=`
      );
    }

    form.setFieldsValue(formData);
  }, [data, form]);
  const key = process.env.REACT_APP_GOOGLE_KEY;
  return (
    <>
      {storeSate !== "loading" && data ? (
        <Form
          form={form}
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
            if (avatar) {
              info.featureImage = avatar.map((img) => img.id);
            }

            if (value?.galleries?.fileList) {
              info.galleries = value?.galleries?.fileList?.map((item: any) => {
                if (item.id !== undefined) {
                  return item.id;
                } else {
                  return item?.response?.data.id;
                }
              });
            }

            if (point.lat) {
              info.lat = point?.lat;
              info.lng = point?.lng;
            }

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
          layout='inline'
        >
          <div className='d-flex flex-wrap'>
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

            {data.district !== undefined ? (
              <SelectCategory
                mode={undefined}
                Url={`/v1/district/gets?limit=1000&page=1&locale=${locale}&search=`}
                name='district'
                label='Chọn Quận/Huyện'
                locale={locale}
              ></SelectCategory>
            ) : (
              false
            )}

            {data.date !== undefined ? (
              <Form.Item
                key={uuid()}
                name={"date"}
                label='Thời gian cập nhật cuối'
              >
                <DatePicker key={uuid()}></DatePicker>
              </Form.Item>
            ) : (
              false
            )}

            <Form.Item key={uuid()} name={"locale"} label={"Ngôn ngữ"}>
              <Select
                defaultValue={locale}
                onChange={(value) => {
                  dispatch({
                    type: "GET_ROW_REQUESTED",
                    payload: {
                      ID: { id: id, name: id },
                      action: actionApi,
                      locale: value,
                    },
                  });
                  dispatch(setLocate(value));
                }}
                placeholder={"Chọn Ngôn ngữ"}
              >
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
            {data.category !== undefined ? (
              <SelectCategory
                mode='multiple'
                Url={`v1/category/gets?limit=1000&page=1&locale=${locale}&search=`}
                name='category'
                label='Chọn danh mục tin tức'
                locale={locale}
              ></SelectCategory>
            ) : (
              false
            )}
            {data.pointType !== undefined ? (
              <SelectCategory
                mode='multiple'
                Url={`v1/point-type/gets?limit=1000&page=1&locale=${locale}&search=`}
                name='pointType'
                label='Chọn loại hình lưu trú'
                locale={locale}
              ></SelectCategory>
            ) : (
              false
            )}
            {data.restaurantType !== undefined ? (
              <SelectCategory
                mode='multiple'
                Url={`v1/restaurant-type/gets?limit=1000&page=1&locale=${locale}&search=`}
                name='restaurantType'
                label='Chọn loại điểm ẩm thực'
                locale={locale}
              ></SelectCategory>
            ) : (
              false
            )}
            {data.hotelType !== undefined ? (
              <SelectCategory
                mode='multiple'
                Url={`v1/hotel-type/gets?limit=1000&page=1&locale=${locale}&search=`}
                name='hotelType'
                label='Chọn loại hình lưu trú'
                locale={locale}
              ></SelectCategory>
            ) : (
              false
            )}
            {data?.restaurantCategory !== undefined ? (
              <SelectCategory
                mode='multiple'
                Url={`/v1/restaurant-category/gets?limit=1000&page=1&locale=${locale}&search=`}
                name='restaurantCategory'
                label='Chọn kiểu ẩm thực'
                locale={locale}
              ></SelectCategory>
            ) : (
              false
            )}
            {data?.tourType !== undefined ? (
              <SelectCategory
                mode='multiple'
                Url={`/v1/tour-type/gets?limit=1000&page=1&locale=${locale}&search=`}
                name='tourType'
                label='Chọn loại hình tour'
                locale={locale}
              ></SelectCategory>
            ) : (
              false
            )}
            {data?.destinationsType !== undefined ? (
              <SelectCategory
                mode={undefined}
                Url={`/v1/destinations-type/gets?limit=1000&page=1&locale=${locale}&search=`}
                name='destinationsType'
                label='Chọn số điểm đến'
                locale={locale}
              ></SelectCategory>
            ) : (
              false
            )}
            {data?.travelCompanies !== undefined ? (
              <SelectCategory
                mode={undefined}
                Url={`/v1/travel-companies/gets?limit=1000&page=1&locale=${locale}&search=`}
                name='travelCompanies'
                label='Chọn công ty lữ hành'
                locale={locale}
              ></SelectCategory>
            ) : (
              false
            )}
            {data?.point !== undefined ? (
              <SelectCategory
                mode='multiple'
                Url={`/v1/point/gets?limit=1000&page=1&locale=${locale}&search=`}
                name='point'
                label='Chọn điểm đến'
                locale={locale}
              ></SelectCategory>
            ) : (
              false
            )}
            {data.utilitiesType !== undefined ? (
              <SelectCategory
                mode='multiple'
                Url={`v1/utilities-type/gets?limit=1000&page=1&locale=${locale}&search=`}
                name='utilitiesType'
                label='chọn loại tiện ích'
                locale={locale}
              ></SelectCategory>
            ) : (
              false
            )}
            {data.title !== undefined ? (
              <Form.Item
                className={clsx(style.formDes)}
                key={uuid()}
                label={"Tiêu đề"}
                name={"title"}
              >
                <Input></Input>
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
                <Input placeholder={"Địa chỉ"}></Input>
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
                <Input placeholder={"Mô tả"}></Input>
              </Form.Item>
            ) : (
              false
            )}
            {data.highlights !== undefined ? (
              <Form.Item
                className={clsx(style.formDes)}
                key={uuid()}
                name={"highlights"}
                label='Điểm nổi bật'
              >
                <Input></Input>
              </Form.Item>
            ) : (
              false
            )}
            {data.open !== undefined ? (
              <Form.Item
                className={clsx(style.formDes)}
                key={uuid()}
                name={"open"}
                label='Thời gian mở cửa'
              >
                <Input></Input>
              </Form.Item>
            ) : (
              false
            )}
            {data.close !== undefined ? (
              <Form.Item
                className={clsx(style.formDes)}
                key={uuid()}
                name={"close"}
                label='Thời gian đóng cửa'
              >
                <Input></Input>
              </Form.Item>
            ) : (
              false
            )}
            {data.plan !== undefined ? (
              <Form.Item
                className={clsx(style.formDes)}
                key={uuid()}
                name={"plan"}
                label='Kế hoạch du lịch'
              >
                <Input></Input>
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
                <Input placeholder={"AR"}></Input>
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
                <Input placeholder={"VR"}></Input>
              </Form.Item>
            ) : (
              false
            )}

            {data.sort !== undefined ? (
              <Form.Item
                className={clsx(style.formDes)}
                key={uuid()}
                name={"sort"}
                label='Sắp xếp thứ tự'
              >
                <Select placeholder={"Nhập thông tin thứ tự"}>
                  <Select.Option value='1'>{"1"}</Select.Option>
                  <Select.Option value='2'>{"2"}</Select.Option>
                  <Select.Option value='3'>{"3"}</Select.Option>
                  <Select.Option value='4'>{"4"}</Select.Option>
                  <Select.Option value='5'>{"5"}</Select.Option>
                </Select>
              </Form.Item>
            ) : (
              false
            )}
            {data.star !== undefined ? (
              <Form.Item
                className={clsx(style.formDes)}
                key={uuid()}
                name={"star"}
                label='Xếp hạng sao'
              >
                <Select placeholder={"Xếp hạng sao"}>
                  <Select.Option value='1'>{"1 sao"}</Select.Option>
                  <Select.Option value='2'>{"2 sao"}</Select.Option>
                  <Select.Option value='3'>{"3 sao"}</Select.Option>
                  <Select.Option value='4'>{"4 sao"}</Select.Option>
                  <Select.Option value='5'>{"5 sao"}</Select.Option>
                </Select>
              </Form.Item>
            ) : (
              false
            )}
            {data.contact !== undefined ? (
              <Form.Item
                className={clsx(style.formDes)}
                key={uuid()}
                name={"contact"}
                label='Liên hệ'
              >
                <Input placeholder={"Liên hệ"}></Input>
              </Form.Item>
            ) : (
              false
            )}
            {data.price !== undefined ? (
              <Form.Item
                className={clsx(style.formDes)}
                key={uuid()}
                name={"price"}
                label='Giá trung bình'
              >
                <Input placeholder={"Giá trung bình"}></Input>
              </Form.Item>
            ) : (
              false
            )}

            {data.tag !== undefined ? (
              <Form.Item
                className={clsx(style.formDes)}
                key={uuid()}
                name={"tag"}
                label='Tag'
              >
                <Select mode='tags' placeholder={"Nhập thông tin tag"}>
                  {tag}
                </Select>
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
                label='Ảnh đại diện'
              >
                <Upload
                  action={`${process.env.REACT_APP_CMS_API}/v1/asset/upload`}
                  headers={{ Authorization: getCookie("token") }}
                  maxCount={1}
                  listType='picture-card'
                  fileList={avatar}
                  data={(file) => {
                    return { parentUser: parentID };
                  }}
                  onChange={(e: any) => {
                    if (e.fileList.length === 0) {
                      setAvatar(undefined);
                    }

                    if (e.file.status === "done") {
                      setAvatar([
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
                  {!avatar ? uploadButton : false}
                </Upload>
              </Form.Item>
            ) : (
              false
            )}

            {data.name !== undefined ? (
              <Form.Item
                className={clsx(style.formDes)}
                key={uuid()}
                name={"name"}
                label='Định danh'
              >
                <Input placeholder={"Định danh"}></Input>
              </Form.Item>
            ) : (
              false
            )}
            {data.username !== undefined ? (
              <Form.Item
                className={clsx(style.formDes)}
                key={uuid()}
                label='Tên tài khoản'
              >
                <span>{"Tên tài khoản"}</span>
              </Form.Item>
            ) : (
              false
            )}
            {data.firstname !== undefined ? (
              <Form.Item
                className={clsx(style.formDes)}
                key={uuid()}
                label='Họ và tên'
              >
                <div className='d-flex'>
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
                    name='lastname'
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
                label='Email'
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
                label='Số điện thoại'
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
                label='Mật khẩu'
              >
                <Input></Input>
              </Form.Item>
            ) : (
              false
            )}
            {data.role !== undefined ? (
              <SelectCategory
                mode='multiple'
                Url={`/v1/city/role/gets?limit=1000&page=1&search=`}
                name='role'
                label='Chọn nhóm quyền'
                locale={"vi"}
              ></SelectCategory>
            ) : (
              false
            )}
          </div>
          {data.galleries ? <Galleries galleri={data.galleries} /> : false}
          {data.rooms !== undefined ? (
            <Room id={data.id} data={data.rooms} />
          ) : (
            false
          )}
          {data.menu !== undefined ? (
            <Form.Item
              className={clsx(style.formItem)}
              key={uuid()}
              name={"menu"}
              label='Thực đơn'
            >
              <ReactQuill
                theme='snow'
                className={clsx(style.quill)}
              ></ReactQuill>
            </Form.Item>
          ) : (
            false
          )}
          {data.content !== undefined ? (
            <Form.Item
              className={clsx(style.formItem)}
              key={uuid()}
              label='Nội dung'
              name='content'
            >
              <CKEditor
                data={form.getFieldValue("content")}
                editor={ClassicEditor}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  form.setFieldValue("content", data);
                }}
              />
              {/* <ReactQuill
                theme='snow'
                className={clsx(style.quill)}
              ></ReactQuill> */}
            </Form.Item>
          ) : (
            false
          )}

          {data.lat !== undefined && data.lng !== undefined ? (
            <Form.Item
              className={clsx(style.formItem)}
              key={uuid()}
              label='Chọn vị trí trên bản đồ '
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
              label='Khối nội dung'
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
              label='Chọn quyền truy cập'
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
