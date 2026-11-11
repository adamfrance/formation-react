import { useState } from "react";
import type { ChangeEvent, FocusEvent, SubmitEvent } from "react";
import type { Collaborator } from "../types.ts";

interface NewCollaboratorFormProps {
  departments: string[];
  onAdd: (collaborator: Collaborator) => void;
}

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  title: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

const EMPTY: FormValues = {
  firstName: "",
  lastName: "",
  email: "",
  department: "",
  title: "",
};

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (values.firstName.trim().length < 2)
    errors.firstName = "Au moins 2 caractères";
  if (values.lastName.trim().length < 2)
    errors.lastName = "Au moins 2 caractères";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    errors.email = "Format d'e-mail invalide";
  if (values.department === "") errors.department = "Choisissez un service";
  if (values.title.trim() === "") errors.title = "Indiquez le poste";
  return errors;
}

function NewCollaboratorForm({ departments, onAdd }: NewCollaboratorFormProps) {
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [touched, setTouched] = useState<
    Partial<Record<keyof FormValues, boolean>>
  >({});
  const [message, setMessage] = useState("");

  const errors = validate(values);
  const isValid = Object.keys(errors).length === 0;

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setMessage("");
  };

  const handleBlur = (
    event: FocusEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    onAdd({
      id: Date.now(),
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      phone: "",
      image: "",
      role: "user",
      company: { department: values.department, title: values.title.trim() },
      address: { city: "", country: "" },
    });
    setMessage(
      `${values.firstName.trim()} ${values.lastName.trim()} a rejoint l'annuaire.`,
    );
    setValues(EMPTY);
    setTouched({});
  };

  const errorOf = (field: keyof FormValues) =>
    touched[field] && errors[field] ? (
      <span className="field-error">{errors[field]}</span>
    ) : null;

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="firstName">Prénom</label>
        <input
          id="firstName"
          name="firstName"
          value={values.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errorOf("firstName")}
      </div>
      <div className="field">
        <label htmlFor="lastName">Nom</label>
        <input
          id="lastName"
          name="lastName"
          value={values.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errorOf("lastName")}
      </div>
      <div className="field">
        <label htmlFor="email">E-mail</label>
        <input
          id="email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errorOf("email")}
      </div>
      <div className="field">
        <label htmlFor="department">Service</label>
        <select
          id="department"
          name="department"
          value={values.department}
          onChange={handleChange}
          onBlur={handleBlur}
        >
          <option value="">Choisir…</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        {errorOf("department")}
      </div>
      <div className="field">
        <label htmlFor="title">Poste</label>
        <input
          id="title"
          name="title"
          value={values.title}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errorOf("title")}
      </div>
      <button type="submit" className="btn btn-primary" disabled={!isValid}>
        Ajouter à l'annuaire
      </button>
      {message && (
        <p className="form-success" role="status">
          {message}
        </p>
      )}
    </form>
  );
}

export default NewCollaboratorForm;
