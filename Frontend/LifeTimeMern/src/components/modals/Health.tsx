import { useState } from "react";
import API from "../../api/api";

const HealthModal = ({ onClose, onSave }) => {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [risk, setRisk] = useState("");

  const calculateBMI = (w, h) => {
    if (!w || !h) return null;
    const heightMeters = h / 100;
    return (w / (heightMeters * heightMeters)).toFixed(1);
  };

  const determineRisk = (bmi) => {
    if (bmi < 18.5) return "Low"; // Underweight
    if (bmi < 25) return "Low"; // Normal weight
    if (bmi < 30) return "Medium"; // Overweight
    return "High"; // Obese
  };

  const handleInputChange = (setter) => (e) => {
    const value = parseFloat(e.target.value) || "";
    setter(value);

    if (weight && height) {
      const calculatedBmi = calculateBMI(weight, height);
      setBmi(calculatedBmi);
      setRisk(calculatedBmi ? determineRisk(calculatedBmi) : "");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bmi) return;

    try {
      await API.post("/health", { weight, height, bmi, riskOfSickness: risk });

      onSave(); // Refresh data
      onClose();
    } catch (error) {
      console.error("Error logging health data:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Log Health Status</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label>
            Weight (kg):
            <input
              type="number"
              value={weight}
              onChange={handleInputChange(setWeight)}
              className="border p-2 w-full"
              required
            />
          </label>

          <label>
            Height (cm):
            <input
              type="number"
              value={height}
              onChange={handleInputChange(setHeight)}
              className="border p-2 w-full"
              required
            />
          </label>

          {/* Display calculated BMI and risk */}
          {bmi && (
            <div className="mt-2 p-2 bg-gray-100 rounded">
              <p><strong>BMI:</strong> {bmi}</p>
              <p><strong>Risk of Sickness:</strong> {risk}</p>
            </div>
          )}

          <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
            Save
          </button>
          <button type="button" className="bg-gray-500 text-white p-2 rounded-md" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default HealthModal;
