import { useEffect } from "react";

const DEFAULT_TITLE = "Better.Schedule";

export const usePageTitle = (title:string) => {
  useEffect(() => {
    document.title = title;
    return () => { document.title = DEFAULT_TITLE; };
  }, [title]);
};
