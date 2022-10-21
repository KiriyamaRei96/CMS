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
  const [collums, setCollums] = useState<any>([]);
  const [info, setInfo] = useState<any>();

  const dispatch = useAppDispatch();
  const actionApi = useAppSelector(selectData).actionApi;
  const locale = useAppSelector(selectData).locale;

  useEffect(() => {
    if (snippets?.key === "SnippetGalleries") {
      setFileList(
        snippets?.data?.map((item) => ({
          name: item.name,
          status: "done",
          id: item.id,
          url: item.path,
        }))
      );
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
              <img className={clsx(style.img)} alt='' src={img.path}></img>
            ) : (
              <span>không có hình ảnh</span>
            ),
        },
      ]);
      setFileList(snippets.data);
    }
  }, [snippets?.key, snippets?.data]);

  return (
    <Form
      onFinish={(value) => {
        value["snippet_name"] = snippets?.name;
        value["page_name"] = snippets?.pageName;
        if (!value.title) {
          value.title = snippets?.title;
        }
        if (!fileList || fileList.length === 0) {
          openNotificationWithIcon(
            "error",
            "Cập nhật khối dữ thông tin không thành công",
            "Không thể bỏ trống khối dữ liệu"
          );
        }
        value.relations = fileList.map((file) => file.id);

        dispatch({
          type: "UPDATE_SNIPPETS_REQUESTED",
          payload: { data: value, actionApi, name: snippets?.pageName, locale },
        });
        setIsModalOpen(false);
        setCurrent(false);
      }}
      className={clsx(style.form)}
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
      <Form.Item
        className={clsx(style.formItem)}
        name={"title"}
        label={"Đặt tiêu đề cho khối"}
      >
        <Input
          placeholder={snippets?.title ? snippets?.title : "Tiêu đề dữ liệu"}
          type='text'
        ></Input>
      </Form.Item>

      {snippets?.key === "SnippetGalleries" ? (
        <Form.Item
          className={clsx(style.formItem)}
          label={"Lựa chọn hình ảnh cho khối"}
        >
          <Upload
            action={`${process.env.REACT_APP_CMS_API}/v1/asset/upload`}
            headers={{ Authorization: getCookie("token") }}
            listType='picture-card'
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
                          setFileList((prv) =>
                            prv.filter((item) => item.id !== record.id)
                          );
                        }}
                        title='Bạn muốn xóa thông tin này ?'
                        okText='Xóa'
                        cancelText='Hủy'
                      >
                        <Button size='small'>Xóa</Button>
                      </Popconfirm>
                    </div>
                  ),
                },
              ]}
              dataSource={fileList}
            ></Table>
          </Form.Item>
          <Form.Item
            className={clsx(style.formItem)}
            label={"Lựa chọn nhóm thông tin"}
          >
            <Table
              // rowSelection={{
              //   type: "checkbox",
              //   onChange: (selectedRowKeys: React.Key[], selectedRows) => {
              //     const idList = fileList.map((item) => item.id);

              //     if (selectedRows.length > 0) {
              //       selectedRows.forEach((item) => {
              //         if (!idList.includes(item.id)) {
              //           setFileList((prv) => [item, ...prv]);
              //         }
              //       });
              //     }
              //   },
              // }}
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
                      size='small'
                      onClick={() => {
                        const idList = fileList.map((item) => item.id);
                        if (!idList.includes(record.id)) {
                          setFileList((prv) => [record, ...prv]);
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
      <Form.Item>
        <Button htmlType='submit' type='primary'>
          Xác Nhận
        </Button>
      </Form.Item>
    </Form>
  );
};
export default SnippetsForm;
