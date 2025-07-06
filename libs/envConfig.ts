const envConfig = {
  apiUrl: () => {
    const value = process.env.NEXT_PUBLIC_API_URL;
    if (!value) throw new Error("NEXT_PUBLIC_API_URL is required");
    return value;
  },
};

export { envConfig };
