import { SpeakerphoneIcon, XIcon } from '@heroicons/react/outline';

interface BannerProps {
  onAction?: () => void;
  onClose?: () => void;
  message: string;
}

const Banner = ({ onAction, onClose, message }: BannerProps) => {
  return (
    <>
      <div className="bg-primary">
        <div className="max-w-7xl mx-auto py-1 px-3 sm:px-6 lg:px-8">
          <div className="flex items-center flex-wrap">
            <div className="flex items-center mx-auto">
              <span className="flex p-2 rounded-lg bg-indigo-800">
                <SpeakerphoneIcon
                  className="h-6 w-6 text-white"
                  aria-hidden="true"
                />
              </span>
              <p className="ml-3 font-medium text-white">
                <span className="text-sm">{message}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Banner;
