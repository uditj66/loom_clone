"use client";
import React from "react";

const FormField = ({
  id,
  label,
  value,
  type = "text",
  placeholder,
  onChange,
  as = "input",
  options = [],
}: FormFieldProps) => {
  const InputToRender = ({ type }: { type: string }) => {};
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      {as === "textarea" ? (
        <textarea
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      ) : as === "select" ? (
        <select id={id} name={id} value={value} onChange={onChange}>
          {options &&
            options.map(({ value, label }) => (
              <option key={label} value={value}>
                {label}
              </option>
            ))}
        </select>
      ) : (
        <input
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      )}
    </div>
  );
};

export default FormField;
