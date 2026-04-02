import Hero from "../components/Hero";
import Section from "../components/Section";

const Home = () => {

  const sectionsData = [
    {
      title: "Software Roles",
      roles: [
        { name: "Frontend Developer", img: "https://cdn-icons-png.flaticon.com/512/2721/2721297.png" },
        { name: "Backend Developer", img: "https://cdn-icons-png.flaticon.com/512/4248/4248443.png" },
        { name: "DevOps Engineer", img: "https://cdn-icons-png.flaticon.com/512/906/906324.png" },
        { name: "MERN Developer", img: "https://cdn-icons-png.flaticon.com/512/5968/5968342.png" },
        { name: "Fullstack Developer", img: "https://cdn-icons-png.flaticon.com/512/1055/1055687.png" },
        { name: "Java Developer", img: "https://cdn-icons-png.flaticon.com/512/226/226777.png" },
      ],
    },
    {
      title: "Mechanical Engineering",
      roles: [
        { name: "Design Engineer", img: "https://cdn-icons-png.flaticon.com/512/609/609803.png" },
        { name: "Production Engineer", img: "https://cdn-icons-png.flaticon.com/512/1688/1688400.png" },
        { name: "Maintenance Engineer", img: "https://cdn-icons-png.flaticon.com/512/1688/1688403.png" },
        { name: "Quality Engineer", img: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png" },
        { name: "Automobile Engineer", img: "https://cdn-icons-png.flaticon.com/512/743/743922.png" },
        { name: "Thermal Engineer", img: "https://cdn-icons-png.flaticon.com/512/3062/3062634.png" },
      ],
    },
    {
      title: "Civil Engineering",
      roles: [
        { name: "Site Engineer", img: "https://cdn-icons-png.flaticon.com/512/2920/2920244.png" },
        { name: "Structural Engineer", img: "https://cdn-icons-png.flaticon.com/512/3079/3079165.png" },
        { name: "Urban Planner", img: "https://cdn-icons-png.flaticon.com/512/684/684908.png" },
        { name: "Geotechnical Engineer", img: "https://cdn-icons-png.flaticon.com/512/4359/4359963.png" },
        { name: "Construction Manager", img: "https://cdn-icons-png.flaticon.com/512/3062/3062634.png" },
        { name: "Transportation Engineer", img: "https://cdn-icons-png.flaticon.com/512/854/854878.png" },
      ],
    },
    {
      title: "AI & Data Science",
      roles: [
        { name: "Machine Learning Engineer", img: "https://cdn-icons-png.flaticon.com/512/4712/4712109.png" },
        { name: "Data Scientist", img: "https://cdn-icons-png.flaticon.com/512/4149/4149645.png" },
        { name: "AI Engineer", img: "https://cdn-icons-png.flaticon.com/512/4712/4712109.png" },
        { name: "Data Analyst", img: "https://cdn-icons-png.flaticon.com/512/2920/2920244.png" },
        { name: "Data Engineer", img: "https://cdn-icons-png.flaticon.com/512/2721/2721297.png" },
        { name: "NLP Engineer", img: "https://cdn-icons-png.flaticon.com/512/4149/4149645.png" },
      ],
    },
  ];

  return (
    <div className="space-y-6">

      {/* 🔥 HERO SECTION */}
      <Hero type="home" />

      {/* 🔥 ROLE SECTIONS */}
      {sectionsData.map((section, index) => (
        <Section
          key={index}
          title={section.title}
          roles={section.roles}
        />
      ))}

    </div>
  );
};

export default Home;