import { useForm } from 'react-hook-form';
import { useValidators } from '../../hooks/useValidators';
import TextInput from '../../components/UI/Public/Inputs/TextInput';
import TextAreaInput from '../../components/UI/Public/Inputs/TextAreaInput';

interface FormData {
  email: string;
  message: string;
}

const FormTestPage = () => {
  const { required, EmailPattern, minLength, maxLength } = useValidators();

  const {
    register,
    unregister,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Test Form</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <TextInput
              id="email"
              label="Email"
              type="email"
              placeholder="your@email.com"
              register={() =>
                register('email', {
                  ...required(),
                  ...EmailPattern()
                })
              }
              unregister={unregister}
              error={errors.email}
              info="Enter a valid email address"
            />
          </div>

          <div>
            <TextAreaInput
              id="message"
              label="Message"
              placeholder="Enter your message here..."
              register={() =>
                register('message', {
                  ...required(),
                  ...minLength(50),
                  ...maxLength(500)
                })
              }
              rows={7}
              unregister={unregister}
              error={errors.message}
              note="Minimum 50 characters, maximum 500 characters"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              Submit
            </button>
          </div>

          {Object.keys(errors).length > 0 && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <h3 className="text-sm font-medium text-red-800 mb-2">
                Form Errors:
              </h3>
              <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                {errors.email && (
                  <li>Email: {`${errors?.email.message || ''}`}</li>
                )}
                {errors.message && (
                  <li>Message: {`${errors?.message.message || ''}`}</li>
                )}
              </ul>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default FormTestPage;
