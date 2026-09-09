const Skeleton = ({ type = 'text', count = 1, className = '' }) => {
  const baseClass = 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded';
  
  const types = {
    text: 'h-4 w-full',
    title: 'h-8 w-3/4',
    avatar: 'h-12 w-12 rounded-full',
    image: 'h-48 w-full',
    card: 'h-64 w-full',
    button: 'h-10 w-32',
  };

  const skeletonClass = `${baseClass} ${types[type]} ${className}`;

  return (
    <>
      {[...Array(count)].map((_, index) => (
        <div key={index} className={skeletonClass} />
      ))}
    </>
  );
};

export default Skeleton;
