import Heading from "@/app/_ui/Heading";
import styles from "./styles.module.css";
import Card from "../Card/Card";
import Image from "next/image";
function Blog() {
  return (
    <section className={styles.blogSection}>
      <div className="container">
        <Heading className={styles.heading}>Blog</Heading>
        <p className={styles.description}>Travel Tales & Hotel Insights</p>

        <div className={styles.blogGrid}>
          <Card>
            <Card.Thumbnail>
              <Image fill src="/bg.png" alt="" />
            </Card.Thumbnail>
            <Card.Description className={styles.blogDescriptionContainer}>
              <h2 className={styles.blogHeading}>Top 10 Must-Visit Places Near Our Hotel</h2>
              <p className={styles.blogLabel}>The Ultimate Maharashtra Guide</p>
              <p className={styles.blogDescription}>
                Explore the rich cultural heritage and natural beauty surrounding our hotel. From ancient caves to bustling markets, Maharashtra offers countless experiences. Discover hidden gems within a 50km radius including scenic hill stations, historic forts, and authentic local cuisine spots that will make your stay truly memorable.
              </p>
            </Card.Description>
          </Card>
          <Card>
            <Card.Thumbnail>
              <Image fill src="/bg.png" alt="" />
            </Card.Thumbnail>
            <Card.Description className={styles.blogDescriptionContainer}>
              <h2 className={styles.blogHeading}>5 Reasons to Choose Paradise Resort for Your Next Vacation</h2>
              <p className={styles.blogLabel}>Why Guests Keep Coming Back</p>
              <p className={styles.blogDescription}>
                What makes our hotel stand out? From our award-winning restaurant serving authentic Maharashtrian cuisine to our infinity pool overlooking the valley, we've curated experiences that go beyond ordinary hospitality. Learn about our sustainability initiatives, personalized concierge services, and exclusive packages designed for every type of traveler.
              </p>
            </Card.Description>
          </Card>

          <Card>
            <Card.Thumbnail>
              <Image fill src="/bg.png" alt="" />
            </Card.Thumbnail>
            <Card.Description className={styles.blogDescriptionContainer}>
              <h2 className={styles.blogHeading}>Wellness & Relaxation: A Guide to Our Spa Services</h2>
              <p className={styles.blogLabel}>Rejuvenate Your Mind, Body & Soul</p>
              <p className={styles.blogDescription}>
                Experience tranquility at our full-service spa. From traditional Ayurvedic massages to modern wellness therapies, our certified therapists use premium organic products to help you unwind. Discover our signature treatments, couples packages, and wellness programs designed to restore your inner balance during your stay.
              </p>
            </Card.Description>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default Blog;
