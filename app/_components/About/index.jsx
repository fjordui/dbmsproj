import Heading from "@/app/_ui/Heading";
import styles from "./styles.module.css";
import Image from "next/image";

function About() {
  return (
    <section className={styles.aboutSection}>
      <div className={`container ${styles.aboutContainer}`}>
        <div className={styles.description}>
          <Heading>About Us</Heading>
        <p>Welcome to Paradise Resort & Spa, where traditional Indian hospitality meets modern luxury. Nestled in the scenic landscapes of Maharashtra, our hotel offers a perfect blend of comfort, elegance, and exceptional service. With over 15 years of experience in hospitality, we pride ourselves on creating unforgettable experiences for our guests.</p>
<p>Whether you're here for business or leisure, our world-class amenities, spacious rooms, and dedicated staff ensure your stay is nothing short of extraordinary. From our rooftop restaurant offering panoramic views to our rejuvenating spa services, every detail is designed with your comfort in mind.</p>
        </div>
        <div className={styles.gallery}>
          <div>
            <Image fill src="/aboutus.jpg" alt="" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
