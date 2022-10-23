import { Select } from "antd";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { callApi } from "../../../../../Api/Axios";
import { v4 as uuid } from "uuid";

const { Option, OptGroup } = Select;
export interface PermissionsProps {
  id: object;
}

const Permissions = ({ id }: PermissionsProps) => {
  const [option, setOption] = useState<any>();
  const [permission, setPermission] = useState<any>();
  const cookie = Cookies.get("token");

  useEffect(() => {
    (async () => {
      if (!option) {
        const permissionsArr = await callApi
          .get(`v1/system/permission/gets`, {
            headers: { Authorization: cookie },
          })
          .then((res) => res.data)
          .catch((err) => console.error(err));

        setOption(
          Object.keys(permissionsArr).map((key) => (
            <OptGroup key={uuid()} label={key}>
              {permissionsArr[key].map((value) => (
                <Option key={uuid()} value={value}>
                  {value}
                </Option>
              ))}
            </OptGroup>
          ))
        );
      }

      const currentPermis = await callApi
        .get(
          `v1/system/permission/get?${Object.keys(id)[0]}=${
            Object.values(id)[0]
          }`,
          {
            headers: { Authorization: cookie },
          }
        )
        .then((res) => res.data)
        .catch((err) => console.error(err));
      if (currentPermis.status === 1) {
        setPermission(Object.keys(currentPermis.data));
      }
    })();
  }, [id]);

  return (
    <div>
      <Select
        onChange={async (value) => {
          const permissionData = {};

          value.forEach((item) => {
            permissionData[`permissions[${item}]`] = true;
          });
          if (Object.keys(permissionData).length === 0) {
            permissionData["permission[null]"] = null;
          }
          const changepermis = await callApi
            .put(
              `v1/system/permission/update`,
              { ...id, ...permissionData },
              { headers: { Authorization: cookie } }
            )
            .then((res) => res.data)
            .catch((err) => console.error(err));
          if (changepermis.status === 1) {
            setPermission(value);
          }
        }}
        value={permission}
        mode="multiple"
      >
        {option}
      </Select>
    </div>
  );
};
export default Permissions;
