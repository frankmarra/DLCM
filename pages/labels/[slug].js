import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'next/router'
import { useUser } from '@/utils/context/user'
import ProfileLayout from '@/components/ProfileLayout'

export async function getServerSideProps({ params }) {
  let { data: label, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('type', 'Label')
    .eq('slug', params.slug)
    .single()

  return { props: { label } }
}

export default function LabelPage({ label }) {
  const router = useRouter()
  const { activeUser, logout } = useUser()
  return label ? (
    <ProfileLayout
      avatar={label.avatar}
      name={label.name}
      location={label.location}
      logout={logout}
    />
  ) : (
    <div>Loading...</div>
  )
}
