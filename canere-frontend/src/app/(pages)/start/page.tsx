import styles from "@/app/(pages)/start/page.module.css"
import BackButton from "@/components/BackButton/BackButton";
import MenuButton from "@/components/MenuButton/MenuButton";
export default function Home() {
  return (
    <main className={styles.background}>
      <div className={styles.topLeft}>
        <BackButton />
      </div>

      <MenuButton content="Play Song!" path="/" />
      <MenuButton content="Add New Song!" path="/new-song" />
      <MenuButton content="Library!" path="/library" />
    </main>
  );
}
