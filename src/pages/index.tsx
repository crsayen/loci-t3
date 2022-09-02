import type { NextPage } from 'next'
import Main from '../components/Layout/Main'
import UsersPage from './users'

const Home: NextPage = () => {
  return (
    <Main>
      <UsersPage />
    </Main>
  )
}

export default Home
