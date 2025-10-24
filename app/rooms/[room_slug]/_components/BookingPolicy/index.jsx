import Accordion from "@/app/_components/Accordion";
import Heading from "@/app/_ui/Heading";

import styles from "./styles.module.css";

function BookingPolicy() {
  return (
    <section className={styles.BookingPolicySection}>
      <Heading className="text-center">Booking Policy</Heading>

      <hr className="decriptionDivider" />

      <div className={styles.accordion}>
        <Accordion className={styles.accordionItem} label={"Check-in & Check-out"}>
          <p>
          <ul>
            <li><strong>Check-in Time:</strong> 2:00 PM</li> 
            <li><strong>Check-out Time:</strong> 11:00 AM</li> 
            <li>Early check-in and late check-out available upon request (subject to availability and additional charges)</li>
          </ul>
          </p>
        </Accordion>
        <Accordion className={styles.accordionItem} label={"Cancellation Policy"}>
          <p>
            <ul>
  <li><strong>Free cancellation</strong> up to 48 hours before arrival</li>
  <li>Cancellations within 48 hours: 50% charge</li>
  <li>No-shows: Full amount charged</li>
  <li>Refunds processed within 7-10 business days</li>
</ul>
          </p>
        </Accordion>
        <Accordion className={styles.accordionItem} label={"Payment Policy"}>
          <p>
            <ul>
  <li>Full payment required at the time of booking</li>
  <li>We accept all major credit cards, debit cards, and UPI payments</li>
  <li>Prices are in INR and include all applicable taxes</li>
  <li>Additional charges for extra guests, early check-in/late check-out</li>
</ul>
          </p>
        </Accordion>
      </div>
    </section>
  );
}

export default BookingPolicy;
