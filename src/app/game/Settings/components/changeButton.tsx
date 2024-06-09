"use client";
import React, { useEffect, useState } from "react";
import styles from "./changeButton.module.scss";
import keyMapper from "@/app/core/keyMapper";
import dynamic from "next/dynamic";
interface Props {
  type: string;
}
const setStorageValue = (type: string) => {
  const ls = window.localStorage;
  type = ls.getItem(type) || type;
};
const changeButton = (props: Props) => {
  const [storageValue, setStorageValue] = useState<string | null>("");
  const handleClick = () => {
    console.log(props.type);
  };
  useEffect(() => {
    setStorageValue(props.type);
  }, [props.type]);
  return (
    <td className={styles.changeButton} onClick={handleClick}>
      {storageValue}
    </td>
  );
};

export default dynamic(() => Promise.resolve(changeButton), { ssr: false });
