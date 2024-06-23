"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./changeButton.module.scss";
import keyMapper from "@/app/core/keyMapper";
import dynamic from "next/dynamic";

const getStorageValue = (type: string) => {
  if (type === "jumpKey") {
    return window.localStorage.getItem("jumpKey") || "Space";
  }
  if (type === "moveLeftKey") {
    return window.localStorage.getItem("moveLeftKey") || "ArrowLeft";
  }
  if (type === "moveRightKey") {
    return window.localStorage.getItem("moveRightKey") || "ArrowRight";
  }
  if (type === "attackKey") {
    return window.localStorage.getItem("attackKey") || "KeyF";
  }
  return null;
};

const changeButton = (props: { type: string }) => {
  const [storageValue, setStorageValue] = useState<string | null>(
    getStorageValue(props.type)
  );
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const tdRef = useRef<HTMLTableCellElement>(null);
  const keymapper = new keyMapper();

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
    if (isSelected) {
      window.addEventListener("keydown", handlekeydown);
      window.addEventListener("mousedown", handleOutSideClick);
    }
    return () => {
      window.removeEventListener("keydown", handlekeydown);
      window.removeEventListener("mousedown", handleOutSideClick);
    };
  }, [isSelected]);

  console.log(storageValue);

  return (
    <div
      ref={tdRef}
      className={`${styles.changeButton} ${isSelected ? styles.selected : ""}`}
      onClick={(_) => setIsSelected((value) => !value)}
    >
      {storageValue}
    </div>
  );
};

export default dynamic(() => Promise.resolve(changeButton), { ssr: false });
