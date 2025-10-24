import { motion } from 'framer-motion'
import { forwardRef } from 'react'

const Card = forwardRef(({ 
  children, 
  className = '',
  variant = 'default',
  interactive = false,
  padding = 'md',
  ...props 
}, ref) => {
  const variants = {
    default: 'bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700',
    elevated: 'bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700',
    glass: 'bg-white/20 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10',
    glassStrong: 'bg-white/30 dark:bg-black/30 backdrop-blur-2xl border border-white/30 dark:border-white/20'
  }
  
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  }
  
  const cardClasses = interactive 
    ? `${variants[variant]} hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer` 
    : variants[variant]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`${cardClasses} ${paddings[padding]} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
})

Card.displayName = 'Card'

// Card sub-components for better composition
const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
)

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-xl font-semibold text-gray-900 dark:text-gray-100 ${className}`}>
    {children}
  </h3>
)

const CardDescription = ({ children, className = '' }) => (
  <p className={`text-gray-600 dark:text-gray-400 mt-1 ${className}`}>
    {children}
  </p>
)

const CardContent = ({ children, className = '' }) => (
  <div className={`${className}`}>
    {children}
  </div>
)

const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 ${className}`}>
    {children}
  </div>
)

Card.Header = CardHeader
Card.Title = CardTitle
Card.Description = CardDescription
Card.Content = CardContent
Card.Footer = CardFooter

export default Card