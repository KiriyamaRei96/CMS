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
// import ImageResize from "@ckeditor/ckeditor5-image/src/imageresize";
import Autocomplete from "react-google-autocomplete";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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
import ChangePassForm from "./ChangePassForm";
import ContentEditor from "../../ContentEditor";
import { userInfoSelector } from "../../Login/slice/UserSlice";

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
  const [highLights, setHighLights] = useState<string[]>();

  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const info = useAppSelector(userInfoSelector).info;

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
                : "Ch??a c?? ti??u ?????"}
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
    if (data.highlights !== undefined) {
      setHighLights(data.highlights);
    }

    if (data?.district !== undefined) {
      getSelectList(
        `/v1/district/gets?limit=1000&page=1&locale=${locale}&search=`
      );
    }
    console.log(data.type);
    form.setFieldsValue(formData);
  }, [data, form]);
  const key = process.env.REACT_APP_GOOGLE_KEY;

  return (
    <>
      {storeSate !== "loading" && data ? (
        <Form
          form={form}
          className={clsx(style.form)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.stopPropagation();
              e.preventDefault();
            }
          }}
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
                  disabled={
                    info?.role?.id === "2"
                      ? false
                      : !info?.permissions["media.upload"]
                  }
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
                label='Ch???n Qu???n/Huy???n'
                locale={locale}
              ></SelectCategory>
            ) : (
              false
            )}

            {data.date !== undefined ? (
              <Form.Item
                key={uuid()}
                name={"date"}
                label='Th???i gian c???p nh???t cu???i'
              >
                <DatePicker key={uuid()}></DatePicker>
              </Form.Item>
            ) : (
              false
            )}

            <Form.Item key={uuid()} name={"locale"} label={"Ng??n ng???"}>
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
                placeholder={"Ch???n Ng??n ng???"}
                disabled={Object.keys(localeArr).length === 0}
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
                label='Ch???n danh m???c tin t???c'
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
                label='Ch???n lo???i ?????a ??i???m'
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
                label='Ch???n lo???i ??i???m ???m th???c'
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
                label='Ch???n lo???i h??nh l??u tr??'
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
                label='Ch???n ki???u ???m th???c'
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
                label='Ch???n lo???i h??nh tour'
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
                label='Ch???n s??? ??i???m ?????n'
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
                label='Ch???n c??ng ty l??? h??nh'
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
                label='Ch???n ??i???m ?????n'
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
                label='Ch???n lo???i ti???n ??ch'
                locale={locale}
              ></SelectCategory>
            ) : (
              false
            )}
            {data.title !== undefined ? (
              <Form.Item
                className={clsx(style.formDes)}
                key={uuid()}
                label={"Ti??u ?????"}
                name={"title"}
                rules={[
                  {
                    required: true,
                    message: "Kh??ng ???????c b??? tr???ng tr?????ng n??y!",
                  },
                  () => ({
                    validator(_, value) {
                      if (value.length >= 2) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Ti??u ????? ph???i c?? nhi???u h??n 2 k?? t???")
                      );
                    },
                    message: "Ti??u ????? ph???i c?? nhi???u h??n 2 k?? t???",
                  }),
                ]}
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
                label='?????a ch???'
              >
                <Input placeholder={"?????a ch???"}></Input>
              </Form.Item>
            ) : (
              false
            )}
            {data.description !== undefined ? (
              <Form.Item
                className={clsx(style.formDes)}
                key={uuid()}
                name={"description"}
                label='M?? t???'
              >
                <Input placeholder={"M?? t???"}></Input>
              </Form.Item>
            ) : (
              false
            )}
            {data.highlights !== undefined ? (
              <Form.Item
                className={clsx(style.formDes)}
                key={uuid()}
                name={"highlights"}
                label='??i???m n???i b???t'
              >
                <Select mode='tags' placeholder={"Nh???p ??i???m n???i b???t"}>
                  {highLights}
                </Select>
              </Form.Item>
            ) : (
              false
            )}
            {data.open !== undefined ? (
              <Form.Item
                className={clsx(style.formDes)}
                key={uuid()}
                name={"open"}
                label='Th???i gian m??? c???a'
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
                label='Th???i gian ????ng c???a'
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
                label='K??? ho???ch du l???ch'
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
                label='S???p x???p th??? t???'
              >
                <Select placeholder={"Nh???p th??ng tin th??? t???"}>
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
                label='X???p h???ng sao'
              >
                <Select placeholder={"X???p h???ng sao"}>
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
                label='Li??n h???'
              >
                <Input placeholder={"Li??n h???"}></Input>
              </Form.Item>
            ) : (
              false
            )}
            {data.price !== undefined ? (
              <Form.Item
                className={clsx(style.formDes)}
                key={uuid()}
                name={"price"}
                label='Gi?? trung b??nh'
              >
                <Input placeholder={"Gi?? trung b??nh"}></Input>
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
                <Select mode='tags' placeholder={"Nh???p th??ng tin tag"}>
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
                label='???nh ?????i di???n'
              >
                <Upload
                  disabled={
                    info?.role?.id === "2"
                      ? false
                      : !info?.permissions["media.upload"]
                  }
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
                label='?????nh danh'
              >
                {/* <Input  placeholder={"?????nh danh"}></Input> */}
                <span>{data.name}</span>
              </Form.Item>
            ) : (
              false
            )}
            {data.username !== undefined ? (
              <Form.Item
                className={clsx(style.formDes)}
                key={uuid()}
                label='T??n t??i kho???n'
              >
                <span>{data?.username}</span>
              </Form.Item>
            ) : (
              false
            )}
            {data.time !== undefined ? (
              <Form.Item
                className={clsx(style.formDes)}
                name={"time"}
                key={uuid()}
                label='Th???i gian Tour'
              >
                <Input />
              </Form.Item>
            ) : (
              false
            )}
            {data.firstname !== undefined ? (
              <Form.Item
                className={clsx(style.formDes)}
                key={uuid()}
                label='H??? v?? t??n'
              >
                <div className='d-flex'>
                  <Form.Item
                    name={"firstname"}
                    style={{
                      display: "inline-block",
                      width: "calc(50% - 8px)",
                    }}
                    rules={[
                      {
                        required: true,
                        message: "Kh??ng ???????c b??? tr???ng tr?????ng n??y!",
                      },
                      () => ({
                        validator(_, value) {
                          if (value.length >= 2) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("H??? ph???i c?? nhi???u h??n 2 k?? t???")
                          );
                        },
                        message: "H??? ph???i c?? nhi???u h??n 2 k?? t???",
                      }),
                    ]}
                  >
                    <Input placeholder={data.firstname} />
                  </Form.Item>
                  <Form.Item
                    name='lastname'
                    style={{
                      display: "inline-block",
                      width: "calc(50% - 8px)",
                    }}
                    rules={[
                      {
                        required: true,
                        message: "Kh??ng ???????c b??? tr???ng tr?????ng n??y!",
                      },
                      () => ({
                        validator(_, value) {
                          if (value.length >= 2) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("T??n ph???i c?? nhi???u h??n 2 k?? t???")
                          );
                        },
                        message: "T??n ph???i c?? nhi???u h??n 2 k?? t???",
                      }),
                    ]}
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
                rules={[
                  () => ({
                    validator(_, value) {
                      if (
                        value.match(
                          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                        )
                      ) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Sai ?????nh d???ng email"));
                    },
                    message: "Sai ?????nh d???ng email",
                  }),
                ]}
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
                label='S??? ??i???n tho???i'
                rules={[
                  () => ({
                    validator(_, value) {
                      if (
                        /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/.test(value) &&
                        value.length >= 10 &&
                        value.length < 12
                      ) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Sai ?????nh d???ng s??? ??i???n tho???i")
                      );
                    },
                    message: "Sai ?????nh d???ng s??? ??i???n tho???i",
                  }),
                ]}
              >
                <Input type='number' placeholder={data?.phone}></Input>
              </Form.Item>
            ) : (
              false
            )}
            {data.firstname !== undefined ? (
              <Form.Item
                className={clsx(style.formDes)}
                key={uuid()}
                name={"password"}
                label='M???t kh???u'
              >
                <ChangePassForm setField={form.setFieldValue}></ChangePassForm>
              </Form.Item>
            ) : (
              false
            )}
            {data.role !== undefined ? (
              <SelectCategory
                mode={undefined}
                Url={`/v1/city/role/gets?limit=1000&page=1&search=`}
                name='role'
                label='Ch???n nh??m quy???n'
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
              label='Th???c ????n'
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
              label='N???i dung'
              name='content'
            >
              <ContentEditor
                setContent={form.setFieldValue}
                content={data.content}
              />
            </Form.Item>
          ) : (
            false
          )}

          {data.lat !== undefined && data.lng !== undefined ? (
            <Form.Item
              className={clsx(style.formItem)}
              key={uuid()}
              label='Ch???n v??? tr?? tr??n b???n ????? '
            >
              <>
                <Autocomplete
                  onPlaceSelected={(place) => {
                    setPoint({
                      lat: place.geometry.location.lat(),
                      lng: place.geometry.location.lng(),
                    });
                  }}
                  apiKey={key ? key : ""}
                  options={{
                    componentRestrictions: { country: "VN" },
                    types: ["address"],
                  }}
                />
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
              </>
            </Form.Item>
          ) : (
            false
          )}
          {data.snippets !== undefined ? (
            <Form.Item
              className={clsx(style.formItem)}
              key={uuid()}
              label='Kh???i n???i dung'
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
              label='Ch???n quy???n truy c???p'
            >
              <Permissions
                permissionRole={data.permissionRole}
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
              X??c Nh???n
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
