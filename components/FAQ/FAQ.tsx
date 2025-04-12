import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { joinClasses } from "../../libs/utils/style-utils";

const faqList = [
  {
    question: "PropKub.com คืออะไร",
    answer:
      "PropKub.com (พร็อพคับ) เป็นแพลตฟอร์มค้นหาอสังหาริมทรัพย์ที่ลงประกาศเพื่อขายหรือให้เช่า ไม่ว่าจะเป็นลงประกาศโดยเจ้าของเอง, นายหน้าอสังหา(Agent), หรือโดยตรงจากแบรนด์เจ้าของโครงการเอง โดยเรามีเป้าหมายหลักในการพัฒนาแพลตฟอร์มทั้ง Website และ Application เพื่อช่วยสนันสนุนการทำงานของทุกๆฝ่ายให้สามารถทำงาน ง่ายขึ้น สะดวก รวดเร็วและเข้าถึงลูกค้ามากขึ้น",
  },
  {
    question: "บริการของ PropKub.com มีอะไรบ้าง",
    answer:
      "PropKub.com ให้บริการช่วย Agent/เจ้าของทรัพย์ ลงประกาศ ขาย ปล่อยเช่า อสังหาริมทรัพย์ ไม่ว่าจะเป็นบ้าน ที่ดิน คอนโด ทาวน์โฮม อาคารพาณิชย์ เพื่อเพิ่มโอกาสในการเข้าถึงลูกค้า/ผู้สนใจทรัพย์ ติดต่อท่านเข้ามาเพิ่มมากขึ้น",
  },
  {
    question:
      "เมื่อประกาศที่ลงปิดการขายได้ PropKub.com ขอแบ่งรายได้ Commission จาก Agent หรือไม่",
    answer:
      "ไม่ PropKub.com ไม่ใช่ Co-Agent เราไม่คุย/ประสานงาน หรือติดต่อกับผู้สนใจประกาศ ผู้สนใจประกาศจะติดต่อโดยตรงไปที่ Agent โดยทุกประกาศเราจะระบุ ชื่อ เบอร์โทร ไลน์ไอดีของ Agent ไว้ที่ใต้ประกาศเสมอ เราทำหน้าที่ทำให้ประกาศเข้าถึงลูกค้าเพิ่มขึ้นเท่านั้น",
  },
  {
    question: "PropKub.com ให้บริการฟรี แล้วจะมีรายได้จากทางไหน",
    answer: "เรามีรายได้หลักจากการแสดงโฆษณาของบนเว็บไซต์ของเรา",
  },
  {
    question: "PropKub.com จำกัดจำนวนประกาศหรือไม่",
    answer:
      "คุณสามารถลงประกาศได้ไม่จำกัดจำนวน โดยเราจำกัดแค่จำนวนภาพ 5 ภาพต่อ 1 ประกาศเท่านั้น",
  },
];

const FAQ = () => {
  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto divide-y-2 divide-gray-200">
          <h1 className="text-center text-3xl font-extrabold text-gray-900 sm:text-4xl">
            คำถามที่พบบ่อย
          </h1>
          <dl className="mt-6 space-y-6 divide-y divide-gray-200">
            {faqList.map((faq) => (
              <Disclosure as="div" key={faq.question} className="pt-6">
                {({ open }) => (
                  <>
                    <dt className="text-lg">
                      <Disclosure.Button className="text-left w-full flex justify-between items-start text-gray-400">
                        <span className="font-medium text-gray-900">
                          {faq.question}
                        </span>
                        <span className="ml-6 h-7 flex items-center">
                          <ChevronDownIcon
                            className={joinClasses(
                              open ? "-rotate-180" : "rotate-0",
                              "h-6 w-6 transform"
                            )}
                            aria-hidden="true"
                          />
                        </span>
                      </Disclosure.Button>
                    </dt>
                    <Disclosure.Panel as="dd" className="mt-2 pr-12">
                      <p className="text-base text-gray-500">{faq.answer}</p>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
