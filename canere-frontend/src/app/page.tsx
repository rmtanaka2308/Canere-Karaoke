import Logo from "@/components/Logo";
import styles from "@/app/page.module.css"
import MenuButton from "@/components/MenuButton/MenuButton";

export default function Home() {
  return (
    <main className={styles.background}>
      <div className={styles.logoContainer}>
        <Logo />
      </div>

      <MenuButton content="Start!" path="/start" />
      {/* <MenuButton content='Library' path='/' /> */}
    </main>
  );
}
