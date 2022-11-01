import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Popconfirm, Select, Table, Upload } from "antd";
import { v4 as uuid } from "uuid";
import clsx from "clsx";
import style from "../../style.module.scss";
import getCookie from "../../../../../Api/getCookie";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import { selectData } from "../../../../../store/store";
import openNotificationWithIcon from "../../../../function/toast";
import typeMap from "./typeMap";
import Cookies from "js-cookie";
import { callApi } from "../../../../../Api/Axios";
import { type } from "os";
import SingleArticle from "./component/SingleArticle";
import SnipAvatar from "./component/Avatar";
import ReactQuill from "react-quill";
import MultiArticle from "./component/MultiArticle";

export interface SnippetsFormProps {
  snippets: any;
  setIsModalOpen: any;
  setCurrent: any;
}
const uploadButton = (
  <div>
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>Upload</div>
  </div>
);
const SnippetsForm = ({
  snippets,
  setIsModalOpen,
  setCurrent,
}: SnippetsFormProps) => {
  const [fileList, setFileList] = useState<any>();
  const [dataList, setDataList] = useState<any>();

  const [collums, setCollums] = useState<any>([]);
  const [info, setInfo] = useState<any>();
  const parentID = useAppSelector(selectData).parentID;

  const dispatch = useAppDispatch();
  const actionApi = useAppSelector(selectData).actionApi;
  const locale = useAppSelector(selectData).locale;
  const [form] = Form.useForm();
  useEffect(() => {
    if (snippets?.key === "SnippetGalleries") {
      if (snippets?.data) {
        setFileList([
          ...snippets?.data?.map((item) => ({
            name: item.name,
            status: "done",
            id: item.id,
            url: item.path,
          })),
        ]);
      }
    }
    if (snippets?.key === "SnippetObject") {
      setCollums([
        {
          title: "Tiêu đề thông tin",
          dataIndex: "title",
          key: uuid(),
          render: (text) => <span>{text}</span>,
        },
        {
          title: "Loại thông tin",
          dataIndex: "type",
          key: uuid(),
          render: (text) => <span>{typeMap[text]}</span>,
        },
        {
          title: "Hình ảnh",
          dataIndex: "featureImage",
          key: uuid(),
          render: (img) =>
            img ? (
              <img className={clsx(style.img)} alt="" src={img.path}></img>
            ) : (
              <span>không có hình ảnh</span>
            ),
        },
      ]);

      setDataList(snippets.data);
    }
    console.log(snippets);
    form.setFieldsValue(snippets);
  }, [snippets?.key, snippets?.data]);

  return (
    <Form
      form={form}
      onFinish={(value) => {
        value["snippet_name"] = snippets?.name;
        value["page_name"] = snippets?.pageName;
        if (!value.title) {
          value.title = snippets?.title;
        }
        if (snippets?.key === "SnippetObject") {
          if (dataList) {
            value.relations = dataList.map((file) => file.id);
          }

          dispatch({
            type: "UPDATE_SNIPPETS_REQUESTED",
            payload: {
              data: value,
              actionApi,
              name: snippets?.pageName,
              locale,
            },
          });
          setIsModalOpen(false);
          setCurrent(false);
        }
        if (snippets?.key === "SnippetGalleries") {
          if (fileList) {
            value.relations = fileList.map((file) => file.id);
          }

          dispatch({
            type: "UPDATE_SNIPPETS_REQUESTED",
            payload: {
              data: value,
              actionApi,
              name: snippets?.pageName,
              locale,
            },
          });
          setIsModalOpen(false);
          setCurrent(false);
        }
        if (snippets?.key === "SnippetSingleArticle") {
          value.image = value.image?.file.response.data.id;
          dispatch({
            type: "UPDATE_SNIPPETS_REQUESTED",
            payload: {
              data: value,
              actionApi,
              name: snippets?.pageName,
              locale,
            },
          });
          setIsModalOpen(false);
          setCurrent(false);
        }
      }}
      className={clsx(style.form)}
      layout="inline"
    >
      <div className={clsx(style.snipHeader, "d-flex")}>
        <Form.Item label={"Tên khối dữ liệu"}>
          <span>{snippets?.name}</span>
        </Form.Item>
        <Form.Item label={"Tên trang"}>
          <span>{snippets?.pageName}</span>
        </Form.Item>
        {snippets?.key === "SnippetObject" ? (
          <Form.Item label={"Lựa chọn nhóm thông tin"}>
            <Select
              onChange={async (value) => {
                const res = await callApi
                  .get(
                    `v1/${value.replace(
                      "_",
                      "-"
                    )}/gets?limit=10000&page=1&locale=${locale}&search=`,
                    {
                      headers: { Authorization: Cookies.get("token") },
                    }
                  )
                  .then((response) => response.data)
                  .catch((error) => console.log(error));
                if (res.status === 1) {
                  setInfo(res.data);
                }
              }}
              placeholder={"Nhóm thông tin"}
            >
              {Object.keys(typeMap)
                .splice(0, Object.keys(typeMap).length - 1)
                .map((key) => (
                  <Select.Option value={key} key={uuid()}>
                    {typeMap[key]}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
        ) : (
          false
        )}
      </div>
      <div className={clsx(style.titleWraper, "d-flex")}>
        <Form.Item
          className={clsx(style.formDes)}
          name={"title"}
          label={"Đặt tiêu đề cho khối"}
        >
          <Input
            placeholder={snippets?.title ? snippets?.title : "Tiêu đề dữ liệu"}
            type="text"
          ></Input>
        </Form.Item>
        {snippets?.key === "SnippetGalleries" ? (
          <SnipAvatar data={snippets.image} />
        ) : (
          false
        )}
      </div>
      {snippets?.key === "SnippetMultiArticle" ? (
        <MultiArticle data={snippets.articles} />
      ) : (
        false
      )}
      {snippets?.key === "SnippetGalleries" ? (
        <Form.Item
          className={clsx(style.formItem)}
          label={"Lựa chọn hình ảnh cho khối"}
        >
          <Upload
            action={`${process.env.REACT_APP_CMS_API}/v1/asset/upload`}
            headers={{ Authorization: getCookie("token") }}
            listType="picture-card"
            fileList={fileList}
            onChange={(e) => {
              setFileList(e.fileList);

              if (e?.file?.status === "done") {
                const files = fileList.map((img) => {
                  if (img.uid === e.file.uid) {
                    img.id = e.file.response.data.id;
                    img.status = e.file.status;

                    return img;
                  } else {
                    return img;
                  }
                });
                setFileList(files);
              }
            }}
          >
            {uploadButton}
          </Upload>
        </Form.Item>
      ) : (
        false
      )}

      {snippets?.key === "SnippetObject" ? (
        <>
          <Form.Item
            className={clsx(style.formItem)}
            label={"Thông tin đã chọn"}
          >
            <Table
              pagination={{ pageSize: 5 }}
              columns={[
                ...collums,
                {
                  title: "Chức năng",
                  key: "action",
                  render: (_, record) => (
                    <div>
                      <Popconfirm
                        onConfirm={() => {
                          setDataList((prv) =>
                            prv.filter((item) => item.id !== record.id)
                          );
                        }}
                        title="Bạn muốn xóa thông tin này ?"
                        okText="Xóa"
                        cancelText="Hủy"
                      >
                        <Button size="small">Xóa</Button>
                      </Popconfirm>
                    </div>
                  ),
                },
              ]}
              dataSource={dataList}
            ></Table>
          </Form.Item>
          <Form.Item
            className={clsx(style.formItem)}
            label={"Lựa chọn nhóm thông tin"}
          >
            <Table
              pagination={{ pageSize: 5 }}
              dataSource={info?.map((item) => {
                item.key = item.id;
                return item;
              })}
              columns={[
                ...collums,
                {
                  title: "Chức năng",
                  key: "action",
                  render: (_, record) => (
                    <Button
                      size="small"
                      onClick={() => {
                        const idList = dataList.map((item) => item.id);
                        if (!idList.includes(record.id)) {
                          setDataList((prv) => [record, ...prv]);
                        }
                      }}
                    >
                      Thêm
                    </Button>
                  ),
                },
              ]}
            ></Table>
          </Form.Item>
        </>
      ) : (
        false
      )}

      {snippets?.key === "SnippetSingleArticle" ? <SingleArticle /> : false}
      <Form.Item className={clsx(style.submit)}>
        <Button htmlType="submit" type="primary">
          Xác Nhận
        </Button>
      </Form.Item>
    </Form>
  );
};
export default SnippetsForm;
