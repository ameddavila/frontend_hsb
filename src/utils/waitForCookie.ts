export const waitForCookie = async (
    name: string,
    maxWaitMs = 1000
  ): Promise<string | null> => {
    const interval = 50;
    let waited = 0;
  
    while (waited < maxWaitMs) {
      const cookie = document.cookie.match(
        new RegExp(`(^| )${name}=([^;]+)`)
      )?.[2];
      if (cookie) return cookie;
  
      await new Promise((resolve) => setTimeout(resolve, interval));
      waited += interval;
    }
  
    console.warn(`⏳ Tiempo agotado esperando cookie: ${name}`);
    return null;
  };
  