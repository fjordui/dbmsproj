"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import styles from "./styles.module.css";
import { browserClient } from "@/app/_lib/supabase/browserClient";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Loader from "@/app/_ui/Loader";

function FormDayPicker({ handleDateSelection, start, end }) {
  const [disableddDays, setDisabledDays] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { room_slug, id } = useParams();
  const calendarRangeRef = useRef({ start: new Date(2024, 0), end: new Date(2027, 11) });

  useEffect(() => {
    if (!room_slug && !id) return;
    async function getBusyDays() {
      setIsLoading(true);
      let reservations = [];
      let busy_days = [];

      try {
        if (id) {
          const { data: reservation_target } = await browserClient
            .from("reservations")
            .select("*, rooms(thumbnail, name, capacity, price)")
            .eq("id", id)
            .single();

          const { data: roomReservations } = await browserClient
            .from("reservations")
            .select("*")
            .eq("room_id", reservation_target.room_id);

          reservations = roomReservations || [];
          busy_days = reservations.filter((item) =>
            id != item.id ? { before: item.end_date, after: item.start_date } : false
          );
        } else {
          const { data: roomReservations } = await browserClient
            .from("reservations")
            .select("*")
            .eq("room_id", room_slug);

          reservations = roomReservations || [];
          busy_days = reservations?.map((item) => ({ before: item.end_date, after: item.start_date })) ?? [];
        }

        setDisabledDays(busy_days);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      } finally {
        setIsLoading(false);
      }
    }

    getBusyDays();
  }, [room_slug, id]);

  if (isLoading)
    return (
      <div className={"section-loader"}>
        <Loader />
      </div>
    );

  return (
    <div className={styles.datepicker}>
      <div>
        <DayPicker
          captionLayout="dropdown"
          min={0}
          onSelect={(range) => handleDateSelection(range)}
          mode="range"
          selected={start && end ? { from: start, to: end } : null}
          startMonth={calendarRangeRef.current.start}
          endMonth={calendarRangeRef.current.end}
          weekStartsOn={1}
          numberOfMonths={2}
          disabled={[{ before: new Date() }, ...disableddDays]}
          footer={
            <p>
              <span className={styles.footerIcon}>
                <FontAwesomeIcon icon={faInfoCircle} />
              </span>
              <span>Please Pick a Range</span>
            </p>
          }
          classNames={{
            today: styles.datepickerToday,
            selected: styles.datepickerSelected,
            range_start: styles.datepickerRangeControlStart,
            range_end: styles.datepickerRangeControlEnd,
            range_middle: styles.datepickerRangeMiddle,
            chevron: styles.chevron,
            footer: styles.datepickerFooter,
          }}
        />
      </div>
    </div>
  );
}

export default FormDayPicker;
