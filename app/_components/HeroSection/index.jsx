"use client";
import BookingForm from "../BookingForm";
import styles from "./index.module.css";
import BookingButton from "../BookingButton";
import Modal from "@/app/_components/Modal/Modal";

function HeroSection({ bookingSearchAction }) {
  return (
    <div className={styles.heroSection}>
      <video autoPlay muted loop playsInline className={styles.backgroundVideo}>
        <source src="/four.mp4" type="video/mp4" />
      </video>
      
      <div className={`container ${styles.wrapper}`}>
        <div className="bookingFormContainer">
          <BookingForm bookingSearchAction={bookingSearchAction} />
        </div>
        <div className={styles.heroTitle}>
          <p>Experience Luxury and Comfort in the Heart of India</p>
          <p>Book Now, Pay On Arrival</p>
          <div className={styles.heroCTA}>
            <Modal>
              <Modal.ToggleOpen>
                <BookingButton />
              </Modal.ToggleOpen>
              <Modal.Overlay>
                <Modal.Wrapper>
                  <BookingForm bookingSearchAction={bookingSearchAction}>
                    <div>
                      <Modal.ToggleClose>
                        <button type="button" className={styles.closeButton}>
                          Cancel
                        </button>
                      </Modal.ToggleClose>
                    </div>
                  </BookingForm>
                </Modal.Wrapper>
              </Modal.Overlay>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;