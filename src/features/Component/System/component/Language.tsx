import { Select } from "antd";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { callApi } from "../../../../Api/Axios";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { selectData } from "../../../../store/store";
import clsx from "clsx";
import style from "../style.module.scss";
export interface LanguageProps {}

const Language = (props: LanguageProps) => {
  const [languages, setLanguages] = useState<any>();
  const localeArr = useAppSelector(selectData).localeArr;
  const dispatch = useAppDispatch();
  useEffect(() => {
    const cookie = Cookies.get("token");
    (async () => {
      const result: any = await callApi
        .get("/v1/languages/get", { headers: { Authorization: cookie } })
        .then((response) => response.data)
        .catch((err) => console.log(err));

      if (result.status === 1) {
        const option = Object.keys(result.data).map((key) => (
          <Select.Option key={key} value={key}>
            <>
              <img
                className={clsx(style.icon)}
                src={result.data[key]?.icon}
                alt=""
              />
              <span>{result.data[key]?.title}</span>
            </>
          </Select.Option>
        ));

        setLanguages(option);
      }
    })();
  }, []);
  return (
    <div>
      <h6>Chọn ngôn ngữ sử dụng trong bài viết </h6>
      <Select
        onChange={(value) =>
          dispatch({
            type: "SET_LOCALE_REQUESTED",
            payload: value,
          })
        }
        className={clsx(style.select)}
        size="large"
        mode="multiple"
        value={Object.keys(localeArr).map((key) => key)}
      >
        {languages}
      </Select>
    </div>
  );
};
export default Language;
