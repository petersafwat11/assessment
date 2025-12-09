import { FiStar } from "react-icons/fi";
import { generateStars } from "../../utils/helpers";

const StarRating = ({
  rating,
  maxStars = 5,
  size = "md",
  showValue = false,
}) => {
  const stars = generateStars(rating, maxStars);

  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div className="flex items-center space-x-1">
      {stars.map((star, index) => (
        <FiStar
          key={index}
          className={`${sizeClasses[size]} ${
            star === "full"
              ? "text-yellow-400 fill-yellow-400"
              : star === "half"
              ? "text-yellow-400 fill-yellow-200"
              : "text-gray-300"
          }`}
        />
      ))}
      {showValue && (
        <span className="ml-1 text-sm text-gray-600">
          ({rating.toFixed(1)})
        </span>
      )}
    </div>
  );
};

export default StarRating;
