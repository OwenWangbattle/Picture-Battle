import React from "react";
import styles from "./page.module.scss";
import Link from "next/link";
import ChangeButton from "./components/changeButton";

const Settings = () => {
  return (
    <div className={styles.container}>
      <table className={styles.styledTable}>
        <thead>
          <tr>
            <th>Keyboard Settings</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Move Left</td>
            <ChangeButton type="moveLeftKey" />
          </tr>
          <tr>
            <td>Move Right</td>
            <ChangeButton type="moveRightKey" />
          </tr>
          <tr>
            <td>Jump</td>
            <ChangeButton type="jumpKey" />
          </tr>
          <tr>
            <td>Attack</td>
            <ChangeButton type="attackKey" />
          </tr>
        </tbody>
      </table>
      <div className={styles.return}>
        <Link href="../game">
          <button>return</button>
        </Link>
      </div>
    </div>
  );
};

export default Settings;
