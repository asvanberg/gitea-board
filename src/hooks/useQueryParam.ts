import React from "react";

export default function useQueryParam(
  param: string,
  defaultValue: () => string,
): [string, (value: string) => void] {
  const [value, internalSetValue] = React.useState(() => {
    const url = new URL(window.location.href);
    return url.searchParams.get(param) ?? defaultValue();
  });

  const setValue = (newValue: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set(param, newValue);
    window.history.replaceState(null, "", url);
    internalSetValue(newValue);
  };
  return [value, setValue];
}
