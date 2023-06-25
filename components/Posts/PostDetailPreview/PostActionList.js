import { useMemo } from "react";
import { getLocalDateTimeByISODateString } from "../../../libs/date-utils";
import { getPostActionById } from "../../../libs/mappers/postActionMapper";
import PostActionItem from "./PostActionItem";

const PostActionList = ({ postActions }) => {
  const postActionList = useMemo(
    () =>
      postActions.map((action) => {
        return {
          ...action,
          datetime: getLocalDateTimeByISODateString(action.createdAtISO),
          ...getPostActionById(action.actionName),
        };
      }),
    [postActions]
  );

  return (
    <div className="bg-white shadow sm:rounded-lg p-4 min-h-[100px]">
      <h3 className="text-lg font-medium leading-6 text-gray-900">
        ไทม์ไลน์ประกาศ
      </h3>
      <ul role="list" className="-mb-8 m-3">
        {postActionList.map((action, actionIdx) => (
          <PostActionItem
            key={action.id}
            actionName={action.label}
            actionNote={action.note}
            createdBy={action.createdBy.name}
            iconBackground={action.iconBackground}
            Icon={action.icon}
            datetime={action.datetime}
            isLastItem={actionIdx === postActionList.length - 1}
          />
        ))}
      </ul>
    </div>
  );
};

export default PostActionList;
