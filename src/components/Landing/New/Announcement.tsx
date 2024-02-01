import { Tab } from "@headlessui/react";

function Annoucement() {
  const categories = [
    {
      tabName: "News",
      contents: [
        {
          title: "Identity V - Brand New Novel Serie",
          date: "2022-05-18",
        },
        {
          title: "Identity V - Brand New Novel Serie",
          date: "2022-04-12",
        },
        {
          title: "IOS-Android data migration notice",
          date: "2022-03-21",
        },
      ],
    },
    {
      tabName: "Annoucement",
      contents: [
        {
          title: "Maintenance Content on November 23",
          date: "2022-11-23",
        },
        {
          title: "Maintenance Content on November 9",
          date: "2022-11-09",
        },
        {
          title: "Maintenance Content on November 2",
          date: "2022-11-02",
        },
      ],
    },
    {
      tabName: "Update",
      contents: [
        {
          title: "Maintenance Content on November 2",
          date: "2022-11-02",
        },
        {
          title: "Maintenance Content on November 2",
          date: "2022-11-02",
        },
        {
          title: "Maintenance Content on November 2",
          date: "2022-11-02",
        },
      ],
    },
  ];

  return (
    <Tab.Group>
      <Tab.List>
        <div className="flex justify-between items-center">
          <div className="tabs-list">
            {categories.map((categorie, index) => (
              <Tab
                key={index}
                className={({ selected }) =>
                  `relative text-lg md:text-3xl !leading-[4rem] font-medium px-1 mx-1 md:mx-2 outline-none ${
                    index === categories.length - 1 ? "" : "after:content-['/']"
                  } after:absolute after:-right-2 before:content-[""] ${
                    selected
                      ? "text-white before:absolute before:bottom-3 before:-left-1 before:w-full before:h-[2px] before:bg-[url('https://i.ibb.co/ysghNKJ/news-nav-h-c520d6f.png')]"
                      : "hover:text-white text-[#c3cfd8]/30 "
                  }  `
                }
              >
                {categorie.tabName}
              </Tab>
            ))}
          </div>
          <a
            href=""
            className="text-primary font-medium font-witch text-lg md:text-3xl hover:text-primary lg:text-[#c3cfd8]/30"
          >
            +More
          </a>
        </div>
      </Tab.List>
      <Tab.Panels>
        {categories.map((categorie, index) => (
          <Tab.Panel key={index}>
            <ul>
              {categorie.contents.map((content, index) => (
                <li key={index}>
                  <a
                    href=""
                    className="flex justify-between text-[#c3cfd8]/80 text-sm py-4 md:text-xl leading-10 border-b-2 border-dashed border-[#c3cfd8] hover:text-white gap-1"
                  >
                    <span className="line-clamp-1 w-3/4">{content.title}</span>
                    <span className="shrink-0">{content.date}</span>
                  </a>
                </li>
              ))}
            </ul>
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
}

export default Annoucement;
