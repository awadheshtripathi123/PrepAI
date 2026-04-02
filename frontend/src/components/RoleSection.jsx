import Card from "./Card";

const RoleSection = () => {
  const roles = [
    "Software Developer",
    "Fullstack Developer",
    "DevOps Engineer",
    "Data Science Engineer",
    "Cyber Security Analyst",
  ];

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4">
        Computer Science & Information Technology
      </h2>

      <div className="grid grid-cols-5 gap-6">
        {roles.map((role, i) => (
          <Card key={i} title={role} />
        ))}
      </div>
    </div>
  );
};

export default RoleSection;