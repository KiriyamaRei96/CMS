import { Checkbox, Select, Table, Tag } from "antd";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { callApi } from "../../../../../Api/Axios";
import { v4 as uuid } from "uuid";
import permitMap from "./permitMap";
import { ColumnsType } from "antd/lib/table";
import openNotificationWithIcon from "../../../../function/toast";

const { Option, OptGroup } = Select;
export interface PermissionsProps {
  id: object;
  permissionRole?: any;
}
const functionMap = {
  "page.create": "Thêm trang",
  "page.select": "Tra cứu trang",
  "page.update": "Sửa trang",
  "page.delete": "Xóa trang",
  ".create": "Thêm",
  ".select": "Tra cứu",
  ".update": "Sửa",
  ".delete": "Xóa",
  ".change": "Thay đổi",
  ".published": "Phát hành",
  ".upload": "Tải lên",
  ".active": "thay đổi trạng thái tài khoản",
};
const Permissions = ({ id, permissionRole }: PermissionsProps) => {
  const [option, setOption] = useState<any>();
  const [permission, setPermission] = useState<any>([]);
  const cookie = Cookies.get("token");
  const collums: ColumnsType<any> = [
    {
      title: "Quyền truy cập",
      dataIndex: "tilte",
      key: "tilte",
      render: (text) => <span>{permitMap[text] ? permitMap[text] : text}</span>,
    },
    {
      title: "Xem",
      dataIndex: "select",
      key: "select",
      align: "center",
      render: (_, record) =>
        record["select"] ? (
          <Checkbox
            disabled={permissionRole ? permissionRole[record["select"]] : false}
            checked={
              permissionRole
                ? permissionRole[record["select"]]
                : false || permission?.includes(record["select"])
            }
            onClick={(e) => changeHanlder(e, record["select"])}
          />
        ) : (
          <Checkbox disabled />
        ),
    },
    {
      title: "Thêm",
      dataIndex: "create",
      key: "create",
      align: "center",
      render: (_, record) =>
        record["create"] ? (
          <Checkbox
            disabled={permissionRole ? permissionRole[record["create"]] : false}
            checked={
              permissionRole
                ? permissionRole[record["create"]]
                : false || permission?.includes(record["create"])
            }
            onClick={(e) => changeHanlder(e, record["create"])}
          />
        ) : (
          <Checkbox disabled />
        ),
    },
    {
      title: "Sửa",
      dataIndex: "update",
      key: "update",
      align: "center",
      render: (_, record) =>
        record["update"] ? (
          <Checkbox
            disabled={permissionRole ? permissionRole[record["update"]] : false}
            checked={
              permissionRole
                ? permissionRole[record["update"]]
                : false || permission?.includes(record["update"])
            }
            onClick={(e) => changeHanlder(e, record["update"])}
          />
        ) : (
          <Checkbox disabled />
        ),
    },
    {
      title: "Xóa",
      dataIndex: "delete",
      key: "delete",
      align: "center",
      render: (_, record) =>
        record["delete"] ? (
          <Checkbox
            disabled={permissionRole ? permissionRole[record["delete"]] : false}
            checked={
              permissionRole
                ? permissionRole[record["delete"]]
                : false || permission?.includes(record["delete"])
            }
            onClick={(e) => changeHanlder(e, record["delete"])}
          />
        ) : (
          <Checkbox disabled />
        ),
    },
    {
      title: "Phát hành",
      dataIndex: "published",
      key: "published",
      align: "center",
      render: (_, record) =>
        record["published"] ? (
          <Checkbox
            disabled={
              permissionRole ? permissionRole[record["published"]] : false
            }
            checked={
              permissionRole
                ? permissionRole[record["published"]]
                : false || permission?.includes(record["published"])
            }
            onClick={(e) => changeHanlder(e, record["published"])}
          />
        ) : (
          <Checkbox disabled />
        ),
    },
    {
      title: "Khóa",
      dataIndex: "locked",
      key: "locked",
      align: "center",
      render: (_, record) =>
        record["locked"] ? (
          <Checkbox
            disabled={permissionRole ? permissionRole[record["locked"]] : false}
            checked={
              permissionRole
                ? permissionRole[record["locked"]]
                : false || permission?.includes(record["locked"])
            }
            onClick={(e) => changeHanlder(e, record["locked"])}
          />
        ) : (
          <Checkbox disabled />
        ),
    },

    {
      title: "Kích hoạt",
      dataIndex: "active",
      key: "active",
      align: "center",
      render: (_, record) =>
        record["active"] ? (
          <Checkbox
            disabled={permissionRole ? permissionRole[record["active"]] : false}
            checked={
              permissionRole
                ? permissionRole[record["active"]]
                : false || permission?.includes(record["active"])
            }
            onClick={(e) => changeHanlder(e, record["active"])}
          />
        ) : (
          <Checkbox disabled />
        ),
    },
    {
      title: "Thay đổi",
      dataIndex: "change",
      key: "change",
      align: "center",
      render: (_, record) =>
        record["change"] ? (
          <Checkbox
            disabled={permissionRole ? permissionRole[record["change"]] : false}
            checked={
              permissionRole
                ? permissionRole[record["change"]]
                : false || permission?.includes(record["change"])
            }
            onClick={(e) => changeHanlder(e, record["change"])}
          />
        ) : (
          <Checkbox disabled />
        ),
    },
    {
      title: "Tải lên",
      dataIndex: "upload",
      key: "upload",
      align: "center",
      render: (_, record) => {
        return record["upload"] ? (
          <Checkbox
            disabled={permissionRole ? permissionRole[record["upload"]] : false}
            checked={
              permissionRole
                ? permissionRole[record["upload"]]
                : false || permission?.includes(record["upload"])
            }
            onClick={(e) => changeHanlder(e, record["upload"])}
          />
        ) : (
          <Checkbox disabled />
        );
      },
    },
  ];
  useEffect(() => {
    (async () => {
      if (!option) {
        const permissionsArr = await callApi
          .get(`v1/city/permission/gets`, {
            headers: { Authorization: cookie },
          })
          .then((res) => res.data)
          .catch((err) => console.error(err));

        setOption(
          Object.keys(permissionsArr).map((key) => {
            const outPut = {};
            outPut["tilte"] = key;

            permissionsArr[key].forEach((item) => {
              outPut["key"] = uuid();
              if (item.includes("select")) {
                outPut["select"] = item;
              }
              if (item.includes("create")) {
                outPut["create"] = item;
              }
              if (item.includes("update")) {
                outPut["update"] = item;
              }
              if (item.includes("published")) {
                outPut["published"] = item;
              }
              if (item.includes("locked")) {
                outPut["locked"] = item;
              }
              if (item.includes("delete")) {
                outPut["delete"] = item;
              }
              if (item.includes("active")) {
                outPut["active"] = item;
              }
              if (item.includes("change")) {
                outPut["change"] = item;
              }
              if (item.includes("upload")) {
                outPut["upload"] = item;
              }
            });
            return outPut;
          })
        );
      }

      const currentPermis = await callApi
        .get(
          `v1/city/permission/get?${Object.keys(id)[0]}=${
            Object.values(id)[0]
          }`,
          {
            headers: { Authorization: cookie },
          }
        )
        .then((res) => res.data)
        .catch((err) => console.error(err));
      if (currentPermis.status === 1) {
        if (currentPermis.data !== null) {
          setPermission(Object.keys(currentPermis.data));
        }
      }
    })();
  }, [id]);
  const changeHanlder = async (e, value) => {
    setPermission((prv) => [...prv, value]);
    if (e.target.checked) {
      const data = [...permission, value];
      const permissionData = {};
      data.forEach((item) => {
        permissionData[`permissions[${item}]`] = true;
      });
      if (Object.keys(permissionData).length === 0) {
        permissionData["permission[a]"] = true;
      }
      const changepermis = await callApi
        .put(
          `v1/city/permission/update`,
          { ...id, ...permissionData },
          { headers: { Authorization: cookie } }
        )
        .then((res) => res.data)
        .catch((err) => console.error(err));

      if (changepermis.status === 1) {
      }
      if (changepermis.status === 0) {
        openNotificationWithIcon(
          "error",
          "Bạn đã cập nhật quyền truy cập thất bại",
          ""
        );
      }
    }
    if (!e.target.checked) {
      const data = permission.filter((text) => text !== value);
      setPermission((prv) => prv.filter((text) => text !== value));
      const permissionData = {};
      data.forEach((item) => {
        permissionData[`permissions[${item}]`] = true;
      });
      if (Object.keys(permissionData).length === 0) {
        permissionData["permissions[a]"] = true;
      }

      const changepermis = await callApi
        .put(
          `v1/city/permission/update`,
          { ...id, ...permissionData },
          { headers: { Authorization: cookie } }
        )
        .then((res) => res.data)
        .catch((err) => console.error(err));

      if (changepermis.status === 1) {
      }
      if (changepermis.status === 0) {
        openNotificationWithIcon(
          "error",
          "Bạn đã cập nhật quyền truy cập thất bại",
          ""
        );
      }
    }
  };

  return (
    <div>
      <Table columns={collums} dataSource={option}></Table>
    </div>
  );
};
export default Permissions;
