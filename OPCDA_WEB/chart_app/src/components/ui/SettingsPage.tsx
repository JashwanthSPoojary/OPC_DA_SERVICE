import React, { Suspense } from "react";

const RemoteApp = React.lazy(() => import("settings_app/App"));

const SettingsPage = () => {
  return (
    <Suspense fallback={<div>Loading Settings...</div>}>
      <RemoteApp />
    </Suspense>
  );
};

export default SettingsPage;
