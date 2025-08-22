import React from "react";
import Badge from "../../UI/Badge/Badge";
import { getThaiFullDateTimeString } from "../../../libs/date-utils";
import {
  getPostActionVariantById,
  getPostActionIconById,
  getPostActionLabelById,
} from "../../../libs/mappers/postActionMapper";

const PostTimeline = ({ postActions = [] }) => {
  if (!postActions || postActions.length === 0) {
    return null;
  }

  const renderActionIcon = (actionType) => {
    const IconComponent = getPostActionIconById(actionType);
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
        <IconComponent className="h-4 w-4 text-gray-500" />
      </div>
    );
  };

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          ไทม์ไลน์ประกาศ
        </h3>

        <div className="flow-root">
          <ul className="-mb-8">
            {postActions.map((action, actionIdx) => (
              <li key={actionIdx}>
                <div className="relative pb-8">
                  {actionIdx !== postActions.length - 1 ? (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>{renderActionIcon(action.type)}</div>
                    <div className="min-w-0 flex-1 pt-1.5">
                      <div className="flex items-center space-x-2">
                        <Badge variant={getPostActionVariantById(action.type)}>
                          {getPostActionLabelById(action.type)}
                        </Badge>
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        <p>
                          {action.createdBy?.name && (
                            <span className="font-medium">
                              โดย {action.createdBy.name}
                            </span>
                          )}
                          {action.createdBy?.name && " • "}
                          {getThaiFullDateTimeString(action.createdAt)}
                        </p>
                        {action.note && (
                          <p className="mt-1 text-gray-600">{action.note}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PostTimeline;
