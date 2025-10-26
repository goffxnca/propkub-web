import { PhoneIcon, MailIcon, CheckIcon } from '@heroicons/react/solid';
import { useForm } from 'react-hook-form';
import { useValidators } from '../../hooks/useValidators';
import TextAreaInput from '../UI/Public/Inputs/TextAreaInput';
import TextInput from '../UI/Public/Inputs/TextInput';
import Button from '../UI/Public/Button';
import { useState } from 'react';
import Modal from '../UI/Public/Modal';
import { useRouter } from 'next/router';
import { useTranslation } from '../../hooks/useTranslation';

const ContactForm = () => {
  const { t } = useTranslation('pages/contact');
  const { t: tCommon } = useTranslation('common');
  const { required, minLength, maxLength, EmailPattern, GenericPhonePattern } =
    useValidators();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const router = useRouter();

  const {
    register,
    unregister,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm();

  const submitHandler = (data) => {
    //TODO: save later
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
      setSent(true);
      clearTimeout(timer);
    }, 3000);
  };

  return (
    <div className="">
      <div className="mx-auto max-w-7xl py-16 px-4 sm:py-24 sm:px-6 lg:px-8 ">
        <div className="relative bg-white shadow-xl rounded-lg">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Contact information */}
            <div className="relative overflow-hidden bg-indigo-700 py-10 px-6 sm:px-10 xl:p-12 rounded-lg">
              <div
                className="pointer-events-none absolute inset-0 sm:hidden"
                aria-hidden="true"
              >
                <svg
                  className="absolute inset-0 h-full w-full"
                  width={343}
                  height={388}
                  viewBox="0 0 343 388"
                  fill="none"
                  preserveAspectRatio="xMidYMid slice"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M-99 461.107L608.107-246l707.103 707.107-707.103 707.103L-99 461.107z"
                    fill="url(#linear1)"
                    fillOpacity=".1"
                  />
                  <defs>
                    <linearGradient
                      id="linear1"
                      x1="254.553"
                      y1="107.554"
                      x2="961.66"
                      y2="814.66"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#fff" />
                      <stop offset={1} stopColor="#fff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div
                className="pointer-events-none absolute top-0 right-0 bottom-0 hidden w-1/2 sm:block lg:hidden"
                aria-hidden="true"
              >
                <svg
                  className="absolute inset-0 h-full w-full"
                  width={359}
                  height={339}
                  viewBox="0 0 359 339"
                  fill="none"
                  preserveAspectRatio="xMidYMid slice"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M-161 382.107L546.107-325l707.103 707.107-707.103 707.103L-161 382.107z"
                    fill="url(#linear2)"
                    fillOpacity=".1"
                  />
                  <defs>
                    <linearGradient
                      id="linear2"
                      x1="192.553"
                      y1="28.553"
                      x2="899.66"
                      y2="735.66"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#fff" />
                      <stop offset={1} stopColor="#fff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div
                className="pointer-events-none absolute top-0 right-0 bottom-0 hidden w-1/2 lg:block"
                aria-hidden="true"
              >
                <svg
                  className="absolute inset-0 h-full w-full"
                  width={160}
                  height={678}
                  viewBox="0 0 160 678"
                  fill="none"
                  preserveAspectRatio="xMidYMid slice"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M-161 679.107L546.107-28l707.103 707.107-707.103 707.103L-161 679.107z"
                    fill="url(#linear3)"
                    fillOpacity=".1"
                  />
                  <defs>
                    <linearGradient
                      id="linear3"
                      x1="192.553"
                      y1="325.553"
                      x2="899.66"
                      y2="1032.66"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#fff" />
                      <stop offset={1} stopColor="#fff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h1 className="text-lg font-medium text-white">
                {t('hero.title')}
              </h1>
              <p className="mt-6 max-w-3xl text-base text-indigo-50">
                {t('hero.subtitle')}
              </p>
              <dl className="mt-8 space-y-6">
                <dt>
                  <span className="sr-only">Phone number</span>
                </dt>
                <dd className="flex text-base text-indigo-50">
                  <PhoneIcon
                    className="h-6 w-6 flex-shrink-0 text-indigo-200"
                    aria-hidden="true"
                  />
                  <span className="ml-3">080-970-3651</span>
                </dd>
                <dt>
                  <span className="sr-only">Email</span>
                </dt>
                <dd className="flex text-base text-indigo-50">
                  <MailIcon
                    className="h-6 w-6 flex-shrink-0 text-indigo-200"
                    aria-hidden="true"
                  />
                  <span className="ml-3">support@propkub.com</span>
                </dd>
                <dt>
                  <span className="sr-only">Line ID</span>
                </dt>
                {/* <dd className="flex text-base text-indigo-50">
                  <ChatIcon
                    className="h-6 w-6 flex-shrink-0 text-indigo-200"
                    aria-hidden="true"
                  />
                  <span className="ml-3">Line: @propkub.com</span>
                </dd>
                <div>
                  <a
                    href="https://line.me/R/ti/p/@propkub.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      src="https://scdn.line-apps.com/n/line_add_friends/btn/th.png"
                      alt="Add PropKub.com as LINE friend"
                      height="36"
                      border="0"
                    />
                  </a>
                </div> */}
              </dl>
              {/* <ul role="list" className="mt-8 flex space-x-12">
                <li>
                  <a className="text-indigo-200 hover:text-indigo-100" href="#">
                    <span className="sr-only">Facebook</span>
                    <svg
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      aria-hidden="true"
                    >
                      <path
                        d="M22.258 1H2.242C1.556 1 1 1.556 1 2.242v20.016c0 .686.556 1.242 1.242 1.242h10.776v-8.713h-2.932V11.39h2.932V8.887c0-2.906 1.775-4.489 4.367-4.489 1.242 0 2.31.093 2.62.134v3.037l-1.797.001c-1.41 0-1.683.67-1.683 1.653v2.168h3.362l-.438 3.396h-2.924V23.5h5.733c.686 0 1.242-.556 1.242-1.242V2.242C23.5 1.556 22.944 1 22.258 1"
                        fill="currentColor"
                      />
                    </svg>
                  </a>
                </li>
                <li>
                  <a className="text-indigo-200 hover:text-indigo-100" href="#">
                    <span className="sr-only">GitHub</span>
                    <svg
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      aria-hidden="true"
                    >
                      <path
                        d="M11.999 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.386.6.11.819-.26.819-.578 0-.284-.01-1.04-.017-2.04-3.337.724-4.042-1.61-4.042-1.61-.545-1.386-1.332-1.755-1.332-1.755-1.09-.744.082-.73.082-.73 1.205.086 1.838 1.238 1.838 1.238 1.07 1.833 2.81 1.304 3.493.996.109-.775.419-1.303.762-1.603C7.145 17 4.343 15.97 4.343 11.373c0-1.31.468-2.382 1.236-3.22-.124-.304-.536-1.524.118-3.176 0 0 1.007-.323 3.3 1.23.956-.266 1.983-.4 3.003-.404 1.02.005 2.046.138 3.005.404 2.29-1.553 3.296-1.23 3.296-1.23.655 1.652.243 2.872.12 3.176.77.838 1.233 1.91 1.233 3.22 0 4.61-2.806 5.624-5.478 5.921.43.37.814 1.103.814 2.223 0 1.603-.015 2.898-.015 3.291 0 .321.217.695.825.578C20.565 21.796 24 17.3 24 12c0-6.627-5.373-12-12.001-12"
                        fill="currentColor"
                      />
                    </svg>
                  </a>
                </li>
                <li>
                  <a className="text-indigo-200 hover:text-indigo-100" href="#">
                    <span className="sr-only">Twitter</span>
                    <svg
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      aria-hidden="true"
                    >
                      <path
                        d="M7.548 22.501c9.056 0 14.01-7.503 14.01-14.01 0-.213 0-.425-.015-.636A10.02 10.02 0 0024 5.305a9.828 9.828 0 01-2.828.776 4.94 4.94 0 002.165-2.724 9.867 9.867 0 01-3.127 1.195 4.929 4.929 0 00-8.391 4.491A13.98 13.98 0 011.67 3.9a4.928 4.928 0 001.525 6.573A4.887 4.887 0 01.96 9.855v.063a4.926 4.926 0 003.95 4.827 4.917 4.917 0 01-2.223.084 4.93 4.93 0 004.6 3.42A9.88 9.88 0 010 20.289a13.941 13.941 0 007.548 2.209"
                        fill="currentColor"
                      />
                    </svg>
                  </a>
                </li>
              </ul> */}
            </div>

            {/* Contact form */}
            <div className="py-10 px-6 sm:px-10 lg:col-span-2 xl:p-12">
              <h2 className="text-lg font-medium text-gray-900">
                {t('form.title')}
              </h2>
              <form
                onSubmit={handleSubmit(submitHandler)}
                className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8"
              >
                <div className="col-span-2 md:col-span-1">
                  <TextInput
                    id="name"
                    label={t('form.fields.name.label')}
                    spacingY={true}
                    register={() =>
                      register('name', {
                        ...required(),
                        ...minLength(8),
                        ...maxLength(30)
                      })
                    }
                    unregister={unregister}
                    error={errors.name}
                  />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <TextInput
                    id="email"
                    label={t('form.fields.email.label')}
                    spacingY={true}
                    register={() =>
                      register('email', {
                        ...required(),
                        ...EmailPattern()
                      })
                    }
                    unregister={unregister}
                    error={errors.email}
                  />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <TextInput
                    id="phone"
                    label={t('form.fields.phone.label')}
                    spacingY={true}
                    register={() =>
                      register('phone', {
                        ...required(),
                        ...GenericPhonePattern()
                      })
                    }
                    unregister={unregister}
                    error={errors.phone}
                  />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <TextInput
                    id="company"
                    label={t('form.fields.company.label')}
                    spacingY={true}
                    register={() =>
                      register('company', {
                        ...minLength(6),
                        ...maxLength(50)
                      })
                    }
                    unregister={unregister}
                    error={errors.company}
                  />
                </div>

                <div className="col-span-2">
                  <TextAreaInput
                    id="message"
                    label={t('form.fields.message.label')}
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
                  />
                </div>

                <div className="col-span-2 w-full md:w-40 ml-auto">
                  <Button
                    type="submit"
                    variant="primary"
                    spacingY={true}
                    loading={loading}
                  >
                    {loading
                      ? tCommon('actions.submitting')
                      : tCommon('actions.submit')}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Modal
        visible={sent}
        title={t('form.success.title')}
        desc={t('form.success.description')}
        buttonCaption={tCommon('buttons.goHome')}
        Icon={CheckIcon}
        onClose={() => {
          router.push('/');
        }}
      />
    </div>
  );
};

export default ContactForm;
