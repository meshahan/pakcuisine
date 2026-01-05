import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

window.onerror = function (message, source, lineno, colno, error) {
    alert("Error: " + message + "\nSource: " + source + "\nLine: " + lineno);
};

try {
    createRoot(document.getElementById("root")!).render(<App />);
} catch (e) {
    alert("Startup Error: " + e);
}
