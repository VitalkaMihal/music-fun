import type { PlaylistData } from "@/features/playlists/api/playlistsApi.types.ts"
import { PlaylistCover } from "@/features/playlists/ui/PlaylistItem/PlaylistCover/PlaylistCover.tsx"

type Props = {
  playlist: PlaylistData
  deletePlaylistHandler: (playlistId: string) => void
  editPlaylistHandler: (playlist: PlaylistData) => void
}

export const PlaylistItem = ({ playlist, editPlaylistHandler, deletePlaylistHandler }: Props) => {
  return (
    <>
      <PlaylistCover playlist={playlist} />
      <div>title: {playlist.attributes.title}</div>
      <div>description: {playlist.attributes.description}</div>
      <div>userName: {playlist.attributes.user.name}</div>
      <button onClick={() => deletePlaylistHandler(playlist.id)}>delete</button>
      <button onClick={() => editPlaylistHandler(playlist)}>update</button>
    </>
  )
}
