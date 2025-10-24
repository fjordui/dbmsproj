import Heading from "@/app/_ui/Heading";
import styles from "./styles.module.css";

function RoomDescription({ room }) {
  console.log("Room description prop:", room);
  return (
    <div className={styles.description}>
      <Heading className="text-center">Room Description</Heading>

      <hr className="decriptionDivider" />

      <div className={styles.descriptionContent}>
        <p>{room?.description || "No description available"}</p>
      </div>
    </div>
  );
}

export default RoomDescription;