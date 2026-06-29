"use client";

const categories = ["Yoga", "Cardio", "Weights", "Pilates", "HIIT", "Zumba", "CrossFit", "Boxing"];

const ClassFilter = ({ search, setSearch, selectedCategory, setSelectedCategory }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <input
        type="text"
        placeholder="Search classes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input-field flex-1"
      />
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="input-field sm:w-48"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
    </div>
  );
};

export default ClassFilter;