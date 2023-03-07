import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'next/router'
import { useUser } from '@/utils/context/user'

export async function getServerSideProps({ params }) {
  let { data: artist, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('type', 'Artist')
    .eq('slug', params.slug)
    .single()

  return { props: { artist } }
}

export default function ArtistPage({ artist }) {
  const router = useRouter()
  const { activeUser, logout } = useUser()
  return artist ? (
    <div className="label-wrapper">
      {artist.avatar ? (
        <img src={artist.avatar} alt={artist.name} width={200} height={200} />
      ) : null}
      <h1>{artist.name}</h1>
      <h2>{artist.location}</h2>
      <button type="button" onClick={logout}>
        logout
      </button>
    </div>
  ) : (
    <div>Loading...</div>
  )
}
