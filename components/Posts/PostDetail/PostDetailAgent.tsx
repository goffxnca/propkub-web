import LineIcon from '@/components/Icons/LineIcon';
import Button from '@/components/UI/Button';
import LineBreak from '@/components/UI/LineBreak';
import LinkButton from '@/components/UI/LinkButton';
import { useTranslation } from '@/hooks/useTranslation';
import {
  increaseLineView,
  increasePhoneView
} from '@/libs/managers/postManager';
import { getLineUrl } from '@/libs/string-utils';
import { User } from '@/types/models/user';
import { PhoneIcon } from '@heroicons/react/solid';
import { useState } from 'react';

interface PostDetailAgentProps {
  postId: string;
  postOwner: User;
}

const PostDetailAgent = ({ postId, postOwner }: PostDetailAgentProps) => {
  const { t } = useTranslation('posts');
  const { t: tCommon } = useTranslation('common');
  const [phoneVisible, setPhoneVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePhoneClick = async () => {
    if (phoneVisible) return;

    setIsLoading(true);
    setError('');

    try {
      await increasePhoneView(postId);
      setPhoneVisible(true);
    } catch (error: any) {
      console.error('Failed to increase phone view:', error);
      setError(tCommon('error.generic.description'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLineClick = async () => {
    setIsLoading(true);
    setError('');

    try {
      await increaseLineView(postId);
    } catch (error: any) {
      console.error('Failed to increase line view:', error);
      setError(tCommon('error.generic.description'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <div className="w-20 h-20 overflow-hidden rounded-full border-2 border-gray-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${postOwner.profileImg || '/user.png'}`}
            alt=""
            className="w-full h-full object-cover"
          ></img>
        </div>

        <div className="pt-1">
          <div className="text-lg text-primary font-bold">{postOwner.name}</div>
        </div>
      </div>

      {/* <LineBreak /> */}
      <>
        <LineBreak />
        <div className="flex flex-col">
          <Button
            type="button"
            variant="primary"
            onClick={handlePhoneClick}
            disabled={isLoading}
            loading={isLoading}
            Icon={
              phoneVisible ? (
                <PhoneIcon className="text-white w-6 h-6" />
              ) : undefined
            }
          >
            {phoneVisible ? (
              <a href={`tel:${postOwner.phone}`}>
                {postOwner.phone} ({t('contact.clickToCall')})
              </a>
            ) : isLoading ? (
              tCommon('loading.generic')
            ) : (
              t('contact.showPhone')
            )}
          </Button>

          <LinkButton
            variant="secondary"
            href={getLineUrl(postOwner.line)}
            onClick={handleLineClick}
          >
            <LineIcon className="text-green-500 md:w-6 md:h-6 mr-1" />
            {t('contact.addLine')}
          </LinkButton>

          {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
        </div>
      </>
    </>
  );
};

export default PostDetailAgent;
