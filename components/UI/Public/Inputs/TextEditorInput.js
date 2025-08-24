import { useEffect, useState } from 'react';
import BaseInput from './BaseInput';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';
import { maxLength, minLength } from '../../../../libs/form-validator';

const TextEditorInput = ({
  id,
  label,
  error,
  register = () => ({}),
  unregister = () => ({}),
  setValue = () => ({}),
  defaultValue = ''
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

  const remainingLengthRequired = 200 - editorRawLength;

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
      info="อธิบายรายละเอียดของทรัพย์ให้ครบถ้วนสมบูรณ์ ประกาศที่มีคุณภาพจะต้องมีความยาวของรายละเอียดระหว่าง 200-4000 ตัวอักษร โปรดทราบว่าการแปะลิ้งค์ที่ไม่เหมาะหรือลิ้งค์สแปมลงในประกาศเป็นการผิดกฎการใช้งาน เมื่อถูกตรวจพบบัญชีของคุณจะถูกแบนถาวรโดยไม่แจ้งให้ทราบล่วงหน้า ลิงค์ที่ไม่ผิดกฎได้แก่ ลิงค์ไปยังเว็บไซต์ของคุณหรือบริษัทที่คุณสังกัด ลิงค์เฟจบุ๊คแฟนเพจ ลิ้งค์บัญชีไลน์ หรือโซเซียลมีเดียต่างๆของคุณ เป็นต้น โดยคุณสามารถเพิ่มลิงค์ได้โดยไฮไลต์ข้อความที่ต้องการและคลิกที่ไอคอนห่วงโซ่ด้านบนเพื่อเพิ่มลิงค์"
      counter={remainingLengthRequired}
    >
      <input className="hidden" type="text" {...register(id)} />
      <input
        className="hidden"
        type="text"
        {...register(idForRawContent, {
          required: 'กรุณาระบุรายละเอียดประกาศ',
          minLength: { ...minLength(200, 'รายละเอียดประกาศ') },
          maxLength: { ...maxLength(3000, 'รายละเอียดประกาศ') }
        })}
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
