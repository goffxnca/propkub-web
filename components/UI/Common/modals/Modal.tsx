import Button from "../../Public/Button";
import Overlay from "./Overlay";

const Modal = ({ onClose }) => {
  return (
    <Overlay onClick={onClose}>
      <div className="flex justify-center items-center bg-white mx-auto p-10 shadow-lg rounded-lg">
        <div>
          {/* <div className="text-black animate-spin">O</div> */}
          <div className="text-gray-hard animate-pulse">
            ลงประกาศสำหรับสมาชิกเท่านั้น สมัครใช้งานฟรี
          </div>
          <Button variant="primary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Overlay>
  );
};

export default Modal;
