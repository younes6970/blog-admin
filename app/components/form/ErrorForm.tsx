type ErrorFormProps = {
  message?: string;
  className?: string;
};

function ErrorForm({ message, className = "" }: ErrorFormProps) {
  return (
    <div
      className={`flex items-center gap-1 text-red-600 h-4 ${className}`}
    >
      <span className="text-xs font-medium">{message || " "}</span>
    </div>
  );
}

export default ErrorForm;
