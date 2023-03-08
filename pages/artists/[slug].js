import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'next/router'
import { useUser } from '@/utils/context/user'
import ProfileLayout from '@/components/ProfileLayout'

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
    <ProfileLayout
      avatar={artist.avatar}
      name={artist.name}
      location={artist.location}
      logout={logout}
    />
  ) : (
    <div>Loading...</div>
  )
}
