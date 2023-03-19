import React, { useEffect, useState } from "react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import IconUpload from "@/icons/upload.svg"
import styles from "./Avatar.module.css"
import cn from "classnames"
import { v4 as uuidv4 } from "uuid"
import AddImage from "../AddImage/AddImage"

export default function Avatar({ url, size }) {
  // const supabase = useSupabaseClient()
  // const [imageUrl, setImageUrl] = useState(null)
  // const [uploading, setUploading] = useState(false)

  // useEffect(() => {
  //   async function downloadImage(path) {
  //     try {
  //       const { data, error } = await supabase.storage
  //         .from("images")
  //         .getPublicUrl(uid + "/" + path)
  //       if (error) {
  //         throw error
  //       }
  //       const url = URL.createObjectURL(data)
  //       setAvatarUrl(url)
  //     } catch (error) {
  //       console.log("Error downloading image: ", error)
  //     }
  //   }

  //   if (url) setAvatarUrl(url)
  // }, [supabase.storage, url])

  // const uploadAvatar = async (event) => {
  //   try {
  //     setUploading(true)

  //     if (!event.target.files || event.target.files.length === 0) {
  //       throw new Error("You must select an image to upload.")
  //     }

  //     const file = event.target.files[0]
  //     const fileExt = file.name.split(".").pop()
  //     const fileName = `${uid}.${fileExt}`
  //     const filePath = `${fileName}`

  //     let { data, error: uploadError } = await supabase.storage
  //       .from("images")
  //       .upload(uid + "/" + uuidv4(), file)

  //     if (uploadError) {
  //       throw uploadError
  //     }

  //     if (data) {
  //       console.log("image upload data: ", data)
  //     } else {
  //       console.log(error)
  //     }
  //     // onUpload(filePath)
  //   } catch (error) {
  //     alert("Error uploading avatar!")
  //     console.log(error)
  //   } finally {
  //     setUploading(false)
  //   }
  // }

  return (
    <div className={cn(styles.component, "stack")} style={{ maxWidth: size }}>
      {url ? (
        <img
          className={styles.image}
          src={url}
          alt=""
          height={size}
          width={size}
        />
      ) : (
        <div style={{ height: size, width: size }} />
      )}
    </div>
  )
}
