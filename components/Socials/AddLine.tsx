import LineIcon from '../Icons/LineIcon';

const AddLine = () => {
  return (
    <div className="fixed bg-[#01B902] bottom-0 right-0 z-40 rounded-tl-md cursor-pointer">
      <a
        href="https://line.me/R/ti/p/@propkub.com"
        target="_blank"
        rel="noreferrer"
      >
        <div className="flex items-center px-2 py-1">
          <LineIcon className="text-white w-7 h-7 mr-1" />
          <div className="text-white">แชทกับเรา</div>
        </div>
      </a>
    </div>
  );
};

export default AddLine;
