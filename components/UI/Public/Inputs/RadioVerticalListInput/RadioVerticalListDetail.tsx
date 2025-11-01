import { useState } from 'react';
import { RadioGroup } from '@headlessui/react';
import { joinClasses } from '../../../../../libs/utils/style-utils';

const RadioVerticalListDetail = ({
  items = [],
  error,
  onChange = () => {}
}) => {
  const [selected, setSelected] = useState('');

  const onChangeHandler = (value) => {
    setSelected(value);
    onChange(value);
  };

  return (
    <RadioGroup value={selected} onChange={onChangeHandler}>
      <RadioGroup.Label className="sr-only">Privacy setting</RadioGroup.Label>
      <div
        className={`bg-white rounded-md -space-y-px ${error && 'border border-red-300'}`}
      >
        {items.map((setting, settingIdx) => (
          <RadioGroup.Option
            key={setting.id}
            value={setting.id}
            className={({ checked }) =>
              joinClasses(
                settingIdx === 0 ? 'rounded-tl-md rounded-tr-md' : '',
                settingIdx === items.length - 1
                  ? 'rounded-bl-md rounded-br-md'
                  : '',
                checked
                  ? 'bg-indigo-50 border-indigo-200 z-10'
                  : 'border-gray-200',
                'relative border p-4 flex cursor-pointer focus:outline-none'
              )
            }
          >
            {({ active, checked }) => (
              <>
                <span
                  className={joinClasses(
                    checked
                      ? 'bg-indigo-600 border-transparent'
                      : 'bg-white border-gray-300',
                    active ? 'ring-2 ring-offset-2 ring-indigo-500' : '',
                    'h-4 w-4 mt-0.5 cursor-pointer shrink-0 rounded-full border flex items-center justify-center'
                  )}
                  aria-hidden="true"
                >
                  <span className="rounded-full bg-white w-1.5 h-1.5" />
                </span>
                <span className="ml-3 flex flex-col">
                  <RadioGroup.Label
                    as="span"
                    className={joinClasses(
                      checked ? 'text-indigo-900' : 'text-gray-900',
                      'block text-sm font-medium'
                    )}
                  >
                    {setting.name}
                  </RadioGroup.Label>
                  <RadioGroup.Description
                    as="span"
                    className={joinClasses(
                      checked ? 'text-indigo-700' : 'text-gray-500',
                      'block text-xs'
                    )}
                  >
                    {setting.description}
                  </RadioGroup.Description>
                </span>
              </>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
};

export default RadioVerticalListDetail;
