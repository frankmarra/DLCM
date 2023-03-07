import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'next/router'
import { useUser } from '@/utils/context/user'
import Image from 'next/image'

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
    <div className="label-wrapper">
      {label.avatar ? (
        <img src={label.avatar} alt={label.name} width={200} height={200} />
      ) : null}
      <h1>{label.name}</h1>
      <h2>{label.location}</h2>
      <button type="button" onClick={logout}>
        logout
      </button>
    </div>
  ) : (
    <div>Loading...</div>
  )
}
