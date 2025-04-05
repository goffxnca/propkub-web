import { joinClasses } from "../../../libs/utils/style-utils";

const PostActionItem = ({
  actionName,
  actionNote,
  createdBy,
  iconBackground,
  Icon,
  datetime,
  isLastItem,
}) => {
  const iconStyle =
    iconBackground === "green"
      ? "bg-green-500"
      : iconBackground === "yellow"
      ? "bg-yellow-500"
      : "bg-gray-500";
  return (
    <li>
      <div className="relative pb-8">
        {!isLastItem ? (
          <span
            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
            aria-hidden="true"
          />
        ) : null}
        <div className="relative flex space-x-3">
          <div>
            <span
              className={joinClasses(
                iconStyle,
                "h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white"
              )}
            >
              <Icon className="h-5 w-5 text-white" aria-hidden="true" />
            </span>
          </div>
          <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
            <div>
              <p className="text-sm text-gray-500">
                <span>{actionName}</span>
                {actionNote && (
                  <span className="block text-xs text-red-300 my-1">
                    **{actionNote}
                  </span>
                )}
                <span className="block text-gray-300 italic">
                  <span className="text-sm">โดย </span>
                  <span className="">{createdBy}</span>
                </span>
              </p>
            </div>
            <div className="whitespace-nowrap text-right text-sm text-gray-500">
              <div>{datetime}</div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default PostActionItem;
