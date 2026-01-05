import type {
  CreatePlaylistArgs,
  FetchPlaylistsArgs,
  UpdatePlaylistArgs,
} from "@/features/playlists/api/playlistsApi.types.ts"
import { baseApi } from "@/app/api/baseApi.ts"
import type { Images } from "@/common/types"
import { imagesSchema, playlistCreateResponseSchema, playlistsResponseSchema } from "@/common/schemas"
import { withZodCatch } from "@/common/utils"

export const playlistsApi = baseApi.injectEndpoints({
  endpoints: (build) => {
    return {
      fetchPlaylists: build.query({
        query: (params: FetchPlaylistsArgs) => ({ url: "playlists", params }),
        ...withZodCatch(playlistsResponseSchema),
        providesTags: ["Playlist"],
      }),
      createPlaylist: build.mutation({
        query: (body: CreatePlaylistArgs) => ({ method: "post", url: "playlists", body }),
        ...withZodCatch(playlistCreateResponseSchema),
        invalidatesTags: ["Playlist"],
      }),
      deletePlaylist: build.mutation<void, string>({
        query: (playlistId) => ({ method: "delete", url: `playlists/${playlistId}` }),
        invalidatesTags: ["Playlist"],
      }),
      updatePlaylist: build.mutation<void, { playlistId: string; body: UpdatePlaylistArgs }>({
        query: ({ playlistId, body }) => ({ method: "put", url: `playlists/${playlistId}`, body }),
        onQueryStarted: async ({ playlistId, body }, { dispatch, queryFulfilled, getState }) => {
          const args = playlistsApi.util.selectCachedArgsForQuery(getState(), "fetchPlaylists")

          const patchResults: any[] = []

          args.forEach((arg) => {
            patchResults.push(
              dispatch(
                playlistsApi.util.updateQueryData(
                  "fetchPlaylists",
                  {
                    pageNumber: arg.pageNumber,
                    pageSize: arg.pageSize,
                    search: arg.search,
                  },
                  (state) => {
                    const index = state.data.findIndex((playlist) => playlist.id === playlistId)
                    if (index !== -1) {
                      state.data[index].attributes = { ...state.data[index].attributes, ...body }
                    }
                  },
                ),
              ),
            )
          })

          try {
            await queryFulfilled
          } catch {
            patchResults.forEach((patchResult) => {
              patchResult.undo()
            })
          }
        },
        invalidatesTags: ["Playlist"],
      }),
      uploadPlaylistCover: build.mutation<Images, { playlistId: string; file: File }>({
        query: ({ playlistId, file }) => {
          const formData = new FormData()
          formData.append("file", file)
          return { method: "post", url: `playlists/${playlistId}/images/main`, body: formData }
        },
        ...withZodCatch(imagesSchema),
        invalidatesTags: ["Playlist"],
      }),
      deletePlaylistCover: build.mutation<void, { playlistId: string }>({
        query: ({ playlistId }) => ({ method: "delete", url: `playlists/${playlistId}/images/main` }),
        invalidatesTags: ["Playlist"],
      }),
    }
  },
})

export const {
  useFetchPlaylistsQuery,
  useCreatePlaylistMutation,
  useDeletePlaylistMutation,
  useUpdatePlaylistMutation,
  useUploadPlaylistCoverMutation,
  useDeletePlaylistCoverMutation,
} = playlistsApi
