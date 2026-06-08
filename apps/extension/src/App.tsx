import "./App.css";

function App() {
  const handleFile = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const pdf = e.target?.result as string;
      };
    }
  };

  return (
    <>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </>
  );
}

export default App;
