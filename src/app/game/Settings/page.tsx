import React from "react";
import styles from "./page.module.scss";
import Link from "next/link";
import ChangeButton from "./components/changeButton";

const Settings = () => {
    return (
        <div className={styles.container}>
            <div className={styles.styledTable}>
                <header>
                    <div>Keyboard Settings</div>
                </header>
                <div>
                    <div>
                        <span>Move Left</span>
                        <ChangeButton type="moveLeftKey" />
                    </div>
                    <div>
                        <span>Move Right</span>
                        <ChangeButton type="moveRightKey" />
                    </div>
                    <div>
                        <span>Jump</span>
                        <ChangeButton type="jumpKey" />
                    </div>
                    <div>
                        <span>Attack</span>
                        <ChangeButton type="attackKey" />
                    </div>
                </div>
            </div>
            <Link href="../game">
                <div className={styles.return}>
                    <p>return</p>
                </div>
            </Link>
        </div>
    );
};

export default Settings;
