import Stripe from "stripe";
import { getGuestReservations, createNewReservation } from "../_lib/supabase/reservations";
import { getRoomById } from "../_lib/supabase/rooms";
import { notFound, redirect } from "next/navigation";
import SuccessPage from "./_components/SuccessPage/SuccessPage";
import ExpirePage from "./_components/ExpirePage/ExpirePage";
import { auth } from "@/auth";
import { daysDifferCount } from "../utils/datetime";
import { bookingTotalPrice } from "../utils/reservationsCalcs";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const metadata = {
  title: "Booking Overview",
    icons: {
    icon: "/final-logo.png",
  },
};

export default async function PreviewPage({ searchParams }) {
  const session_id = searchParams?.session_id;

  if (!session_id)
    return (
      <div className="container">
        {" "}
        <h1>Forbidden</h1>
      </div>
    );

  const session = await auth();

  if (!session?.user) redirect("/signin");

  const strip_session = await stripe.checkout.sessions.retrieve(session_id);

  if (!strip_session?.metadata?.guest_id || !strip_session?.metadata?.room_id) {
    return (
      <div className="container" style={{ padding: "2rem" }}>
        <h1>Error: Missing Metadata</h1>
        <p>Stripe session is missing required metadata.</p>
        <pre>{JSON.stringify({ metadata: strip_session?.metadata, status: strip_session?.status, payment_status: strip_session?.payment_status }, null, 2)}</pre>
      </div>
    );
  }

  if (strip_session.metadata.guest_id !== session.user.id) {
    return (
      <div className="container" style={{ padding: "2rem" }}>
        <h1>Error: Unauthorized</h1>
        <p>Guest ID mismatch. Session guest: {strip_session.metadata.guest_id}, Current user: {session.user.id}</p>
      </div>
    );
  }

  let guestReservations = await getGuestReservations(session.user.id);

  let reservation = guestReservations?.find(
    (res) =>
      res.room_id === strip_session.metadata.room_id &&
      res.start_date === strip_session.metadata.start_date &&
      res.end_date === strip_session.metadata.end_date &&
      res.status === "confirmed"
  );

  if (!reservation?.id && strip_session.status === "complete" && strip_session.payment_status === "paid") {
    const room = await getRoomById(strip_session.metadata.room_id);
    const totalNights = daysDifferCount(
      strip_session.metadata.end_date,
      strip_session.metadata.start_date
    );
    const totalUSDPrice = bookingTotalPrice(
      room.price,
      parseInt(strip_session.metadata.guests_count),
      totalNights
    );

    const new_res = await createNewReservation({
      room_id: room.id,
      guest_id: session.user.id,
      guests_count: parseInt(strip_session.metadata.guests_count),
      message: strip_session.metadata.message || "",
      reserved_price: totalUSDPrice,
      start_date: strip_session.metadata.start_date,
      end_date: strip_session.metadata.end_date,
      status: "confirmed",
    });

    if (new_res?.[0]?.id) {
      reservation = {
        ...new_res[0],
        rooms: {
          thumbnail: room.thumbnail,
          name: room.name,
          capacity: room.capacity,
        },
      };
    }
  }

  if (!reservation?.id) {
    return (
      <div className="container" style={{ padding: "2rem" }}>
        <h1>Error: Reservation Not Found</h1>
        <p>Could not find or create reservation for this payment.</p>
        <h3>Debug Information:</h3>
        <pre>{JSON.stringify({
          stripe_session_status: strip_session.status,
          payment_status: strip_session.payment_status,
          metadata: strip_session.metadata,
          user_id: session.user.id,
          total_user_reservations: guestReservations?.length || 0,
          user_reservations: guestReservations?.map(r => ({
            id: r.id,
            room_id: r.room_id,
            start_date: r.start_date,
            end_date: r.end_date,
            status: r.status
          }))
        }, null, 2)}</pre>
      </div>
    );
  }

  if (
    strip_session.status === "expired" ||
    new Date() > new Date(strip_session.expires_at * 1000)
  )
    return <ExpirePage />;

  if (
    strip_session.status === "complete" &&
    strip_session.payment_status === "paid"
  ) {
    return <SuccessPage reservation={reservation} />;
  }

  if (
    strip_session.status === "open" &&
    strip_session.payment_status === "unpaid"
  ) {
    redirect("/reservations/checkout");
  }

  return <ExpirePage />;
}
