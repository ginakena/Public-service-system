import { Spinner } from "./Spinner";

interface ImageUploadProps {
  imageUrl: string;
  uploading: boolean;
  error?: string;
  onSelect: (file: File) => void;
  onRemove: () => void;
}

export function ImageUpload({ imageUrl, uploading, error, onSelect, onRemove }: ImageUploadProps) {
  return (
    <div>
      <span className="mb-1 block text-sm font-medium text-slate-700">
        Photo <span className="font-normal text-slate-500">(optional)</span>
      </span>

      {imageUrl ? (
        <div className="flex items-start gap-3">
          <img src={imageUrl} alt="Selected photo of the issue" className="h-24 w-24 rounded-md border border-slate-200 object-cover" />
          <button type="button" onClick={onRemove} className="text-sm font-semibold text-red-600 hover:underline">
            Remove photo
          </button>
        </div>
      ) : (
        <label
          className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-600 focus-within:ring-2 focus-within:ring-brand-600 ${
            uploading ? "pointer-events-none opacity-60" : "hover:border-brand-600 hover:bg-brand-50"
          }`}
        >
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = ""; // lets the user pick the same file again after removing it
              if (file) onSelect(file);
            }}
          />
          {uploading ? (
            <>
              <Spinner className="h-5 w-5 text-brand-700" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <span className="font-semibold text-brand-700">Choose a photo</span>
              <span className="text-xs">JPEG, PNG or WebP, up to 5 MB</span>
            </>
          )}
        </label>
      )}

      {error && (
        <p role="alert" className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}