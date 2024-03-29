import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { v4 as uuidv4 } from "uuid"
import IconUpload from "@/icons/upload.svg"
import styles from "./AddImage.module.css"
import cn from "classnames"

export default function AddImage({
  uid,
  setPublicUrl,
  setNewImagePath,
  imagePath,
}) {
  const supabase = createClientComponentClient()
  const [uploading, setUploading] = useState(false)

  async function getPublicUrl(path) {
    const { data } = supabase.storage.from("images").getPublicUrl(path.path)

    if (data) {
      setPublicUrl(data.publicUrl)
    }
  }

  const uploadImage = async (event) => {
    try {
      setUploading(true)

      // if (!event.target.files || event.target.files.length === 0) {
      //   alert("You must select an image to upload.")
      // }

      if (event.target.files[0].size / 1048576 > 1) {
        alert("Image too large. File must be 1MB or less")
      } else {
        const file = event.target.files[0]

        let { data, error: uploadError } = await supabase.storage
          .from("images")
          .upload(uid + "/" + uuidv4(), file)

        if (uploadError) {
          throw uploadError
        }

        if (data) {
          setNewImagePath(data.path)
          getPublicUrl(data)
        } else {
          console.log(error)
        }
      }
    } catch (error) {
      alert("Error uploading avatar!")
      console.log(error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <label
        tabIndex={1}
        className={cn(styles.upload, "button")}
        data-variant="dashed"
        htmlFor="single"
      >
        <IconUpload aria-hidden="true" />{" "}
        {uploading
          ? "Uploading..."
          : !imagePath
          ? "Upload image"
          : "Replace Image"}
      </label>
      <input
        style={{
          visibility: "hidden",
          position: "absolute",
        }}
        type="file"
        id="single"
        accept="image/*"
        onChange={uploadImage}
        disabled={uploading}
      />
      <small className="hint">
        File size must be less than 1MB. File too large? Consider using an
        application like{" "}
        <a href="https://squoosh.app/" target="_blank">
          Squoosh
        </a>{" "}
        to optimize it.
      </small>
    </>
  )
}
