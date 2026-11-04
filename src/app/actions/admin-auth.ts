"use server";

import "reflect-metadata";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { getDatabaseConnection } from "@/lib/db/data-source";
import { User } from "@/lib/db/entities/User";
import {
  signAdminToken,
  AUTH_COOKIE_NAME,
  LAST_ACTIVITY_COOKIE_NAME,
  AUTH_TOKEN_MAX_AGE,
  getAdminSession,
} from "@/lib/auth";

export async function adminLoginAction(formData: {
  email?: string;
  password?: string;
}) {
  const email = formData.email?.trim().toLowerCase();
  const password = formData.password?.trim();

  if (!email || !password) {
    return { success: false, error: "Email and password are required." };
  }

  const defaultEmail = (process.env.ADMIN_DEFAULT_EMAIL || "admin@dangracifhomes.com").toLowerCase();
  const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || "AdminPassword2026!";
  const isDefaultCredentials = email === defaultEmail && password === defaultPassword;

  try {
    const dataSource = await getDatabaseConnection();
    const userRepo = dataSource.getRepository<User>("User");

    let user = await userRepo.findOne({
      where: { email },
    });

    // Auto-seed admin user if matching default credentials and not yet in DB
    if (!user && isDefaultCredentials) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(defaultPassword, salt);
      user = userRepo.create({
        email: defaultEmail,
        password: hashedPassword,
        name: "Dangracif Administrator",
        role: "admin",
        isActive: true,
      });
      await userRepo.save(user);
    }

    if (!user || !user.isActive) {
      return { success: false, error: "Invalid email or password." };
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return { success: false, error: "Invalid email or password." };
    }

    const token = await signAdminToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: AUTH_TOKEN_MAX_AGE, // 2 hours
    });

    cookieStore.set(LAST_ACTIVITY_COOKIE_NAME, Date.now().toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: AUTH_TOKEN_MAX_AGE,
    });

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  } catch (err: unknown) {
    console.error("Login DB error:", err);

    // Resilient fallback: If database is temporarily offline or unmigrated, allow master credentials
    if (isDefaultCredentials) {
      const token = await signAdminToken({
        id: "default-admin-root",
        email: defaultEmail,
        name: "Dangracif Administrator",
        role: "admin",
      });

      const cookieStore = await cookies();
      cookieStore.set(AUTH_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
        maxAge: AUTH_TOKEN_MAX_AGE,
      });

      cookieStore.set(LAST_ACTIVITY_COOKIE_NAME, Date.now().toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
        maxAge: AUTH_TOKEN_MAX_AGE,
      });

      return {
        success: true,
        user: {
          id: "default-admin-root",
          email: defaultEmail,
          name: "Dangracif Administrator",
          role: "admin",
        },
      };
    }

    return {
      success: false,
      error: "Could not authenticate. Please verify your credentials.",
    };
  }
}

export async function adminLogoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
  cookieStore.delete(LAST_ACTIVITY_COOKIE_NAME);
  return { success: true };
}

export async function getCurrentAdmin() {
  return await getAdminSession();
}

export async function updateAdminPasswordAction(formData: {
  currentPassword?: string;
  newPassword?: string;
}) {
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Unauthorized. Please log in." };
  }

  const currentPassword = formData.currentPassword?.trim();
  const newPassword = formData.newPassword?.trim();

  if (!currentPassword || !newPassword) {
    return { success: false, error: "Both current and new password are required." };
  }

  if (newPassword.length < 6) {
    return { success: false, error: "New password must be at least 6 characters." };
  }

  try {
    const dataSource = await getDatabaseConnection();
    const userRepo = dataSource.getRepository<User>("User");

    const user = await userRepo.findOne({
      where: { id: session.id },
    });

    if (!user) {
      return { success: false, error: "User account not found." };
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return { success: false, error: "Current password is incorrect." };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await userRepo.save(user);

    return { success: true };
  } catch (err: unknown) {
    console.error("Password update error:", err);
    return { success: false, error: "Failed to update password." };
  }
}
