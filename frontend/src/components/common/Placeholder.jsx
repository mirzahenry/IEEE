const Placeholder = ({ title }) => {
  return (
    <div className="min-h-screen pt-20">
      <div className="container-custom section">
        <h1 className="heading-lg mb-6">{title}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          This page is under development. Please check back later.
        </p>
      </div>
    </div>
  );
};

export default Placeholder;
