import Head from 'next/head'
import { ReactNode } from 'react'
import { useLoading } from '../Context/LoadingContext'
import Navbar from '../Header/Navbar'
import Loading from './Loading'

type Props = {
  children: ReactNode
}

export default function Main(props: Props) {
  const { loading } = useLoading()
  return (
    <div className="layout bg-black">
      <Head>
        <title>Loci</title>
        <meta name="description" content="Where things are" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />

      <div className="px-1 main w-full overflow-y-scroll mx-auto">
        <Loading loading={loading} />
        {props.children}
      </div>
    </div>
  )
}
