import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1>test</h1>
      <br />
      <Link href="/posts">Posts</Link>
      <br />
      <Link href="/albums">Albums</Link>
      <br />
      <Link href="/todolists">TodoList</Link>
    </>

  )
}
