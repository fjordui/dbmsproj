import supabase, { supabaseWithToken } from "./db";

import { riskySupabaseClient } from "./supabaseRiskyClient";

export async function getGuestById(id) {
  const { data: guest, error } = await riskySupabaseClient
    .from("guests")
    .select("id, email, fullname, avatar, phone, nationality, countryFlag, nationalID, created_at")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching guest by ID:", error);
    return null;
  }

  return guest;
}

export async function getGuestByEmail(email) {
  const { data: guest, error } = await riskySupabaseClient
    .from("guests")
    .select("id, email, fullname, avatar, phone, nationality, countryFlag, nationalID, created_at")
    .eq("email", email)
    .single();

  if (error) {
    console.error("Error fetching guest by email:", error);
    return null;
  }

  return guest;
}

export async function getFullGuestByEmail(email) {
  // THIS REQUEST WILL GET THE USER INCLUDING THE PASSWORD FOR SIGN IN PUROSES
  let { data: guests, error } = await riskySupabaseClient
    .from("guests")
    .select("*")
    .eq("email", email)
    .single();

  // await new Promise((resolve) => setTimeout(resolve, 2000));

  return guests;
}

export async function updateGuest(
  supabaseAccessToken,
  id,
  name,
  nationality,
  countryFlag,
  phone,
  email,
  nationalID
) {
  const { data, error } = await supabaseWithToken(supabaseAccessToken)
    .from("guests")
    .update({
      fullname: name,
      nationality,
      phone,
      email,
      countryFlag,
      nationalID,
    })
    .eq("id", id)
    .select();

  console.log({ data });

  // await new Promise((resolve) => setTimeout(resolve, 2000));

  if (error) {
    console.log("supa error");
    console.log(error);
  }

  return data;
}

export async function updateGuestWithPwd(
  supabaseAccessToken,
  id,
  name,
  nationality,
  countryFlag,
  phone,
  email,
  password
) {
  const { data, error } = await supabaseWithToken(supabaseAccessToken)
    .from("guests")
    .update({
      fullname: name,
      nationality,
      phone,
      email,
      countryFlag,
      password,
    })
    .eq("id", id)
    .select();

  // await new Promise((resolve) => setTimeout(resolve, 2000));

  if (error) {
    console.log("supa error");
    console.log(error);
  }

  return data;
}

export async function createGuest(
  fullname,
  email,
  avatar = "",
  password = "",
  phone = "",
  nationality = "",
  countryFlag = "",
  nationalID = ""
) {
  const { data, error } = await riskySupabaseClient
    .from("guests")
    .insert([
      {
        fullname,
        email,
        phone,
        avatar,
        nationality,
        countryFlag,
        nationalID,
        password,
      },
    ])
    .select();

  if (error) {
    console.log("ERROR SUPABASE");
    console.log(error);
  }

  return data;
}
