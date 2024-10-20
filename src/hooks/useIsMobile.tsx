"use client";
import { useEffect, useState } from "react";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Only run the check when window and navigator are available (i.e., client-side)
    if (typeof window !== "undefined") {
      const regex =
        /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      setIsMobile(regex.test(navigator.userAgent));
    }
  }, []); // Run only on mount

  return isMobile;
}

export default useIsMobile;
