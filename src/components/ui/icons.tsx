/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { 
  Mail, 
  Type, 
  AlignLeft, 
  List, 
  CheckSquare, 
  CircleCheck, 
  Send,
  Trash,
  Plus,
  X,
  Settings,
  Save,
  Edit,
  Copy,
  Eye,
  ArrowRight,
  MoveVertical,
  AlertCircle,
  CheckCircle2,
  Loader2,
  FormInput,
  LayoutList
} from "lucide-react";
import { FieldType } from "@/types/forms";

export const FieldIcons = {
  [FieldType.TEXT]: Type,
  [FieldType.EMAIL]: Mail,
  [FieldType.TEXTAREA]: AlignLeft,
  [FieldType.SELECT]: List,
  [FieldType.CHECKBOX]: CheckSquare,
  [FieldType.RADIO]: CircleCheck,
  [FieldType.SUBMIT]: Send,
};

export {
  Mail,
  Type,
  AlignLeft,
  List,
  CheckSquare,
  CircleCheck,
  Send,
  Trash,
  Plus,
  X,
  Settings,
  Save,
  Edit,
  Copy,
  Eye,
  ArrowRight,
  MoveVertical,
  AlertCircle,
  CheckCircle2,
  Loader2,
  FormInput,
  LayoutList
};