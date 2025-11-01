import { useEffect, useState } from 'react';
import BaseInput from './BaseInput';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const TextEditorInput = ({
  id,
  label,
  info,
  error,
  register = () => ({}),
  unregister = () => ({}),
  setValue = () => ({}),
  defaultValue = '',
  validation = {}
}) => {
  const [editorHtmlValue, setEditorHtmlValue] = useState('');
  const [editorRawLength, setEditorRawLength] = useState(0);
  const [initialized, setInitialized] = useState(false);

  const idForRawContent = id + '_raw';

  const modules = {
    toolbar: [
      ['link', 'bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }]
    ]
  };

  const formats = ['bold', 'italic', 'underline', 'list', 'link'];

  const minLength = validation?.minLength?.value || 0;
  const remainingLengthRequired = minLength - editorRawLength;

  const editorValueChangeHandler = (value, predicate, source, editor) => {
    setEditorHtmlValue(value);
    setValue(id, value, { shouldDirty: initialized });
    const rawEditorValue = editor.getText().trim();
    setValue(idForRawContent, rawEditorValue, {
      shouldValidate: true
    });
    setEditorRawLength(rawEditorValue.length);

    if (!initialized) {
      setInitialized(true);
    }
  };

  useEffect(() => {
    if (defaultValue) {
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
      error={error?.message}
      info={info}
      counter={remainingLengthRequired}
    >
      <input className="hidden" type="text" {...register(id)} />
      <input
        className="hidden"
        type="text"
        {...register(idForRawContent, validation)}
      />

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
