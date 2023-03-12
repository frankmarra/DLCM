import React, { useEffect, useState } from "react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import IconUpload from "@/icons/upload.svg"
import styles from "./Avatar.module.css"
import cn from "classnames"

export default function Avatar({ uid, url, size, onUpload }) {
  const supabase = useSupabaseClient()
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    async function downloadImage(path) {
      try {
        const { data, error } = await supabase.storage
          .from("avatars")
          .download(path)
        if (error) {
          throw error
        }
        const url = URL.createObjectURL(data)
        setAvatarUrl(url)
      } catch (error) {
        console.log("Error downloading image: ", error)
      }
    }

    if (url) setAvatarUrl(url)
  }, [supabase.storage, url])

  const uploadAvatar = async (event) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.")
      }

      const file = event.target.files[0]
      const fileExt = file.name.split(".").pop()
      const fileName = `${uid}.${fileExt}`
      const filePath = `${fileName}`

      let { error: uploadError } = await supabase.storage
        .from("profiles")
        .update({ avatar: filePath })

      if (uploadError) {
        throw uploadError
      }

      onUpload(filePath)
    } catch (error) {
      alert("Error uploading avatar!")
      console.log(error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={cn(styles.component, "stack")} style={{ maxWidth: size }}>
      {avatarUrl ? (
        <img
          className={styles.image}
          src={avatarUrl}
          alt=""
          height={size}
          width={size}
        />
      ) : (
        <div style={{ height: size, width: size }} />
      )}

      <label
        className={cn(styles.upload, "button")}
        data-variant="dashed"
        htmlFor="single"
      >
        <IconUpload aria-hidden="true" />{" "}
        {uploading ? "Uploading..." : "Update avatar image"}
      </label>
      <input
        style={{
          visibility: "hidden",
          position: "absolute",
        }}
        type="file"
        id="single"
        accept="image/*"
        // onChange={uploadAvatar}
        disabled={uploading}
      />
    </div>
  )
}
