import { formatDate } from "../lib/utils";

export function BlogCard(props) {
  const { image, category, title, description, author, date } = props;

  // ตรวจสอบว่า date เป็น ISO string หรือไม่ และ format ให้เหมาะสม
  const formattedDate = date.includes("T") ? formatDate(date) : date;

  return (
    <div className="flex flex-col gap-5">
      <a
        href="#"
        className="relative h-[212px] w-full lg:h-[360px] lg:w-[590px]"
      >
        <img
          className="h-full w-full rounded-2xl object-cover"
          src={image}
          alt={title}
        />
      </a>
      <div className="flex flex-col">
        <div className="flex">
          <span className="mb-2 rounded-full bg-green-light px-3 py-1 font-poppins text-sm font-medium leading-[22px] text-green">
            {category}
          </span>
        </div>
        <a href="#">
          <h2 className="mb-2 line-clamp-2 font-poppins text-xl font-semibold leading-7 text-brown-600 hover:underline">
            {title}
          </h2>
        </a>
        <p className="mb-4 flex-grow line-clamp-3 font-poppins text-sm font-medium leading-[22px] text-brown-400">
          {description}
        </p>
        <div className="flex items-center text-sm">
          <img className="mr-2 h-8 w-8 rounded-full" src={image} alt={author} />
          <span className="font-poppins text-sm font-medium leading-[22px] text-brown-500">
            {author}
          </span>
          <span className="mx-2 text-gray-300">|</span>
          <span className="font-poppins text-sm font-medium leading-[22px] text-brown-400">
            {formattedDate}
          </span>
        </div>
      </div>
    </div>
  );
}
