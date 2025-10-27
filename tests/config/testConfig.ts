const testConfig = {
  email: () => {
    const value = process.env.E2E_TEST_EMAIL;
    if (!value) {
      throw new Error('E2E_TEST_EMAIL environment variable is required');
    }
    return value;
  },
  password: () => {
    const value = process.env.E2E_TEST_PASSWORD;
    if (!value) {
      throw new Error('E2E_TEST_PASSWORD environment variable is required');
    }
    return value;
  }
};

export { testConfig };
