import { useState } from "react"

export default function InputGenres({ onChange, genres }) {
  const [genreArray, setGenreArray] = useState(genres ?? [])
  const [newGenre, setNewGenre] = useState("")

  const addGenre = () => {
    onChange({
      type: "array-add",
      array: "genres",
      arrayVariables: genres,
      value: newGenre,
    })
    setNewGenre("")
  }

  const removeGenre = (genreToRemove) => {
    onChange({
      type: "array-remove",
      array: "genres",
      arrayVariables: genres,
      value: genreToRemove,
    })
  }
  return (
    <>
      <label className="label" htmlFor="addGenre">
        Add genre:
      </label>
      <input
        className="input"
        id="addGenre"
        type="text"
        value={newGenre}
        onChange={(e) => setNewGenre(e.target.value)}
      />
      <button
        className="button"
        data-variant="primary"
        onClick={() => addGenre()}
      >
        Add
      </button>

      {genres.length ? (
        <>
          <ul role="list">
            Current Genres:
            {genres.map((genre) => (
              <>
                <li key={genre}>{genre}</li>
                <button className="button" onClick={() => removeGenre(genre)}>
                  Remove
                </button>
              </>
            ))}
          </ul>
        </>
      ) : (
        <p>No genres entered</p>
      )}
    </>
  )
}
