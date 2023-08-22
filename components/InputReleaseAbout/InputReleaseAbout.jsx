import dynamic from "next/dynamic"
// import Quill from "react-quill"
import "react-quill/dist/quill.snow.css"

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
})

const modules = {
  toolbar: [
    ["bold", "italic", "underline", "strike", "blockquote"],
    ["link"],
    ["clean"],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
}

export default function InputReleaseAbout({ about, setAbout }) {
  return (
    <>
      <label htmlFor="about" className="label">
        About this release
      </label>

      <QuillNoSSRWrapper
        modules={modules}
        theme="snow"
        value={about}
        onChange={setAbout}
      />
    </>
  )
}
