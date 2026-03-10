import { useState, useEffect } from 'react';

export function useInstallPrompt() {
  const [prompt, setPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const install = async () => {
    if (!prompt) return;

    // Show the native install prompt
    prompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await prompt.userChoice;

    // The prompt can only be used once, so we clear it
    setPrompt(null);
    setIsInstallable(false);

    return outcome;
  };

  const dismiss = () => {
    // Manually hide for this session
    setIsInstallable(false);
  };

  return { isInstallable, install, dismiss };
}