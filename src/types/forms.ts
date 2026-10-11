import { z } from "zod";

// Field types
export const FieldType = {
  TEXT: "text",
  EMAIL: "email",
  TEXTAREA: "textarea",
  SELECT: "select",
  CHECKBOX: "checkbox",
  RADIO: "radio",
  SUBMIT: "submit",
} as const;

export type FieldTypeValue = typeof FieldType[keyof typeof FieldType];

// Base field schema
export const BaseFieldSchema = z.object({
  id: z.string(),
  type: z.enum([
    FieldType.TEXT,
    FieldType.EMAIL,
    FieldType.TEXTAREA,
    FieldType.SELECT,
    FieldType.CHECKBOX,
    FieldType.RADIO,
    FieldType.SUBMIT,
  ]),
  label: z.string(),
  name: z.string(),
  required: z.boolean().default(false),
  placeholder: z.string().optional(),
});

// Text field schema
export const TextFieldSchema = BaseFieldSchema.extend({
  type: z.literal(FieldType.TEXT),
});

// Email field schema
export const EmailFieldSchema = BaseFieldSchema.extend({
  type: z.literal(FieldType.EMAIL),
});

// Textarea field schema
export const TextareaFieldSchema = BaseFieldSchema.extend({
  type: z.literal(FieldType.TEXTAREA),
  rows: z.number().default(4),
});

// Options-based field schemas
export const OptionsFieldSchema = BaseFieldSchema.extend({
  options: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    })
  ),
});

export const SelectFieldSchema = OptionsFieldSchema.extend({
  type: z.literal(FieldType.SELECT),
});

export const CheckboxFieldSchema = OptionsFieldSchema.extend({
  type: z.literal(FieldType.CHECKBOX),
});

export const RadioFieldSchema = OptionsFieldSchema.extend({
  type: z.literal(FieldType.RADIO),
});

// Submit button schema
export const SubmitFieldSchema = BaseFieldSchema.extend({
  type: z.literal(FieldType.SUBMIT),
  label: z.string().default("Submit"),
});

// Combined field schema
export const FieldSchema = z.discriminatedUnion("type", [
  TextFieldSchema,
  EmailFieldSchema,
  TextareaFieldSchema,
  SelectFieldSchema,
  CheckboxFieldSchema,
  RadioFieldSchema,
  SubmitFieldSchema,
]);

export type Field = z.infer<typeof FieldSchema>;
export type TextField = z.infer<typeof TextFieldSchema>;
export type EmailField = z.infer<typeof EmailFieldSchema>;
export type TextareaField = z.infer<typeof TextareaFieldSchema>;
export type SelectField = z.infer<typeof SelectFieldSchema>;
export type CheckboxField = z.infer<typeof CheckboxFieldSchema>;
export type RadioField = z.infer<typeof RadioFieldSchema>;
export type SubmitField = z.infer<typeof SubmitFieldSchema>;

// Form schema
export const FormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Form name is required"),
  description: z.string().optional(),
  recipientEmail: z.string().email("Invalid email address"),
  fields: z.array(FieldSchema).min(1, "Form must have at least one field"),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Form = z.infer<typeof FormSchema>;

// Form submission schema
export const FormSubmissionSchema = z.object({
  formId: z.string(),
  data: z.record(z.string(), z.union([z.string(), z.array(z.string())])),
  submittedAt: z.date().optional(),
});

export type FormSubmission = z.infer<typeof FormSubmissionSchema>;