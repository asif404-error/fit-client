const StatCard = ({ title, value, icon, color = "indigo" }) => {
  const colors = {
    indigo: "bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300",
    orange: "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300",
    green: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300",
    red: "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300",
  };

  return (
    <div className="card p-6 flex items-center gap-5">
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${colors[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
        <p className="text-3xl font-black text-slate-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;