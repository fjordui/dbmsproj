import supabase from "./db";

export async function getRoomBySlug(slug) {
  let { data: rooms, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("slug", slug);

  if (error) {
    console.log({ roomsError: error.message });
  }

  return rooms?.at(0);
}

export async function getRoomReservations(room_slug) {
  // First get the room by slug to get its ID
  const room = await getRoomBySlug(room_slug);
  
  if (!room) return []; // Return empty array if room not found
  
  let { data: reservations, error } = await supabase
    .from("reservations")
    .select("*")
    .eq("room_id", room.id)
    .eq("status", "confirmed");

  if (error) {
    console.log({ reservationsError: error.message });
    return [];
  }

  return reservations ?? []; // Always return array, never null
}

export async function getAllRooms() {
  let { data: rooms, error } = await supabase
    .from("rooms")
    .select("id, name, description, price, location, capacity, image_url, created_at, updated_at, slug, thumbnail"); // ✅ ADD slug and thumbnail

  if (error) {
    console.log({ roomsError: error.message });
  }
  console.log("getAllRooms returning:", rooms);
  return rooms;
}

export async function getRoomById(id) {
  let { data: rooms, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("id", id);

  return rooms?.at(0);
}

export async function getRoomImages(id) {
  let { data: room_images, error } = await supabase
    .from("room_images")
    .select("*")
    .eq("room_id", id);

  return room_images;
}

export async function filterRoomsByDate(
  start = "2024-09-21",
  end = "2024-09-27"
) {
  let { data: reservations, error } = await supabase
    .from("reservations")
    .select("*")
    .eq("status", "confirmed")
    .or(
      `and(start_date.gte.${start},start_date.lte.${end}),and(end_date.gte.${start},end_date.lte.${end}),and(start_date.lte.${start}, end_date.gte.${end})`
    );

  if (error) {
    console.log(error);
  }

  const reservations_ids = reservations?.map((item) => item.room_id) ?? [];

  let { data: rooms, error: rooms_error } = await supabase
    .from("rooms")
    .select("*") // This should already include slug if your table has it
    .not("id", "in", `(${reservations_ids.join(",")})`);
  console.log("Filtered rooms:", rooms); 
  return rooms;
}
