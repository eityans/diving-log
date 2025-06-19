import Image from "next/image";
import styles from "./page.module.css";
import { UserInfo } from "@/app/_components/UserInfo";

export default async function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol>
          <li>
            Get started by editing <code>src/app/page.tsx</code>.
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="/auth/login"
            target="_blank"
            rel="noopener noreferrer"
          >
            ログイン/新規登録
          </a>
          <a
            href="/auth/logout"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            ログアウト
          </a>
        </div>
        <UserInfo />
      </main>
      <footer className={styles.footer}>なんか書いとけ</footer>
    </div>
  );
}
