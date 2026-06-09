import { Terminal as TerminalIcon, Upload } from "lucide-react";

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

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleFile(e.target.files?.[0] ?? null);

  return (
    <main className="isolate min-h-dvh bg-yellow-50 font-sans text-neutral-900 antialiased">
      <div className="flex min-h-dvh flex-col justify-center gap-6 p-5">
        <div className="flex w-fit items-center gap-2 border-2 border-neutral-900 bg-lime-300 px-3 py-1">
          <TerminalIcon className="size-4 shrink-0 stroke-neutral-900" />
          <p className="font-mono text-sm font-bold tracking-wide uppercase">ApplyFlow</p>
        </div>
        <h1 className="text-pretty text-3xl font-semibold tracking-tight text-neutral-900">
          Dump your resume here.
        </h1>
        <label
          htmlFor="resume"
          className="group flex cursor-pointer flex-col items-center gap-3 border-2 border-neutral-900 bg-white p-7 text-center shadow-[5px_5px_0_0_#171717] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_#171717]"
        >
          <Upload className="size-7 shrink-0 stroke-neutral-900" />
          <p className="font-mono text-base font-bold tracking-wide text-neutral-900 uppercase">
            Upload PDF
          </p>
          <p className="text-sm font-medium text-neutral-600">Click or drag a file</p>
          <input
            id="resume"
            name="resume"
            type="file"
            accept="application/pdf"
            onChange={onChange}
            className="sr-only"
          />
        </label>
        <button
          type="button"
          className="border-2 border-neutral-900 bg-violet-400 px-4 py-2.5 font-mono text-sm font-bold tracking-wide text-neutral-900 uppercase shadow-[4px_4px_0_0_#171717] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#171717] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
        >
          Parse it →
        </button>
      </div>
    </main>
  );
}
