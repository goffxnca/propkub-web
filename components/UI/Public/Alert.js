import { ExclamationCircleIcon } from "@heroicons/react/solid";

const Alert = ({
  alertTitle = "",
  messages = [],
  showButton = false,
  buttonLabel,
  onClick,
}) => {
  return (
    <div className="rounded-md bg-yellow-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationCircleIcon
            className="h-5 w-5 text-yellow-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">{alertTitle}</h3>
          <div className="mt-2 text-sm text-yellow-700">
            <ul role="list" className="list-disc space-y-1 pl-5">
              {messages.map((msg, index) => (
                <li key={index}>{msg}</li>
              ))}
            </ul>
          </div>
          {showButton && (
            <div className="mt-4">
              <div className="-mx-2 -my-1.5 flex">
                <button
                  type="button"
                  className="rounded-md bg-yellow-200 px-2 py-1.5 text-sm font-medium text-yellow-800 hover:bg-yellow-300"
                  onClick={onClick}
                >
                  {buttonLabel}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alert;
