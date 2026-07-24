declare global {
  interface Window {
    google?: {
      translate?: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        TranslateElement?: any;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

export {};
