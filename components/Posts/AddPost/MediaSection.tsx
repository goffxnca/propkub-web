// import { getYoutubeVideoId } from '../../../libs/string-utils';
// import TextInput from '../../UI/Public/Inputs/TextInput';
import UploadImagesInput from '../../UI/Public/Inputs/UploadImagesInput/UploadImagesInput';
import YoutubeIframe from '../../UI/YoutubeIframe';
import { useTranslation } from '../../../hooks/useTranslation';
import {
  ReactHookFormUnRegister,
  ReactHookFormError
} from '../../../types/misc/form';
import type {
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
  FieldErrors
} from 'react-hook-form';

interface MediaSectionProps {
  register: UseFormRegister<any>;
  unregister: ReactHookFormUnRegister;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  errors: FieldErrors<any>;
  submitCount: number;
}

const MediaSection = ({
  register,
  unregister,
  watch,
  setValue,
  errors,
  submitCount
}: MediaSectionProps) => {
  const { t: tForm } = useTranslation('pages/post-form');
  const watchVideo = watch('video');

  const minImages = 3;
  const maxImages = 15;

  return (
    <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            {tForm('sections.media.title')}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {tForm('sections.media.description', {
              min: minImages,
              max: maxImages
            })}
          </p>
        </div>

        <div className="mt-5 space-y-6 md:mt-0 md:col-span-2">
          <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <UploadImagesInput
                id="images"
                label={tForm('fields.images.label')}
                maxFile={maxImages}
                register={() =>
                  register('images', {
                    required: tForm('fields.images.validation.required', {
                      min: minImages,
                      max: maxImages
                    }),
                    validate: (value) => {
                      if (
                        value?.length < minImages ||
                        value?.length > maxImages
                      ) {
                        return tForm('fields.images.validation.count', {
                          min: minImages,
                          max: maxImages
                        });
                      }
                    }
                  })
                }
                unregister={unregister}
                error={errors?.images as ReactHookFormError}
                setValue={setValue}
                submitCount={submitCount}
              />
            </div>
          </div>

          {/* <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="text-center w-full">
              <div className="col-span-6">
                <TextInput
                  id="video"
                  label="วิดีโอ"
                  placeholder="https://www.youtube.com/watch?v=video1"
                  register={() =>
                    register("video", {
                      validate: (inputUrl) => {
                        if (inputUrl) {
                          const youtubeVideoId = getYoutubeVideoId(inputUrl);
                          return youtubeVideoId
                            ? true
                            : "ลิงค์ youtube video ไม่ถูกต้อง";
                        } else {
                          return true;
                        }
                      },
                    })
                  }
                  unregister={unregister}
                  error={errors.video}
                >
                  <p className="text-xs text-gray-500">
                    ถ้าต้องการแสดงวิดีโอบนประกาศ คุณสามารถ Copy ลิงค์วิดีโอจาก
                    youtube มาวางได้
                  </p>
                </TextInput>
              </div>
              <div>
                <YoutubeIframe youtubeUrl={watchVideo} />
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default MediaSection;
