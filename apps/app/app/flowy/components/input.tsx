export function Input() {
  return (
    <div className="relative w-full max-w-96 justify-self-center">
      <label
        htmlFor="comment"
        className="block text-sm/6 font-medium text-gray-900"
      >
        Add your comment
      </label>
      <div className="mt-2">
        <textarea
          placeholder="Write something..."
          name="comment"
          id="comment"
          className="field-sizing-content block w-full resize-none rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none sm:text-sm/6"
          spellCheck="false"
        />
      </div>
    </div>
  );
}
