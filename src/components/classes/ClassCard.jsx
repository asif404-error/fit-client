import Link from "next/link";

const ClassCard = ({ cls }) => {
  return (
    <div className="card overflow-hidden hover:shadow-lg transition-shadow">
      <img src={cls.image} alt={cls.className} className="w-full h-48 object-cover" />
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 px-2 py-1 rounded-full">
            {cls.category}
          </span>
          <span className="text-xs font-semibold bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300 px-2 py-1 rounded-full">
            {cls.difficultyLevel}
          </span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2 mb-1">{cls.className}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">👤 {cls.trainerName}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">⏱ {cls.duration} mins</p>
        <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-4">💵 ${cls.price}</p>
        <Link href={`/classes/${cls._id}`} className="btn-outline text-sm w-full text-center block">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ClassCard;