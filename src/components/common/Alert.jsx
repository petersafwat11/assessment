import {
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiXCircle,
  FiX,
} from "react-icons/fi";

const Alert = ({ type = "info", message, onClose, className = "" }) => {
  const types = {
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-800",
      icon: FiCheckCircle,
      iconColor: "text-green-500",
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-800",
      icon: FiXCircle,
      iconColor: "text-red-500",
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-800",
      icon: FiAlertCircle,
      iconColor: "text-yellow-500",
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-800",
      icon: FiInfo,
      iconColor: "text-blue-500",
    },
  };

  const config = types[type] || types.info;
  const Icon = config.icon;

  return (
    <div
      className={`flex items-start p-4 rounded-lg border ${config.bg} ${config.border} ${className}`}
      role="alert"
    >
      <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
      <p className={`ml-3 text-sm ${config.text} flex-1`}>{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className={`ml-3 ${config.text} hover:opacity-70 transition-opacity`}
        >
          <FiX className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default Alert;
