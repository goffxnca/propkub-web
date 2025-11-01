import { useForm } from 'react-hook-form';
import { useValidators } from '../../hooks/useValidators';
import TextInput from '../../components/UI/Public/Inputs/TextInput';
import TextAreaInput from '../../components/UI/Public/Inputs/TextAreaInput';
import CheckboxInput from '../../components/UI/Public/Inputs/CheckboxInput';
import CheckboxGroupInput from '../../components/UI/Public/Inputs/CheckboxGroupInput';
import SelectInput from '../../components/UI/Public/Inputs/SelectInput';
import TextWithUnitInput from '../../components/UI/Public/Inputs/TextWithUnitInput';
import RadioVerticalListInput from '../../components/UI/Public/Inputs/RadioVerticalListInput/RadioVerticalListInput';
import UploadImagesInput from '../../components/UI/Public/Inputs/UploadImagesInput/UploadImagesInput';

interface FormData {
  email: string;
  message: string;
  category: string;
  acceptTerms: boolean;
  privacy?: string;
  price?: number;
  priceUnit?: string;
  images?: File[];
  interests?: {
    design?: boolean;
    engineering?: boolean;
    marketing?: boolean;
  };
}

const FormTestPage = () => {
  const { required, EmailPattern, minLength, maxLength, min, max } =
    useValidators();

  const {
    register,
    unregister,
    handleSubmit,
    setValue,
    formState: { errors, submitCount }
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
            <SelectInput
              id="category"
              label="Category"
              options={[
                { id: 'tech', label: 'Technology' },
                { id: 'marketing', label: 'Marketing' }
              ]}
              register={() =>
                register('category', {
                  ...required()
                })
              }
              unregister={unregister}
              error={errors.category}
            />
          </div>

          <div>
            <CheckboxGroupInput
              id="interests"
              groupLabel="Interests"
              items={[
                { id: 'design', label: 'Design' },
                { id: 'engineering', label: 'Engineering' },
                { id: 'marketing', label: 'Marketing' }
              ]}
              register={register}
              unregister={unregister}
              error={errors.interests}
            />
          </div>

          <div>
            <RadioVerticalListInput
              id="privacy"
              label="Privacy Setting"
              items={[
                {
                  id: 'public',
                  name: 'Public',
                  description: 'Everyone can see this content'
                },
                {
                  id: 'private',
                  name: 'Private',
                  description: 'Only you can see this content'
                },
                {
                  id: 'friends',
                  name: 'Friends Only',
                  description: 'Only your friends can see this content'
                }
              ]}
              register={() =>
                register('privacy', {
                  ...required()
                })
              }
              unregister={unregister}
              error={errors.privacy}
              setValue={setValue}
            />
          </div>

          <div>
            <TextWithUnitInput
              id="price"
              unitId="priceUnit"
              unitItems={[
                { id: 'month', label: 'per month' },
                { id: 'year', label: 'per year' }
              ]}
              unitDefaultValues={['year']}
              unitPrefix="/"
              type="number"
              label="Price"
              leadingSlot="฿"
              register={() =>
                register('price', {
                  ...required(),
                  valueAsNumber: true,
                  ...min(1),
                  ...max(100)
                })
              }
              registerUnit={() =>
                register('priceUnit', {
                  ...required()
                })
              }
              unregister={unregister}
              error={errors.price || errors.priceUnit}
              setValue={setValue}
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
                  ...minLength(3),
                  ...maxLength(100)
                })
              }
              rows={7}
              unregister={unregister}
              error={errors.message}
              note="Minimum 50 characters, maximum 500 characters"
            />
          </div>

          <div>
            <CheckboxInput
              id="acceptTerms"
              label="I accept the terms"
              register={() =>
                register('acceptTerms', {
                  ...required()
                })
              }
              unregister={unregister}
              error={errors.acceptTerms}
            />
          </div>

          <div>
            <UploadImagesInput
              id="images"
              label="Upload Images"
              maxFile={3}
              register={() =>
                register('images', {
                  ...required()
                })
              }
              unregister={unregister}
              error={errors.images as any}
              setValue={setValue}
              submitCount={submitCount}
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
                {errors.category && (
                  <li>Category: {`${errors?.category.message || ''}`}</li>
                )}
                {errors.privacy && (
                  <li>Privacy: {`${errors?.privacy.message || ''}`}</li>
                )}
                {errors.price && (
                  <li>Price: {`${errors?.price.message || ''}`}</li>
                )}
                {errors.priceUnit && (
                  <li>Price Unit: {`${errors?.priceUnit.message || ''}`}</li>
                )}
                {errors.acceptTerms && (
                  <li>Terms: {`${errors?.acceptTerms.message || ''}`}</li>
                )}
                {errors.message && (
                  <li>Message: {`${errors?.message.message || ''}`}</li>
                )}
                {errors.images && (
                  <li>Images: {`${errors?.images.message || ''}`}</li>
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
