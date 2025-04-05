import SpinnerIcon from "../../../Icons/SpinnerIcon";
import Overlay from "./Overlay";

const Loader = () => {
  return (
    <Overlay>
      <div className="animate-spin text-white">
        <SpinnerIcon className="w-10 h-10" />
      </div>
    </Overlay>
  );
};

export default Loader;
