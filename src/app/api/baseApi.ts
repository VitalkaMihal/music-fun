import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { toast } from "react-toastify"
import { isErrorWithDetailArray, isErrorWithProperty } from "@/common/utils"

export const baseApi = createApi({
  reducerPath: "baseApi",
  tagTypes: ["Playlist"],
  baseQuery: async (args, api, extraOptions) => {
    const result = await fetchBaseQuery({
      baseUrl: import.meta.env.VITE_BASE_URL,
      headers: {
        "API-KEY": import.meta.env.VITE_API_KEY,
      },
      prepareHeaders: (headers) => {
        headers.set("Authorization", `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`)
        return headers
      },
    })(args, api, extraOptions)

    if (result.error) {
      switch (result.error.status) {
        case "FETCH_ERROR":
        case "PARSING_ERROR":
        case "CUSTOM_ERROR":
        case "TIMEOUT_ERROR":
          toast(result.error.error, { type: "error", theme: "colored" })
          break

        case 403:
          if (isErrorWithDetailArray(result.error.data)) {
            toast(result.error.data.errors[0].detail, { type: "error", theme: "colored" })
          } else {
            toast(JSON.stringify(result.error.data), { type: "error", theme: "colored" })
          }
          break

        case 404:
          if (isErrorWithProperty(result.error.data, "error")) {
            toast(result.error.data.error, { type: "error", theme: "colored" })
          } else {
            toast(JSON.stringify(result.error.data), { type: "error", theme: "colored" })
          }
          break

        case 401:
        case 429:
          if (isErrorWithProperty(result.error.data, "message")) {
            toast(result.error.data.message, { type: "error", theme: "colored" })
          } else {
            toast(JSON.stringify(result.error.data), { type: "error", theme: "colored" })
          }
          break

        default:
          toast("Some error occurred", { type: "error", theme: "colored" })
      }
    }

    return result
  },
  endpoints: () => ({}),
})
