import Link from 'next/link';

const HeroBanner = () => {
  return (
    <div className="bg-indigo-700 lg:max-w-7xl mx-auto md:rounded-md md:shadow-lg px-10">
      <div className="mx-auto max-w-2xl py-16  text-center sm:py-10 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          <span className="block">ลงประกาศอสังหาฟรีที่ PropKub.com</span>
          <span className="block">
            ที่ <span className="">PropKub.com</span>
            <span className="text-accent">(พร็อพคับ)</span>
          </span>
        </h2>
        <p className="mt-4 text-lg leading-6 text-indigo-200">
          ลงประกาศได้ฟรีโดยไม่ต้องสมัครสมาชิก
        </p>

        <Link
          href="/createpost"
          className="mt-8 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-indigo-600 hover:bg-indigo-50 sm:w-auto"
        >
          ลงประกาศเลย
        </Link>
      </div>
    </div>
  );
};

export default HeroBanner;
