import { useFetchPlaylistsQuery } from "@/features/playlists/api/playlistsApi.ts"
import { CreatePlaylistForm } from "@/features/playlists/ui/CreatePlaylistForm/CreatePlaylistForm.tsx"
import { type ChangeEvent, useState } from "react"
import s from "./PlaylistsPage.module.css"
import { useDebounceValue } from "@/common/hooks"
import { LinearProgress, Pagination } from "@/common/components"
import { PlaylistsList } from "@/features/playlists/ui/PlaylistsList/PlaylistsList.tsx"

export const PlaylistsPage = () => {
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(2)

  const debounceSearch = useDebounceValue(search)
  const { data, isLoading, isFetching } = useFetchPlaylistsQuery({
    search: debounceSearch,
    pageNumber: currentPage,
    pageSize,
  })

  const changePageSizeHandler = (size: number) => {
    setPageSize(size)
    setCurrentPage(1)
  }

  const searchPlaylistHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value)
    setCurrentPage(1)
  }

  if (isLoading) return <h1>Skeleton loader...</h1>

  return (
    <div className={s.container}>
      {isFetching && <LinearProgress />}

      <h1>Playlists page</h1>
      <CreatePlaylistForm />
      <input type="search" placeholder={"Search playlist by title"} onChange={searchPlaylistHandler} />
      <PlaylistsList playlists={data?.data || []} isPlaylistLoading={isLoading} />
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pagesCount={data?.meta.pagesCount || 1}
        pageSize={pageSize}
        changePageSize={changePageSizeHandler}
      />
    </div>
  )
}
