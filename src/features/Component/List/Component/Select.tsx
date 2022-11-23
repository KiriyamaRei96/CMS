import { Form, Select } from "antd";
import React, { useEffect, useState } from "react";
import style from "../style.module.scss";
import clsx from "clsx";
import { v4 as uuid } from "uuid";
import { callApi } from "../../../../Api/Axios";
import Cookies from "js-cookie";

export interface SelectCategoryProps {
  Url: string;
  name: string;
  label: string;
  locale: string;
  mode: "multiple" | "tags" | undefined;
}

const SelectCategory = ({
  Url,
  name,
  label,
  locale,
  mode,
}: SelectCategoryProps) => {
  const [typeOption, setTypeOption] = useState<any>();
  useEffect(() => {
    getSelectList(Url);
  }, [locale]);
  const getSelectList = async (getApi) => {
    try {
      const cookie = Cookies.get("token");
      const result = await callApi
        .get(getApi, {
          headers: { Authorization: cookie },
        })
        .then((response) => response.data)
        .catch((err) => console.log(err));

      const option = result.data.map((obj) => {
        if (obj?.title !== undefined || obj?.name !== undefined) {
          return (
            <Select.Option
              disabled={obj.published !== undefined ? !obj.published : false}
              key={uuid()}
              value={obj.id}
            >
              {obj?.title
                ? obj?.title
                : obj?.name
                ? obj?.name
                : "Chưa có tiêu đề"}
            </Select.Option>
          );
        }
      });

      setTypeOption(option);
    } catch (err) {}
  };

  return (
    <Form.Item
      className={clsx(style.formDes)}
      key={uuid()}
      name={name}
      label={label}
    >
      <Select disabled={!typeOption} allowClear placeholder={label} mode={mode}>
        {typeOption}
      </Select>
    </Form.Item>
  );
};
export default SelectCategory;
