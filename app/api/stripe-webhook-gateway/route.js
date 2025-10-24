import { getGuestById } from "@/app/_lib/supabase/guests";
import { createNewReservation } from "@/app/_lib/supabase/reservations";
import { getRoomById } from "@/app/_lib/supabase/rooms";
import { daysDifferCount } from "@/app/utils/datetime";
import { bookingTotalPrice } from "@/app/utils/reservationsCalcs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  const requestBody = await req.json();
  const metadata = requestBody.data?.object?.metadata;

  if (!metadata || !metadata.guest_id || !metadata.room_id)
    return NextResponse.json(
      { status: "error", message: "missing required data" },
      { status: 400 }
    );

  const pending_reservation = {
    room_id: metadata.room_id,
    start_date: metadata.start_date,
    end_date: metadata.end_date,
    guests_count: parseInt(metadata.guests_count),
    message: metadata.message || "",
  };

  const [guest, room] = await Promise.all([
    getGuestById(metadata.guest_id),
    getRoomById(pending_reservation.room_id),
  ]);

  if (!guest?.fullname || !room?.name) {
    console.log("missing guest || room");
    return NextResponse.json(
      { status: "error", message: "forbidden" },
      { status: 403 }
    );
  }

  switch (requestBody.type) {
    case "checkout.session.completed":
      const totalNights = daysDifferCount(
        pending_reservation.end_date,
        pending_reservation.start_date
      );
      const totalUSDPrice = bookingTotalPrice(
        room.price,
        pending_reservation.guests_count,
        totalNights
      );

      const new_res = await createNewReservation({
        room_id: room.id,
        guest_id: guest.id,
        guest_fullname: guest.fullname,
        guests_count: pending_reservation.guests_count,
        message: pending_reservation.message,
        reserved_price: totalUSDPrice,
        start_date: pending_reservation.start_date,
        end_date: pending_reservation.end_date,
        status: "confirmed",
      });

      return NextResponse.json(
        { received: true, status: 200 },
        { status: 200 }
      );
    case "payment_intent.payment_failed":
      console.log("FAILED");
      break;
    default:
      console.log("UNMATCHED");
      break;
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
