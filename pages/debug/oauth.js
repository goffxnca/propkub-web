import { useRouter } from "next/router";

const DebugOAuth = () => {
  const router = useRouter();

  const testScenarios = [
    {
      label: "Test OAuth Failed",
      url: "/auth/callback?error=oauth_failed",
      description: "Test OAuth failure"
    },
    {
      label: "Test OAuth Cancel",
      url: "/auth/callback?error=oauth_cancelled&provider=facebook",
      description: "Test user cancel oauth"
    },
    {
      label: "Test Email Mismatch (Linking)",
      url: "/auth/callback?error=email_mismatch&expectedEmail=user@example.com&provider=google",
      description: "Test linking failure due to email mismatch"
    },
    {
      label: "Test Linking Failed",
      url: "/auth/callback?error=linking_failed",
      description: "Test general linking failure"
    },
    {
      label: "Test Already Linked",
      url: "/auth/callback?error=already_linked&provider=google",
      description: "Test error when account is already linked"
    }
  ];

  const handleTest = (url) => {
    router.push(url);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          OAuth Testing Page
        </h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">Test OAuth Scenarios</h2>
          
          <div className="space-y-4">
            {testScenarios.map((scenario, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{scenario.label}</h3>
                    <p className="text-sm text-gray-600 mt-1">{scenario.description}</p>
                    <code className="text-xs text-gray-500 mt-2 block">{scenario.url}</code>
                  </div>
                  <button
                    onClick={() => handleTest(scenario.url)}
                    className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
                  >
                    Test
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 pt-6 border-t">
            <h3 className="font-medium text-gray-900 mb-4">Real OAuth Testing</h3>
            <div className="space-y-2">
              <button
                onClick={() => window.location.href = 'http://localhost:3000/auth/google'}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Test Real Google OAuth
              </button>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              onClick={() => router.push('/login')}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugOAuth; 