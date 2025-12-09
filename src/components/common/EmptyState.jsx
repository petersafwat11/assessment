import { Link } from "react-router-dom";

const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionText,
  actionLink,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {Icon && (
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-gray-400" />
        </div>
      )}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-500 max-w-md mb-6">{description}</p>
      )}
      {actionText &&
        (actionLink || onAction) &&
        (actionLink ? (
          <Link to={actionLink} className="btn-primary">
            {actionText}
          </Link>
        ) : (
          <button onClick={onAction} className="btn-primary">
            {actionText}
          </button>
        ))}
    </div>
  );
};

export default EmptyState;
