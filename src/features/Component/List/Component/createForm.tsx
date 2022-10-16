import { Button, Checkbox, Form, Input, Select, Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { selectData } from "../../../../app/store";
import { v4 as uuid } from "uuid";
import { titleMap } from "../titleMap";
import style from "../style.module.scss";
import clsx from "clsx";
import { callApi } from "../../../../Api/Axios";
import Cookies from "js-cookie";
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
  const [data, setData] = useState({});
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
    try {
      const cookie = Cookies.get("token");
      const result = await callApi
        .get(getApi, { headers: { Authorization: cookie } })
        .then((response) => response.data)
        .catch((err) => console.log(err));
      console.log(result);
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
          {Object.keys(data).map((key) => (
            <>
              {key == "id" || key == "creationDate" ? (
                <Form.Item
                  key={key}
                  label={titleMap[key] ? titleMap[key] : key}
                >
                  <span key={uuid()}>{data[key]}</span>
                </Form.Item>
              ) : key == "date" ? (
                <Form.Item key={key} name={key} label="Thời gian">
                  <Input key={uuid()} placeholder={data[key]}></Input>
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
                  ></Select>
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
                  ></Select>
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
          ))}
          <Form.Item key={uuid()}>
            <Button key={uuid()} htmlType="submit" type="primary">
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
