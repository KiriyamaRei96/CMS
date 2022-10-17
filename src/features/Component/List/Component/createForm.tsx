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
export interface CreateFormProps {
  setIsModalOpen?: any;
  setCurrent?: any;
  id?: number;
}

const CreateForm = ({
  setCurrent,
  setIsModalOpen,
  id = 0,
}: CreateFormProps) => {
  const dataItem: any = useAppSelector(selectData).infoArray;
  const storeSate = useAppSelector(selectData).storeState;
  const actionApi = useAppSelector(selectData).actionApi;
  const dispatch = useAppDispatch();
  const [data, setData] = useState<any>();
  const [option, setOption] = useState<any>();

  useEffect(() => {
    if (id) {
      dispatch({
        type: "GET_ROW_REQUESTED",
        payload: {
          ID: { id: id },
          action: actionApi,
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
    }
  }, [data, option, id]);

  useEffect(() => {
    setOption(false);
    if (storeSate !== "loading") {
      if (id) {
        setData(dataItem[dataItem.findIndex((obj) => obj.id === id)]);
      }

      if (!id) {
        setData(dataItem[id]);
      }
    }
  }, [dataItem, storeSate, id]);
  const getSelectList = async (getApi) => {
    if (!option)
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
        setOption(option);
      } catch (err) {
        console.log(err);
      }
  };

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
            if (info.featureImage !== undefined) {
              info.featureImage = data.featureImage.id;
            }
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
          <div className="d-flex">
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
                  onChange={(e) => {
                    callApi(actionApi + "/published", {
                      method: "PUT",
                      headers: { Authorization: Cookies.get("token") },
                      data: {
                        id: data.id,
                        published: e.target.checked ? 1 : 0,
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
                <Select placeholder={"Chọn danh mục"} loading={!option}>
                  {option}
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
                <Select placeholder={"Chọn loại địa điểm"} loading={!option}>
                  {option}
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
                <Select placeholder={"Chọn loại khách sạn"} loading={!option}>
                  {option}
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
          </div>
          <div className={clsx(style.titleWraper, "d-flex")}>
            {data.title ? (
              <Form.Item
                className={clsx(style.formDes)}
                key={uuid()}
                label={"Tiêu đề"}
                name={"title"}
              >
                <Input placeholder={data?.title}></Input>
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
                label="Ảnh"
              >
                <img src={data.featureImage.img} alt="example"></img>
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
              label="Nội dung"
            >
              <ReactQuill
                theme="snow"
                className={clsx(style.quill)}
                value={data.content}
                placeholder={data.content}
                defaultValue={"text text text"}
              ></ReactQuill>
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
{
  /* {Object.keys(data).map((key) => (
            <>
              {key == "id" || key == "creationDate" ? (
                <Form.Item
                  key={key}
                  label={titleMap[key] ? titleMap[key] : key}
                >
                  <span key={uuid()}>{data[key]}</span>
                </Form.Item>
              ) : key == "date" ? (
                <Form.Item key={key} name={key} label='Thời gian'>
                  <DatePicker key={uuid()}></DatePicker>
                </Form.Item>
              ) : key == "content" ? (
                <Form.Item
                  key={key}
                  name={key}
                  label={titleMap[key] ? titleMap[key] : key}
                >
                  <ReactQuill
                    theme='snow'
                    className={clsx(style.quill)}
                    value={value}
                    onChange={(value) => {
                      console.log(value);
                    }}
                  ></ReactQuill>
                </Form.Item>
              ) : key == "category" ? (
                <Form.Item
                  key={key}
                  name={key}
                  label={titleMap[key] ? titleMap[key] : key}
                >
                  <Select
                    onFocus={() => {
                      getSelectList("v1/category/gets?limit=10&page=1&search=");
                    }}
                    placeholder={titleMap[key] ? titleMap[key] : key}
                  >
                    {option}
                  </Select>
                </Form.Item>
              ) : key == "featureImage" ? (
                <Form.Item
                  key={key}
                  name={key}
                  label={titleMap[key] ? titleMap[key] : key}
                >
                  <Select
                    onFocus={() => {
                      getSelectList(
                        "v1/asset/gets?page=1&limit=10&parentId=17"
                      );
                    }}
                    placeholder={titleMap[key] ? titleMap[key] : key}
                  >
                    {option}
                  </Select>
                </Form.Item>
              ) : typeof data[key] === "string" ||
                typeof data[key] === "number" ? (
                <Form.Item
                  key={key}
                  name={key}
                  label={titleMap[key] ? titleMap[key] : key}
                >
                  <Input
                    key={uuid()}
                    placeholder={data[key].toString()}
                  ></Input>
                </Form.Item>
              ) : typeof data[key] === "boolean" ? (
                <Form.Item
                  key={key}
                  name={key}
                  label={titleMap[key] ? titleMap[key] : key}
                >
                  <Checkbox
                    key={uuid()}
                    onChange={(e) => {
                      setData({ ...data, [key]: e.target.checked });
                    }}
                    checked={data[key]}
                  ></Checkbox>
                </Form.Item>
              ) : (
                false
              )}
            </>
          ))} */
}
