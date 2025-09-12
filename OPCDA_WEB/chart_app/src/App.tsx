import { Routes, Route } from "react-router-dom";
import Navigation from "./components/ui/Navigation/Navigation";
import OverviewPage from "./components/ui/OverviewPage";
import SettingsPage from "./components/ui/SettingsPage";
import "./App.scss"

const App = () => {
  return (
    <div className="app">
      <Navigation />
      <div className="app-content">
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
