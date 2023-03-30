import { useState, useEffect } from "react"
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react"
import AddImage from "../AddImage/AddImage"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from "@/components/Dialog/Dialog"
import IconEdit from "@/icons/edit.svg"

export default function UpdateRelease({
  release,
  setShowReleaseUpdateView,
  getReleases,
}) {
  const supabase = useSupabaseClient()
  const user = useUser()
  const [open, setOpen] = useState(false)
  const [artworkUrl, setArtworkUrl] = useState(release.artwork_url)
  const [downloadUrl, setDownloadUrl] = useState(release.download_url)
  const [isPasswordProtected, setIsPasswordProtected] = useState(
    release.is_password_protected
  )
  const [pagePassword, setPagePassword] = useState(release.page_password)
  const [artworkId, setArtworkId] = useState()
  const [imagePath, setImagePath] = useState(release.artwork_path)

  async function updateRelease() {
    try {
      const update = {
        artwork_url: artworkUrl,
        artwork_path: imagePath,
        download_url: downloadUrl,
        is_password_protected: isPasswordProtected,
        page_password: pagePassword,
        updated_at: new Date().toISOString(),
      }

      let { error } = await supabase
        .from("releases")
        .update(update)
        .eq("id", release.id)

      if (error) throw error
      alert("Release updated!")
    } catch (error) {
      alert("Error updating the data!")
      console.log(error)
    } finally {
      getReleases()
      setShowReleaseUpdateView(false)
    }
  }

  async function deleteRelease() {
    const deleteCheck = window.prompt(
      `Please enter '${release.title}' to delete this release.`
    )

    if (deleteCheck === release.title) {
      try {
        let { data, error } = await supabase.storage
          .from("images")
          .remove([release.artwork_path])

        let { error: codeError } = await supabase
          .from("codes")
          .delete()
          .eq("release_id", release.id)

        let { error: releaseError } = await supabase
          .from("releases")
          .delete()
          .eq("id", release.id)

        if (codeError) throw error
        if (releaseError) throw error
        alert("Release deleted.")
      } catch (error) {
        alert("Error deleting data!")
        console.log(error)
      } finally {
        getReleases()
        setOpen(false)
      }
    } else {
      alert("Incorrect input")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="button"
        data-variant="primary"
        data-size="small"
      >
        <IconEdit aria-hidden="true" /> Edit
      </DialogTrigger>

      <DialogContent>
        <header>
          <h2>Update release</h2>
        </header>

        <div className="stack block-overflow">
          <AddImage
            uid={user.id}
            setPublicUrl={(url) => {
              setArtworkUrl(url)
            }}
            setImagePath={setImagePath}
            imagePath={imagePath}
          />
          <br />
          <label className="label" htmlFor="artworkUrl">
            Artwork Url
          </label>
          <input
            className="input"
            id="artworkUrl"
            type="text"
            value={artworkUrl}
            onChange={(e) => setArtworkUrl(e.target.value)}
          />

          <label className="label" htmlFor="downloadUrl">
            Download Url
          </label>
          <input
            className="input"
            id="downloadUrl"
            type="text"
            value={downloadUrl}
            onChange={(e) => setDownloadUrl(e.target.value)}
          />

          <input
            id="passwordProtect"
            type="checkbox"
            checked={isPasswordProtected}
            onChange={() => setIsPasswordProtected(!isPasswordProtected)}
          />

          <label className="label" htmlFor="passwordProtect">
            Password protect page?
          </label>

          {isPasswordProtected ? (
            <>
              <label className="label" htmlFor="pagePassword">
                Page password
              </label>
              <input
                className="input"
                id="pagePassword"
                type="password"
                value={pagePassword || ""}
                onChange={(e) => setPagePassword(e.target.value)}
              />
            </>
          ) : null}
        </div>

        <footer className="button-actions inline-wrap">
          <button
            className="button"
            data-variant="primary"
            onClick={updateRelease}
          >
            Update
          </button>

          <button
            className="button"
            data-variant="secondary"
            onClick={deleteRelease}
          >
            Delete
          </button>
          <DialogClose className="button">Cancel</DialogClose>
        </footer>
      </DialogContent>
    </Dialog>
  )
}
