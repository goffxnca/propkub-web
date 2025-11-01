import { useEffect, useState } from 'react';
import BaseInput from './BaseInput';
import dynamic from 'next/dynamic';
import {
  ReactHookFormError,
  ReactHookFormUnRegister
} from '../../../../types/misc/form';
import type {
  UseFormSetValue,
  UseFormRegister,
  RegisterOptions
} from 'react-hook-form';
import type { UnprivilegedEditor } from 'react-quill';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

interface TextEditorInputProps {
  id: string;
  label?: string;
  info?: string;
  error?: ReactHookFormError;
  register?: UseFormRegister<any>;
  unregister?: ReactHookFormUnRegister;
  setValue?: UseFormSetValue<any>;
  defaultValue?: string;
  validation?: RegisterOptions;
}

const TextEditorInput = ({
  id,
  label,
  info,
  error,
  register,
  unregister = () => ({}),
  setValue,
  defaultValue = '',
  validation = {}
}: TextEditorInputProps) => {
  const [editorHtmlValue, setEditorHtmlValue] = useState<string>('');
  const [editorRawLength, setEditorRawLength] = useState<number>(0);
  const [initialized, setInitialized] = useState<boolean>(false);

  const idForRawContent = id + '_raw';

  const modules = {
    toolbar: [
      ['link', 'bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }]
    ]
  };

  const formats = ['bold', 'italic', 'underline', 'list', 'link'];

  const minLength = (validation?.minLength as { value: number })?.value || 0;
  const remainingLengthRequired = Math.max(0, minLength - editorRawLength);

  const editorValueChangeHandler = (
    value: string,
    _delta: any,
    _source: string,
    editor: UnprivilegedEditor
  ) => {
    setEditorHtmlValue(value);
    if (setValue) {
      setValue(id, value, { shouldDirty: initialized });
      const rawEditorValue = editor.getText().trim();
      setValue(idForRawContent, rawEditorValue, {
        shouldValidate: true
      });
      setEditorRawLength(rawEditorValue.length);
    }

    if (!initialized) {
      setInitialized(true);
    }
  };

  useEffect(() => {
    if (defaultValue && setValue) {
      setEditorHtmlValue(defaultValue);
      setValue(id, defaultValue);
      setValue(idForRawContent, defaultValue);
    }
    return () => {
      unregister(id);
      unregister(idForRawContent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BaseInput
      id={id}
      label={label}
      error={error}
      info={info}
      counter={remainingLengthRequired}
    >
      <>
        <input className="hidden" type="text" {...register(id)} />
        <input
          className="hidden"
          type="text"
          {...register(idForRawContent, validation)}
        />
      </>

      <div className={`border ${error ? 'border-red-300' : 'border-gray-300'}`}>
        <ReactQuill
          id={id}
          theme="snow"
          value={editorHtmlValue}
          onChange={editorValueChangeHandler}
          modules={modules}
          formats={formats}
        />
      </div>
      {/* {remainingLengthRequired > 0 && (
        <p className="text-red-400 text-xs py-1 text-right">
          {remainingLengthRequired}
        </p>
      )} */}
    </BaseInput>
  );
};

export default TextEditorInput;
