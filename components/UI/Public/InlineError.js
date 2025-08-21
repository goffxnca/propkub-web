/* This example requires Tailwind CSS v2.0+ */
import { ExclamationIcon } from '@heroicons/react/solid';
import { useEffect } from 'react';

const InlineError = ({ title, messages, closeAfterMS, onClose }) => {
  let timer;
  //   useEffect(() => {
  //     if (closeAfterMS && onClose) {
  //       timer = setTimeout(() => {
  //         onClose();
  //       }, closeAfterMS);
  //     }
  //     return () => {
  //       clearTimeout(timer);
  //     };
  //   }, []);

  return (
    <div className="relative">
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <ExclamationIcon
              className="h-5 w-5 text-red-400"
              aria-hidden="true"
            />
          </div>
          <div className="ml-3 text-left">
            <h3 className="text-sm font-medium text-red-800">{title}</h3>
            <div className="mt-2 text-sm text-red-700">
              <ul role="list" className="list-disc pl-5 space-y-1">
                {messages.map((message) => (
                  <li key={message}>
                    <div style={{ overflowWrap: 'anywhere' }}>{message}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div
        className="absolute top-0 right-2 cursor-pointer text-gray-500"
        onClick={onClose}
      >
        x
      </div>
    </div>
  );
};

export default InlineError;
