import { useState, useEffect } from "react";
import { ProgressBar } from "primereact/progressbar";

interface PasswordStrengthProps {
  password: string;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const [strength, setStrength] = useState(0);
  const [label, setLabel] = useState("Débil");
  const [color, setColor] = useState<string>("red");

  useEffect(() => {
    if (!password) {
      setStrength(0);
      setLabel("Débil");
      setColor("red");
      return;
    }

    let score = 0;
    if (password.length >= 6) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    const percentage = (score / 4) * 100;
    setStrength(percentage);

    switch (score) {
      case 0:
      case 1:
        setLabel("Débil");
        setColor("#d32f2f"); // Rojo fuerte
        break;
      case 2:
        setLabel("Regular");
        setColor("#f57c00"); // Naranja
        break;
      case 3:
        setLabel("Fuerte");
        setColor("#388e3c"); // Verde
        break;
      case 4:
        setLabel("Muy Fuerte");
        setColor("#1976d2"); // Azul
        break;
    }
  }, [password]);

  return (
    <div style={{ marginTop: "0.5rem" }}>
      <label style={{ fontWeight: "bold" }}>Seguridad de la contraseña:</label>
      <ProgressBar value={strength} style={{ height: "20px", backgroundColor: "#ddd" }} />
      <p style={{ color, fontWeight: "bold", marginTop: "0.2rem" }}>{label}</p>
    </div>
  );
};

export default PasswordStrength;
