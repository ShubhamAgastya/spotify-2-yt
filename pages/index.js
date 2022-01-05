import { getSession } from 'next-auth/react';
import Head from 'next/head';
import Center from '../components/Center';
import Player from '../components/Player';
import Sidebar from '../components/Sidebar';

export default function Home() {
  return (
    <div className="bg-black h-screen overflow-hidden">
      
      <main className='flex'>
        <Sidebar />
        <Center />
      </main>

      <div className='sticky bottom-0'>
        <Player />
      </div>
    </div>
  );
}

// we're pre-rendering the user on the server which will give us the access token before it hits
// the client. Which will load user and songs before hand.
export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}