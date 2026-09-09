import { motion } from 'framer-motion';

const SectionHeader = ({ 
  title, 
  subtitle, 
  description, 
  centered = false,
  gradient = false 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`mb-12 ${centered ? 'text-center' : ''}`}
    >
      {subtitle && (
        <span className="inline-block text-primary-600 dark:text-primary-400 font-semibold text-sm uppercase tracking-wider mb-2">
          {subtitle}
        </span>
      )}
      <h2 className={`heading-lg mb-4 ${gradient ? 'gradient-text' : 'text-gray-900 dark:text-white'}`}>
        {title}
      </h2>
      {description && (
        <p className={`text-lg text-gray-600 dark:text-gray-300 ${centered ? 'max-w-3xl mx-auto' : 'max-w-2xl'}`}>
          {description}
        </p>
      )}
    </motion.div>
  );
};

export default SectionHeader;
