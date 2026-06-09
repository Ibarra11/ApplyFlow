import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldLabel } from "./components/ui/field";

export default function App() {
  const handleFile = (file: File | null) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const pdf = e.target?.result as string;
      console.log("Uploaded PDF:", file.name, pdf.length);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-lg font-semibold">ApplyFlow</h1>
      <Field>
        <FieldLabel htmlFor="resume">Resume</FieldLabel>
        <Input id="resume" type="file" accept="application/pdf" />
        <FieldDescription>Select a resume to upload.</FieldDescription>
      </Field>
    </div>
  );
}
