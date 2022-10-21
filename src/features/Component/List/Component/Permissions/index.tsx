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
  useEffect(() => {
    const cookie = Cookies.get("token");

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
      console.log(currentPermis);
    })();
  }, [id]);
  return (
    <div>
      <Select mode='multiple'>{option}</Select>
    </div>
  );
};
export default Permissions;
