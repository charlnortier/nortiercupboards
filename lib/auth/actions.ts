"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// ---------- Sign Out ----------

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

// ---------- Reset Password (custom token flow — bypasses Supabase SMTP) ----------

import {
  requestPasswordReset,
  resetPassword as _resetPasswordWithToken,
} from "@/lib/auth/password-reset";

export const resetPassword = requestPasswordReset;
export const resetPasswordWithToken = _resetPasswordWithToken;

// ---------- Update Profile ----------

interface UpdateProfileState {
  error?: string;
  success?: boolean;
}

export async function updateProfile(
  _prevState: UpdateProfileState | null,
  formData: FormData
): Promise<UpdateProfileState> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "You must be logged in to update your profile." };
  }

  const full_name = formData.get("full_name") as string;
  const phone = formData.get("phone") as string;

  const updates: Record<string, unknown> = {
    full_name,
    phone,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("user_profiles")
    .update(updates)
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/account");
  return { success: true };
}

// ---------- Update Password ----------

interface UpdatePasswordState {
  error?: string;
  success?: boolean;
}

export async function updatePassword(
  _prevState: UpdatePasswordState | null,
  formData: FormData
): Promise<UpdatePasswordState> {
  const new_password = formData.get("new_password") as string;

  if (!new_password) {
    return { error: "Please enter a new password." };
  }

  if (new_password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  if (!/\d/.test(new_password)) {
    return { error: "Password must contain at least 1 number." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: new_password,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
