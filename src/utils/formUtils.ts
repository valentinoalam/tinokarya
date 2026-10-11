/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";
import { Field, FieldType, FormSchema } from "@/types/forms";

/**
 * Converts a form definition to a Zod schema for validation
 */
export function buildValidationSchema(fields: Field[]) {
  const schema: Record<string, any> = {};

  fields.forEach((field) => {
    if (field.type === FieldType.SUBMIT) return;
    
    let fieldSchema: z.ZodType<any> = z.string();
    
    // Add specific validation based on field type
    if (field.type === FieldType.EMAIL) {
      fieldSchema = z.string().email("Please enter a valid email address");
    } else if (field.type === FieldType.CHECKBOX) {
      fieldSchema = z.array(z.string()).min(1, "Please select at least one option");
    } else if (field.type === FieldType.TEXTAREA) {
      fieldSchema = z.string();
    } else if (field.type === FieldType.RADIO || field.type === FieldType.SELECT) {
      fieldSchema = z.string();
    }
    
    // Add required validation if needed
    if (field.required) {
      // Check if the schema is a string or an array before applying .min()
      if (fieldSchema instanceof z.ZodString) {
        fieldSchema = fieldSchema.min(1, { message: `${field.label} is required.` });
      }
    }
    
    schema[field.name] = fieldSchema;
  });

  return z.object(schema);
}

/**
 * Creates a new field with default values based on the field type
 */
export function createNewField(type: Field["type"], existingFields: Field[]): Field {
  const fieldCount = existingFields.length;
  const id = `field_${Date.now()}`;
  const name = `field_${fieldCount + 1}`;
  
  const baseField = {
    id,
    name,
    label: `Field ${fieldCount + 1}`,
    required: false,
    placeholder: "",
  };

  switch (type) {
    case FieldType.TEXT:
      return {
        ...baseField,
        type: FieldType.TEXT,
      };
    case FieldType.EMAIL:
      return {
        ...baseField,
        type: FieldType.EMAIL,
        label: "Email",
        name: "email",
        placeholder: "Enter your email",
      };
    case FieldType.TEXTAREA:
      return {
        ...baseField,
        type: FieldType.TEXTAREA,
        rows: 4,
      };
    case FieldType.SELECT:
      return {
        ...baseField,
        type: FieldType.SELECT,
        options: [
          { label: "Option 1", value: "option_1" },
          { label: "Option 2", value: "option_2" },
        ],
      };
    case FieldType.CHECKBOX:
      return {
        ...baseField,
        type: FieldType.CHECKBOX,
        options: [
          { label: "Option 1", value: "option_1" },
          { label: "Option 2", value: "option_2" },
        ],
      };
    case FieldType.RADIO:
      return {
        ...baseField,
        type: FieldType.RADIO,
        options: [
          { label: "Option 1", value: "option_1" },
          { label: "Option 2", value: "option_2" },
        ],
      };
    case FieldType.SUBMIT:
      return {
        ...baseField,
        type: FieldType.SUBMIT,
        label: "Submit",
        name: "submit",
      };
    default:
      return {
        ...baseField,
        type: FieldType.TEXT,
      };
  }
}

/**
 * Validates the form definition
 */
export function validateForm(form: any) {
  const result = FormSchema.safeParse(form);
  return result;
}

/**
 * Gets a readable field type name
 */
export function getFieldTypeName(type: Field["type"]): string {
  switch (type) {
    case FieldType.TEXT:
      return "Text";
    case FieldType.EMAIL:
      return "Email";
    case FieldType.TEXTAREA:
      return "Textarea";
    case FieldType.SELECT:
      return "Dropdown";
    case FieldType.CHECKBOX:
      return "Checkbox Group";
    case FieldType.RADIO:
      return "Radio Group";
    case FieldType.SUBMIT:
      return "Submit Button";
    default:
      return "Unknown";
  }
}