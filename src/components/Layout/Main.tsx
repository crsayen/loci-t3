import Head from 'next/head'
import { ReactNode } from 'react'
import Navbar from '../Header/Navbar'

type Props = {
  children: ReactNode
}

export default function Main(props: Props) {
  return (
    <div className="layout bg-black">
      <Head>
        <title>Loci</title>
        <meta name="description" content="Where things are" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <div className="px-1 main w-full overflow-y-scroll mx-auto">{props.children}</div>
    </div>
  )
}
