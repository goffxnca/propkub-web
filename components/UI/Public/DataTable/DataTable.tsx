import { resolveColumnValue } from '../../../../libs/utils/datatable-utils';

const DataTable = ({ items = [], columns = [], onRowClick = () => {} }) => {
  return (
    <div className="mt-8 flex flex-col overflow-x-scroll overflow-y-hidden">
      <div className="-my-2  lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.field}
                      scope="col"
                      className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900 whitespace-nowrap"
                    >
                      {col.title}
                    </th>
                  ))}
                  {/* <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Role
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Edit</span>
                  </th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {items.map((item) => (
                  <tr
                    key={item._id}
                    onClick={() => {
                      onRowClick(item._id);
                    }}
                    className=" cursor-pointer hover:bg-gray-100"
                  >
                    {columns.map((col) => (
                      <td
                        key={col.field}
                        className="whitespace-nowrap px-2 py-4 text-sm text-gray-500"
                      >
                        {(() => {
                          if (col.custom) {
                            return col.custom(item);
                          } else {
                            return col.resolver
                              ? col.resolver(item)
                              : resolveColumnValue(col.field, item);
                          }
                        })()}
                      </td>
                    ))}

                    {/* <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={person.image}
                            alt=""
                          />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">
                            {person.name}
                          </div>
                          <div className="text-gray-500">{person.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div className="text-gray-900">{person.title}</div>
                      <div className="text-gray-500">{person.department}</div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                        Active
                      </span>
                    </td> */}
                    {/* <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {person.role}
                    </td> */}
                    {/* <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <a
                        href="#"
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit<span className="sr-only">, {person.name}</span>
                      </a>
                    </td> */}
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={50}>
                      <div className="text-center text-sm m-2 text-gray-700">
                        ไม่พบข้อมูล
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
