import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert } from "../components/Alert";
import { Button } from "../components/Button";
import { CategoryPicker } from "../components/CategoryPicker";
import { FormField } from "../components/FormField";
import { ImageUpload } from "../components/ImageUpload";
import { SelectField } from "../components/SelectField";
import { TextAreaField } from "../components/TextAreaField";
import { ApiError } from "../lib/api";
import { ALLOWED_IMAGE_TYPES, COUNTIES, MAX_IMAGE_BYTES, type Category } from "../lib/constants";
import { requestsApi } from "../lib/requestsApi";
import { buttonStyles } from "../lib/ui";
import { validateRequest } from "../lib/validators";

interface FormValues {
  category: Category | "";
  county: string;
  area: string;
  address: string;
  description: string;
}

const initialValues: FormValues = { category: "", county: "", area: "", address: "", description: "" };

export default function NewRequestPage() {
  const navigate = useNavigate();

  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState("");

  const setField = (name: keyof FormValues, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // clear that field's error as the user fixes it
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setField(e.target.name as keyof FormValues, e.target.value);

  const handleImageSelect = async (file: File) => {
    setImageError("");

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setImageError("Use a JPEG, PNG or WebP image");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setImageError("Image must be 5 MB or smaller");
      return;
    }

    setUploading(true);
    try {
      const res = await requestsApi.uploadImage(file);
      setImageUrl(res.imageUrl);
    } catch (err) {
      setImageError(err instanceof ApiError ? err.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");

    const found = validateRequest(values);
    setErrors(found);
    if (Object.keys(found).length > 0 || values.category === "") return;

    setSubmitting(true);
    try {
      const res = await requestsApi.create({
        category: values.category,
        location: {
          county: values.county,
          area: values.area.trim(),
          address: values.address.trim() || undefined,
        },
        description: values.description.trim(),
        imageUrl: imageUrl || undefined,
      });
      navigate(`/requests/${res.request._id}`, { replace: true, state: { justCreated: true } });
    } catch (err) {
      if (err instanceof ApiError) {
        // The API reports "location.county"; the form calls it "county"
        const mapped = Object.fromEntries(
          Object.entries(err.fieldErrors).map(([field, message]) => [field.replace("location.", ""), message])
        );
        setErrors(mapped);
        setFormError(Object.keys(mapped).length > 0 ? "Please fix the highlighted fields" : err.message);
      } else {
        setFormError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link to="/dashboard" className="text-sm font-medium text-brand-700 hover:underline">
        ← My requests
      </Link>
      <h1 className="mt-3 text-2xl font-bold">Report an issue</h1>
      <p className="text-sm text-slate-600">Tell us what is wrong and where, and we will track it for you.</p>

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        {formError && <Alert message={formError} />}

        <CategoryPicker value={values.category} onChange={(category) => setField("category", category)} error={errors.category} />

        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            label="County"
            name="county"
            placeholder="Select a county"
            options={COUNTIES}
            value={values.county}
            onChange={handleChange}
            error={errors.county}
          />
          <FormField
            label="Area or neighbourhood"
            name="area"
            placeholder="e.g. Kilimani"
            value={values.area}
            onChange={handleChange}
            error={errors.area}
          />
        </div>

        <FormField
          label="Street or landmark (optional)"
          name="address"
          placeholder="e.g. Argwings Kodhek Rd, near the junction"
          value={values.address}
          onChange={handleChange}
          error={errors.address}
        />

        <TextAreaField
          label="Describe the problem"
          name="description"
          maxLength={1000}
          placeholder="What is wrong, and for how long?"
          value={values.description}
          onChange={handleChange}
          error={errors.description}
        />

        <ImageUpload
          imageUrl={imageUrl}
          uploading={uploading}
          error={imageError}
          onSelect={handleImageSelect}
          onRemove={() => setImageUrl("")}
        />

        <div className="flex flex-wrap gap-3">
          <Button type="submit" loading={submitting} disabled={uploading}>
            {submitting ? "Submitting..." : "Submit request"}
          </Button>
          <Link to="/dashboard" className={buttonStyles.secondary}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}