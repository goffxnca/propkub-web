import TextInput from "../../UI/Public/Inputs/TextInput";

const PostDetailAgentContactForm = () => {
  return (
    <div className="">
      <div className="col-span-6">
        <TextInput
          label="ชื่อ-สกุล"
          id="keyword"
          placeholder=""
          error={{ message: "กรุณาระบุ" }}
        />
      </div>

      <div className="col-span-6">
        <TextInput
          label="เบอร์โทรศัพท์"
          id="keyword"
          placeholder=""
          error={{ message: "กรุณาระบุ" }}
        />
      </div>

      <div className="col-span-6">
        <TextInput
          label="ข้อความ"
          id="keyword"
          placeholder=""
          error={{ message: "กรุณาระบุ" }}
        />
      </div>
    </div>
  );
};

export default PostDetailAgentContactForm;
