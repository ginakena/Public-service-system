import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert } from "../components/Alert";
import { AuthCard } from "../components/AuthCard";
import { Button } from "../components/Button";
import { FormField } from "../components/FormField";
import { useAuth } from "../hooks/useAuth";
import { ApiError } from "../lib/api";
import { validateRegister, type RegisterValues } from "../lib/validators";

const initialValues: RegisterValues = {
  name: "",
  email: "",
  nationalId: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // clear that field's error as the user fixes it
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");

    const found = validateRegister(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      await register({
        name: values.name.trim(),
        email: values.email.trim(),
        nationalId: values.nationalId.trim(),
        phone: values.phone.trim(),
        password: values.password,
      });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors(err.fieldErrors);
        setFormError(Object.keys(err.fieldErrors).length > 0 ? "Please fix the highlighted fields" : err.message);
      } else {
        setFormError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCard title="Create your account" subtitle="One account to report issues and track their progress.">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {formError && <Alert message={formError} />}
        <FormField label="Full name" name="name" autoComplete="name" value={values.name} onChange={handleChange} error={errors.name} />
        <FormField label="Email" name="email" type="email" autoComplete="email" value={values.email} onChange={handleChange} error={errors.email} />
        <FormField
          label="National ID number"
          name="nationalId"
          inputMode="numeric"
          value={values.nationalId}
          onChange={handleChange}
          error={errors.nationalId}
          hint="7 or 8 digits"
        />
        <FormField
          label="Phone number"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={values.phone}
          onChange={handleChange}
          error={errors.phone}
          hint="e.g. 0712345678"
        />
        <FormField
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          hint="At least 8 characters, with a letter and a number"
        />
        <FormField
          label="Confirm password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={values.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />
        <Button type="submit" loading={submitting} className="w-full">
          {submitting ? "Creating account..." : "Create account"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">
        Already registered?{" "}
        <Link to="/login" className="font-semibold text-brand-700 hover:underline">
          Log in
        </Link>
      </p>
    </AuthCard>
  );
}