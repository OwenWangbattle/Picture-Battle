"use client";
import React, { useEffect, useRef, useState } from "react";
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
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const tdRef = useRef<HTMLTableCellElement>(null);
  const keymapper = new keyMapper();
  const handleClick = () => {
    setIsSelected(!isSelected);
  };
  const handlekeydown = (e: KeyboardEvent) => {
    const key = e.code;
    if (props.type === "jumpKey") {
      window.localStorage.setItem("jumpKey", key);
      keymapper.remap({ jumpKey: key });
    }
    if (props.type === "moveLeftKey") {
      window.localStorage.setItem("moveLeftKey", key);
      keymapper.remap({ moveLeftKey: key });
    }
    if (props.type === "moveRightKey") {
      window.localStorage.setItem("moveRightKey", key);
      keymapper.remap({ moveRightKey: key });
    }
    if (props.type === "attackKey") {
      window.localStorage.setItem("attackKey", key);
      keymapper.remap({ attackKey: key });
    }
    setStorageValue(key);
    setIsSelected(false);
  };

  const handleOutSideClick = (e: MouseEvent) => {
    if (tdRef.current && !tdRef.current.contains(e.target as Node)) {
      setIsSelected(false);
    }
  };
  useEffect(() => {
    let key = "";
    if (props.type === "jumpKey") {
      key = window.localStorage.getItem("jumpKey") || "Space";
    }
    if (props.type === "moveLeftKey") {
      key = window.localStorage.getItem("moveLeftKey") || "ArrowLeft";
    }
    if (props.type === "moveRightKey") {
      key = window.localStorage.getItem("moveRightKey") || "ArrowRight";
    }
    if (props.type === "attackKey") {
      key = window.localStorage.getItem("attackKey") || "KeyF";
    }
    setStorageValue(key);
  }, [props.type]);

  useEffect(() => {
    const tdElement = tdRef.current;
    if (isSelected) {
      window.addEventListener("keydown", handlekeydown);
      window.addEventListener("mousedown", handleOutSideClick);
    }
    return () => {
      window.removeEventListener("keydown", handlekeydown);
      window.removeEventListener("mousedown", handleOutSideClick);
    };
  }, [isSelected]);
  return (
    <td
      ref={tdRef}
      className={`${styles.changeButton} ${isSelected ? styles.selected : ""}`}
      onClick={handleClick}
    >
      {storageValue}
    </td>
  );
};

export default dynamic(() => Promise.resolve(changeButton), { ssr: false });
