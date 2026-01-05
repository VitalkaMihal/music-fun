import * as z from "zod"
import { loginResponseSchema, type meResponseSchema } from "@/features/model/auth.schemas.ts"

export type MeResponse = z.infer<typeof meResponseSchema>
export type LoginResponse = z.infer<typeof loginResponseSchema>

// Arguments
export type LoginArgs = {
  code: string
  redirectUri: string
  rememberMe: boolean
  accessTokenTTL?: string
}
