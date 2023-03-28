import { useState } from "react"
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react"
import Avatar from "../Avatar/Avatar"
import AddImage from "../AddImage/AddImage"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from "@radix-ui/react-dialog"
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

  async function updateRelease(
    artworkUrl,
    downloadUrl,
    isPasswordProtected,
    pagePassword
  ) {
    try {
      const update = {
        artwork_url: artworkUrl,
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
          />
          <br />
          <label className="label" htmlFor="artworkUrl">
            Artwork Url
          </label>
          <input
            className="input"
            id="artowkrUrl"
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
            onClick={() =>
              updateRelease(
                artworkUrl,
                downloadUrl,
                isPasswordProtected,
                pagePassword
              )
            }
          >
            Update
          </button>
          <DialogClose className="button">Cancel</DialogClose>
        </footer>
      </DialogContent>
    </Dialog>
  )
}
