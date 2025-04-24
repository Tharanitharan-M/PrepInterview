import React, { useState } from "react";
import {FormControl, FormItem, FormLabel, FormMessage} from '@/components/ui/form'
import { Input } from "./ui/input";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { cn } from "@/lib/utils";

interface FormFieldProp<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label: string;
    placeholder: string;
    type?: "text" | "email" | "password" | 'file';
    formType?: "sign-in" | "sign-up";
}

interface PasswordRequirement {
  label: string;
  regex: RegExp;
}

const passwordRequirements: PasswordRequirement[] = [
  { label: "8 characters", regex: /.{8,}/ },
  { label: "One uppercase letter", regex: /[A-Z]/ },
  { label: "One lowercase letter", regex: /[a-z]/ },
  { label: "One number", regex: /[0-9]/ },
  { label: "One special character", regex: /[^A-Za-z0-9]/ },
];

const PasswordRequirementsList = ({ password }: { password: string }) => {
  return (
    <div className="text-xs text-muted-foreground space-y-2 mt-2">
      <span className="font-medium">Password must contain:</span>
      <ul className="space-y-1 mt-1">
        {passwordRequirements.map((req, index) => {
          const isValid = req.regex.test(password);
          return (
            <li 
              key={index} 
              className={cn(
                "flex items-center gap-2 transition-colors",
                isValid ? "text-green-500" : "text-muted-foreground"
              )}
            >
              <span>{isValid ? "✓" : "○"}</span>
              {req.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const FormField = <T extends FieldValues>({
  control, 
  name, 
  label, 
  placeholder, 
  type="text",
  formType
}: FormFieldProp<T>) => {
  const [passwordValue, setPasswordValue] = useState("");

  return <Controller name={name} control={control} render={({ field }) => (
    <FormItem>
      <FormLabel className="label">{label}</FormLabel>
      <FormControl>
        <Input 
          className="input" 
          placeholder={placeholder} 
          type={type} 
          {...field} 
          onChange={(e) => {
            field.onChange(e);
            if (type === "password") {
              setPasswordValue(e.target.value);
            }
          }}
        />
      </FormControl>
      {type === "password" && formType === "sign-up" && (
        <PasswordRequirementsList password={passwordValue} />
      )}
      <FormMessage />
    </FormItem>
  )}
  />
};

export default FormField;