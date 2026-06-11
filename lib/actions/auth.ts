"use server"

import { getSupabaseAdmin, supabase } from "@/lib/supabase"

/**
 * Checks if the email is present in the Supabase Auth database.
 * If yes, dispatches a password-reset link to that email.
 * If no, returns an 'invalid email' error to the client.
 */
export async function checkEmailAndSendResetLink(email: string, origin: string) {
    try {
        if (!email) {
            return { success: false, error: "Email is required." }
        }

        const admin = getSupabaseAdmin()

        let page = 1
        let found = false
        const perPage = 1000

        // Fetch users using admin API and search for matching email
        while (true) {
            const { data, error } = await admin.auth.admin.listUsers({
                page,
                perPage
            })

            if (error) {
                console.error("Error listing users from Supabase admin:", error)
                throw error
            }

            const users = data?.users || []

            if (users.length === 0) {
                break
            }

            const targetEmail = email.trim().toLowerCase()
            const match = users.find(u => u.email?.toLowerCase() === targetEmail)
            if (match) {
                found = true
                break
            }

            if (users.length < perPage) {
                break
            }
            page++
        }

        if (!found) {
            return { success: false, error: "invalid email" }
        }

        // Email exists in the database! Generate secure reset link via Supabase Admin API.
        const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
            type: 'recovery',
            email: email.trim(),
            options: {
                redirectTo: `${origin}/reset-password`,
            }
        })

        if (linkError) {
            console.error("Error generating reset password link:", linkError)
            return { success: false, error: linkError.message }
        }

        const actionLink = linkData?.properties?.action_link
        if (!actionLink) {
            return { success: false, error: "Failed to generate action link." }
        }

        // Send the email via Resend API
        const resendApiKey = process.env.RESEND_API

        // Log the link prominently for dev/test in all cases
        console.log(`
============================================================
🔑 [DEV/TEST EMAIL LOG]
To: ${email}
Type: Password Reset Link
Link: ${actionLink}
============================================================
        `)

        if (!resendApiKey) {
            console.error("RESEND_API is missing from environment variables.")
            return { success: false, error: "Email service is temporarily unavailable." }
        }

        try {
            const resendResponse = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${resendApiKey}`
                },
                body: JSON.stringify({
                    from: process.env.RESEND_FROM,
                    to: [email.trim()],
                    subject: 'Reset Your Password - Century Lands & Homes',
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                            <h2 style="color: #0B2545; font-size: 24px; font-weight: bold; margin-bottom: 16px;">Reset Your Password</h2>
                            <p style="color: #4a5568; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
                                We received a request to reset the password for your Century Lands & Homes account. Click the button below to set a new password:
                            </p>
                            <div style="text-align: center; margin-bottom: 24px;">
                                <a href="${actionLink}" style="display: inline-block; background-color: #C5A028; color: white; padding: 12px 24px; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 6px;">Reset Password</a>
                            </div>
                            <p style="color: #718096; font-size: 14px; line-height: 1.5;">
                                If you didn't request a password reset, you can safely ignore this email.
                            </p>
                            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
                            <p style="color: #a0aec0; font-size: 12px; text-align: center;">
                                &copy; ${new Date().getFullYear()} Century Lands &amp; Homes. All rights reserved.
                            </p>
                        </div>
                    `
                })
            })

            if (!resendResponse.ok) {
                const errorData = await resendResponse.json()
                console.error("Resend API returned error:", errorData)
                return { success: false, error: errorData.message || "Failed to send reset email." }
            }
        } catch (emailError: any) {
            console.error("Failed to send reset password email via Resend:", emailError)
            return { success: false, error: "Failed to send reset email: " + (emailError.message || emailError) }
        }

        return { success: true }
    } catch (error: any) {
        console.error("Error in checkEmailAndSendResetLink:", error)
        return { success: false, error: error.message || "Failed to process forgot password request." }
    }
}

/**
 * Fetches all user accounts using the Supabase Admin API and maps them.
 */
export async function adminListUsers() {
    try {
        const admin = getSupabaseAdmin()

        let allUsers: any[] = []
        let page = 1
        const perPage = 1000

        while (true) {
            const { data, error } = await admin.auth.admin.listUsers({
                page,
                perPage
            })

            if (error) {
                console.error("Error listing users in adminListUsers:", error)
                throw error
            }

            const users = data?.users || []
            if (users.length === 0) break

            allUsers = [...allUsers, ...users]
            if (users.length < perPage) break
            page++
        }

        // Map them to the UI structure expected by AdminUsersPage
        const mappedUsers = allUsers.map(u => ({
            id: u.id,
            name: u.user_metadata?.full_name || u.email?.split("@")[0] || "User",
            email: u.email || "",
            phone: u.user_metadata?.phone || "",
            role: u.user_metadata?.role || "User",
            status: u.user_metadata?.status || (u.email_confirmed_at ? "Active" : "Inactive"),
            lastActive: u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleString() : "Never",
            department: u.user_metadata?.department || "N/A"
        }))

        return { success: true, users: mappedUsers }
    } catch (error: any) {
        console.error("Error in adminListUsers:", error)
        return { success: false, error: error.message || "Failed to list users." }
    }
}

/**
 * Creates a new user in Supabase Auth via the Admin API.
 */
export async function adminCreateUser(userData: {
    email: string;
    password?: string;
    name: string;
    phone: string;
    role: string;
    status: string;
    department: string;
}) {
    try {
        const admin = getSupabaseAdmin()

        // Use the provided password or generate a default one
        const password = userData.password || "Century123!"

        const { data, error } = await admin.auth.admin.createUser({
            email: userData.email,
            password: password,
            email_confirm: true, // Auto-confirm email so they can log in immediately
            user_metadata: {
                full_name: userData.name,
                phone: userData.phone,
                role: userData.role,
                status: userData.status,
                department: userData.department
            }
        })

        if (error) {
            console.error("Error in adminCreateUser createUser call:", error)
            return { success: false, error: error.message }
        }

        return { success: true, user: data.user }
    } catch (error: any) {
        console.error("Error in adminCreateUser:", error)
        return { success: false, error: error.message || "Failed to create user account." }
    }
}

/**
 * Updates a user's details and metadata in Supabase Auth.
 */
export async function adminUpdateUser(userId: string, updateData: {
    name: string;
    phone: string;
    role: string;
    status: string;
    department: string;
    email?: string;
}) {
    try {
        const admin = getSupabaseAdmin()

        const attributes: any = {
            user_metadata: {
                full_name: updateData.name,
                phone: updateData.phone,
                role: updateData.role,
                status: updateData.status,
                department: updateData.department
            }
        }

        if (updateData.email) {
            attributes.email = updateData.email
        }

        const { data, error } = await admin.auth.admin.updateUserById(userId, attributes)

        if (error) {
            console.error("Error in adminUpdateUser updateUserById call:", error)
            return { success: false, error: error.message }
        }

        return { success: true, user: data.user }
    } catch (error: any) {
        console.error("Error in adminUpdateUser:", error)
        return { success: false, error: error.message || "Failed to update user." }
    }
}

/**
 * Permanently deletes a user from Supabase Auth using the Admin API.
 */
export async function adminDeleteUser(userId: string) {
    try {
        const admin = getSupabaseAdmin()
        const { error } = await admin.auth.admin.deleteUser(userId)

        if (error) {
            console.error("Error in adminDeleteUser deleteUser call:", error)
            return { success: false, error: error.message }
        }

        return { success: true }
    } catch (error: any) {
        console.error("Error in adminDeleteUser:", error)
        return { success: false, error: error.message || "Failed to delete user." }
    }
}

/**
 * Permanently deletes a user's account and all corresponding details in the database.
 */
export async function deleteUserAccountAndData(userId: string, email: string) {
    try {
        const admin = getSupabaseAdmin()

        // 1. Delete saved properties
        const { error: savedError } = await admin
            .from("saved_properties")
            .delete()
            .eq("user_id", userId)
        if (savedError) {
            console.error("Error deleting user saved properties:", savedError)
        }

        // 2. Delete appointments
        if (email) {
            const { error: apptError } = await admin
                .from("appointments")
                .delete()
                .eq("email", email)
            if (apptError) {
                console.error("Error deleting user appointments:", apptError)
            }
        }

        // 3. Delete inquiries
        if (email) {
            const { error: inquiryError } = await admin
                .from("inquiries")
                .delete()
                .eq("email", email)
            if (inquiryError) {
                console.error("Error deleting user inquiries:", inquiryError)
            }
        }

        // 4. Delete the user from auth
        const { error: authError } = await admin.auth.admin.deleteUser(userId)
        if (authError) {
            console.error("Error in deleteUser call:", authError)
            return { success: false, error: authError.message }
        }

        return { success: true }
    } catch (error: any) {
        console.error("Error in deleteUserAccountAndData:", error)
        return { success: false, error: error.message || "Failed to delete account." }
    }
}

/**
 * Server Action to physically delete a file from R2 bucket.
 */
export async function deleteR2FileAction(url: string) {
    try {
        const { deleteFromR2 } = await import("@/lib/backend/upload")
        await deleteFromR2(url)
        return { success: true }
    } catch (error: any) {
        console.error("Error in deleteR2FileAction:", error)
        return { success: false, error: error.message || "Failed to delete file from R2." }
    }
}

/**
 * Generates a 6-digit 2FA OTP code, updates user metadata, and sends it via Resend.
 */
export async function sendMfaOtp(email: string, origin: string) {
    try {
        if (!email) {
            return { success: false, error: "Email is required." }
        }

        const admin = getSupabaseAdmin()

        // 1. Find the user to get their ID
        let page = 1
        let targetUser: any = null
        const perPage = 1000

        while (true) {
            const { data, error } = await admin.auth.admin.listUsers({
                page,
                perPage
            })

            if (error) {
                console.error("Error listing users to send OTP:", error)
                throw error
            }

            const users = data?.users || []
            if (users.length === 0) break

            const match = users.find(u => u.email?.toLowerCase() === email.trim().toLowerCase())
            if (match) {
                targetUser = match
                break
            }

            if (users.length < perPage) break
            page++
        }

        if (!targetUser) {
            return { success: false, error: "User not found." }
        }

        // 2. Generate a custom 6-digit numeric OTP code and expiry (10 minutes)
        const sixDigitCode = Math.floor(100000 + Math.random() * 900000).toString()
        const expiry = Date.now() + 10 * 60 * 1000

        // 3. Update the user's metadata
        const { error: updateError } = await admin.auth.admin.updateUserById(targetUser.id, {
            user_metadata: {
                ...targetUser.user_metadata,
                mfa_otp: sixDigitCode,
                mfa_otp_expiry: expiry
            }
        })

        if (updateError) {
            console.error("Error updating user metadata with OTP:", updateError)
            return { success: false, error: updateError.message }
        }

        // 4. Send the email via Resend API
        const resendApiKey = process.env.RESEND_API

        // Log the OTP code prominently for dev/test in all cases
        console.log(`
============================================================
🔑 [DEV/TEST EMAIL LOG]
To: ${email}
Type: 2FA Verification Code
OTP: ${sixDigitCode}
============================================================
        `)

        if (!resendApiKey) {
            console.error("RESEND_API is missing from environment variables.")
            return { success: false, error: "Email service is temporarily unavailable." }
        }

        try {
            const resendResponse = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${resendApiKey}`
                },
                body: JSON.stringify({
                    from: process.env.RESEND_FROM,
                    to: [email.trim()],
                    subject: 'Your Two-Factor Verification Code - Century Lands & Homes',
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                            <h2 style="color: #0B2545; font-size: 24px; font-weight: bold; margin-bottom: 16px;">Two-Factor Verification</h2>
                            <p style="color: #4a5568; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
                                Please use the following 6-digit verification code to confirm your identity and complete your login:
                            </p>
                            <div style="text-align: center; margin: 30px 0;">
                                <div style="display: inline-block; background-color: #f7fafc; border: 2px dashed #cbd5e0; color: #0B2545; padding: 15px 30px; font-size: 36px; font-weight: bold; letter-spacing: 0.15em; border-radius: 8px;">
                                    ${sixDigitCode}
                                </div>
                            </div>
                            <p style="color: #718096; font-size: 14px; line-height: 1.5;">
                                This code will expire in 10 minutes. If you did not request this code, you can safely ignore this email.
                            </p>
                            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
                            <p style="color: #a0aec0; font-size: 12px; text-align: center;">
                                &copy; ${new Date().getFullYear()} Century Lands &amp; Homes. All rights reserved.
                            </p>
                        </div>
                    `
                })
            })

            if (!resendResponse.ok) {
                const errorData = await resendResponse.json()
                console.error("Resend API returned error:", errorData)
                return { success: false, error: errorData.message || "Failed to send verification email." }
            }
        } catch (emailError: any) {
            console.error("Failed to send verification email via Resend:", emailError)
            return { success: false, error: "Failed to send verification email: " + (emailError.message || emailError) }
        }

        return { success: true }
    } catch (error: any) {
        console.error("Error in sendMfaOtp:", error)
        return { success: false, error: error.message || "Failed to send verification code." }
    }
}

/**
 * Verifies a 6-digit 2FA OTP code and returns a login link if successful.
 */
export async function verifyMfaOtp(email: string, code: string, origin: string) {
    try {
        if (!email || !code) {
            return { success: false, error: "Email and verification code are required." }
        }

        const admin = getSupabaseAdmin()

        // 1. Find user by email using Admin API
        let page = 1
        let targetUser: any = null
        const perPage = 1000

        while (true) {
            const { data, error } = await admin.auth.admin.listUsers({
                page,
                perPage
            })

            if (error) {
                console.error("Error listing users for verification:", error)
                throw error
            }

            const users = data?.users || []
            if (users.length === 0) break

            const match = users.find(u => u.email?.toLowerCase() === email.trim().toLowerCase())
            if (match) {
                targetUser = match
                break
            }

            if (users.length < perPage) break
            page++
        }

        if (!targetUser) {
            return { success: false, error: "User not found." }
        }

        const { mfa_otp, mfa_otp_expiry } = targetUser.user_metadata || {}
        if (!mfa_otp || !mfa_otp_expiry) {
            return { success: false, error: "No active verification code found. Please request a new one." }
        }

        if (Date.now() > Number(mfa_otp_expiry)) {
            return { success: false, error: "Verification code has expired. Please request a new one." }
        }

        if (code.trim() !== mfa_otp.toString().trim()) {
            return { success: false, error: "Invalid verification code. Please check and try again." }
        }

        // Code is valid! Clear the OTP metadata
        await admin.auth.admin.updateUserById(targetUser.id, {
            user_metadata: {
                ...targetUser.user_metadata,
                mfa_otp: null,
                mfa_otp_expiry: null
            }
        })

        // Generate the login link for the client to establish a session
        const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
            type: 'magiclink',
            email: email.trim(),
            options: {
                redirectTo: `${origin}/login`,
            }
        })

        if (linkError) {
            console.error("Error generating session link:", linkError)
            return { success: false, error: linkError.message }
        }

        return { success: true, actionLink: linkData?.properties?.action_link }
    } catch (error: any) {
        console.error("Error in verifyMfaOtp:", error)
        return { success: false, error: error.message || "Failed to verify code." }
    }
}



