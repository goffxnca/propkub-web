import CheckboxInput from '../../UI/Public/Inputs/CheckboxInput';
import { useTranslation } from '../../../hooks/useTranslation';
import { useValidators } from '../../../hooks/useValidators';

const ConfirmSection = ({ register, unregister, errors }) => {
  const { t } = useTranslation('pages/post-form');
  const { required } = useValidators();

  return (
    <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            {t('sections.confirm.title')}
          </h3>
        </div>

        <div className="mt-5 space-y-6 md:mt-0 md:col-span-2">
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6">
              <CheckboxInput
                id="accept"
                label={t('fields.accept.label')}
                register={() =>
                  register('accept', {
                    ...required()
                  })
                }
                unregister={unregister}
                error={errors.accept}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmSection;
