import { useState } from "react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import IconUpload from "@/icons/upload.svg"
import cn from "classnames"
import { v4 as uuidv4 } from "uuid"

export default function AddImage({
  uid,
  setPublicUrl,
  setNewImagePath,
  imagePath,
}) {
  const supabase = useSupabaseClient()
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

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.")
      }

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
        className={cn("button")}
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
    </>
  )
}
