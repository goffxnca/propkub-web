import { useRouter } from 'next/router';
import { useState } from 'react';
import Button from '../../UI/Public/Button';
import TextInput from '../../UI/Public/Inputs/TextInput';

//TODO: comback and change this, not secure, passcode should be checked behind API
const PasscodeVallidator = ({ passcode, onSuccess }) => {
  const router = useRouter();
  const [validating, setValidating] = useState(false);
  const [inputPasscode, setInputPasscode] = useState('');
  const [error, setError] = useState(null);

  const onClickButtonValidate = () => {
    if (!inputPasscode) {
      return setError({ message: 'กรอกรหัสแก้ไขประกาศ' });
    }
    if (passcode === inputPasscode) {
      onSuccess();
    } else {
      setError({ message: 'รหัสแก้ไขประกาศไม่ถูกต้อง' });
    }
  };

  return (
    <div className="w-full mt-10">
      <div className="m-auto w-72 space-y-2">
        <TextInput
          id="keyword"
          type="password"
          label="กรุณาระบุรหัสแก้ไขประกาศ"
          placeholder=""
          onChange={(event) => {
            setInputPasscode(event.target.value);
          }}
          error={error}
        ></TextInput>

        <Button
          type="button"
          variant="primary"
          loading={validating}
          onClick={onClickButtonValidate}
        >
          ตรวจสอบรหัส
        </Button>
      </div>
    </div>
  );
};

export default PasscodeVallidator;
