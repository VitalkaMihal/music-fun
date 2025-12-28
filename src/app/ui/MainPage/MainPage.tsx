import { useGetMeQuery } from "@/features/auth/api/authApi.ts"

export const MainPage = () => {
  const { data } = useGetMeQuery()
  return (
    <div>
      <h1>Main page</h1>
      <h2>Login: {data?.login}</h2>
    </div>
  )
}
