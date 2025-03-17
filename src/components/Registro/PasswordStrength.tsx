import { useState, useEffect } from "react";
import { ProgressBar } from "primereact/progressbar";

interface PasswordStrengthProps {
  password: string;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const [strength, setStrength] = useState(0);
  const [label, setLabel] = useState("Débil");
  const [color, setColor] = useState("red");

  useEffect(() => {
    let score = 0;
    if (password.length >= 6) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    setStrength((score / 4) * 100);

    switch (score) {
      case 0:
      case 1:
        setLabel("Débil");
        setColor("red");
        break;
      case 2:
        setLabel("Regular");
        setColor("orange");
        break;
      case 3:
        setLabel("Fuerte");
        setColor("green");
        break;
      case 4:
        setLabel("Muy Fuerte");
        setColor("blue");
        break;
    }
  }, [password]);

  return (
    <div>
      <ProgressBar value={strength} color={color} />
      <p style={{ color, fontWeight: "bold" }}>{label}</p>
    </div>
  );
};

export default PasswordStrength;
