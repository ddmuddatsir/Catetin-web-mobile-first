"use client";

import { useEffect, useState } from "react";

export default function PWAStatus() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Check if app is installed
    const checkInstalled = () => {
      if (window.matchMedia("(display-mode: standalone)").matches) {
        setIsInstalled(true);
      }
    };

    // Check online status
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    checkInstalled();
    updateOnlineStatus();

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  if (!isOnline) {
    return (
      <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-2 text-sm z-50">
        📵 You are offline. Some features may not work.
      </div>
    );
  }

  if (isInstalled) {
    return (
      <div className="fixed top-0 left-0 right-0 bg-green-500 text-white text-center py-1 text-xs z-50">
        📱 App installed successfully!
      </div>
    );
  }

  return null;
}
