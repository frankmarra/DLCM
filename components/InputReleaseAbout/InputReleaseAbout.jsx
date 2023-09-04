import dynamic from "next/dynamic"
import "react-quill/dist/quill.snow.css"

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
})

const modules = {
  toolbar: [["bold", "italic", "underline", "strike"], ["link"], ["clean"]],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
}

const formats = ["bold", "italic", "underline", "strike", "link"]

export default function InputReleaseAbout({ about, setAbout }) {
  return (
    <>
      <label htmlFor="about" className="label">
        About this release
      </label>
      <style>
        {`
          .ql-container {
            font: inherit;
            border-radius: 0 0 var(--radius-1) var(--radius-1);
          }

          .ql-toolbar {
            border-radius: var(--radius-1) var(--radius-1) 0 0;
          }

          .ql-toolbar.ql-snow,
          .ql-container.ql-snow {
            border: var(--border-size-1) solid var(--surface-4);
            box-shadow: var(--shadow-1);
          }

          .ql-snow .ql-fill,
          .ql-snow .ql-stroke.ql-fill {
            fill: currentColor !important;
          }

          .ql-snow .ql-stroke {
            stroke: currentColor !important;
            fill: none !important;
          }

          .ql-snow.ql-toolbar button:hover, .ql-snow .ql-toolbar button:hover, .ql-snow.ql-toolbar button:focus, .ql-snow .ql-toolbar button:focus, .ql-snow.ql-toolbar button.ql-active, .ql-snow .ql-toolbar button.ql-active, .ql-snow.ql-toolbar .ql-picker-label:hover, .ql-snow .ql-toolbar .ql-picker-label:hover, .ql-snow.ql-toolbar .ql-picker-label.ql-active, .ql-snow .ql-toolbar .ql-picker-label.ql-active, .ql-snow.ql-toolbar .ql-picker-item:hover, .ql-snow .ql-toolbar .ql-picker-item:hover, .ql-snow.ql-toolbar .ql-picker-item.ql-selected, .ql-snow .ql-toolbar .ql-picker-item.ql-selected {
            color: var(--text-2);
          }
        `}
      </style>

      <QuillNoSSRWrapper
        modules={modules}
        theme="snow"
        value={about}
        onChange={setAbout}
        formats={formats}
      />
    </>
  )
}
