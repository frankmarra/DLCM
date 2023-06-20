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
  profileData,
}) {
  const supabase = useSupabaseClient()
  const user = useUser()
  const [open, setOpen] = useState(false)
  const [artworkUrl, setArtworkUrl] = useState(release.artwork_url)
  const [yumUrl, setYumUrl] = useState(release.yum_url)
  const [isPasswordProtected, setIsPasswordProtected] = useState(
    release.is_password_protected
  )
  const [pagePassword, setPagePassword] = useState(release.page_password)
  const [artworkId, setArtworkId] = useState()
  const [imagePath, setImagePath] = useState(release.artwork_path)
  const [newImagePath, setNewImagePath] = useState()
  const [isActive, setIsActive] = useState(release.is_active)
  const [sites, setSites] = useState({
    apple: release.sites.apple ? release.sites.apple : null,
    bandcamp: release.sites.bandcamp ? release.sites.bandcamp : null,
    spotify: release.sites.spotify ? release.sites.spotify : null,
    soundcloud: release.sites.soundcloud ? release.sites.soundcloud : null,
    youtube: release.sites.youtube ? release.sites.youtube : null,
  })

  async function updateRelease() {
    try {
      const update = {
        artwork_url: artworkUrl,
        artwork_path: newImagePath ? newImagePath : imagePath,
        yum_url: yumUrl,
        sites: sites,
        is_active: isActive,
        is_password_protected: isPasswordProtected,
        page_password: pagePassword,
        updated_at: new Date().toISOString(),
      }

      if (newImagePath) {
        try {
          let { error } = await supabase.storage
            .from("images")
            .remove([imagePath])
          if (error) alert(error)
        } catch (error) {
          throw error
        }
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
    }
    setShowReleaseUpdateView(false)
  }

  async function cancelUpdate() {
    if (newImagePath) {
      try {
        let { error } = await supabase.storage
          .from("images")
          .remove([newImagePath])
        if (error) alert(error)
      } catch (error) {
        throw error
      }
    }
    setOpen(false)
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
            setNewImagePath={setNewImagePath}
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

          <label className="label" htmlFor="yumUrl">
            Redemption Link
          </label>
          <input
            className="input"
            id="yumUrl"
            type="text"
            value={yumUrl}
            onChange={(e) => setYumUrl(e.target.value)}
          />
          {profileData.is_subscribed ? (
            <>
              <label className="label" htmlFor="apple">
                Apple Music Link
              </label>
              <input
                className="input"
                id="apple"
                type="text"
                value={sites.apple}
                onChange={(e) =>
                  setSites({ ...sites, [e.target.id]: e.target.value })
                }
              />
              <label className="label" htmlFor="bandcamp">
                Bandcamp Link
              </label>
              <input
                className="input"
                id="bandcamp"
                type="text"
                value={sites.bandcamp}
                onChange={(e) =>
                  setSites({ ...sites, [e.target.id]: e.target.value })
                }
              />
              <label className="label" htmlFor="spotify">
                Spotify Link
              </label>
              <input
                className="input"
                id="spotify"
                type="text"
                value={sites.spotify}
                onChange={(e) =>
                  setSites({ ...sites, [e.target.id]: e.target.value })
                }
              />
              <label className="label" htmlFor="soundcloud">
                Soundcloud Link
              </label>
              <input
                className="input"
                id="soundcloud"
                type="text"
                value={sites.soundcloud}
                onChange={(e) =>
                  setSites({ ...sites, [e.target.id]: e.target.value })
                }
              />
              <label className="label" htmlFor="youtube">
                YouTube Link
              </label>
              <input
                className="input"
                id="youtube"
                type="text"
                value={sites.youtube}
                onChange={(e) =>
                  setSites({ ...sites, [e.target.id]: e.target.value })
                }
              />
              <label className="label" htmlFor="isActive">
                Allow fans to access?
              </label>
              <input
                id="isActive"
                type="checkbox"
                checked={isActive}
                onChange={() => setIsActive(!isActive)}
              />
              <label className="label" htmlFor="passwordProtect">
                Password protect page?
              </label>
              <input
                id="passwordProtect"
                type="checkbox"
                checked={isPasswordProtected}
                onChange={() => setIsPasswordProtected(!isPasswordProtected)}
              />{" "}
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
          <button className="button" onClick={() => cancelUpdate()}>
            Cancel
          </button>
        </footer>
      </DialogContent>
    </Dialog>
  )
}
