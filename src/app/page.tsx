import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Picture Battle</h1>
      <div>
        <Link href="./wstest">
          <button className={styles.play}>Play</button>
        </Link>
      </div>
    </main>
  );
}
