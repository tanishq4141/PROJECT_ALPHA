import Navbar from '../components/Navbar'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'

const LandingPage = () => {
  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered Learning',
      description: 'Generate assignments and questions using advanced AI technology'
    },
    {
      icon: '📊',
      title: 'Analytics Dashboard',
      description: 'Track student progress with comprehensive analytics and insights'
    },
    {
      icon: '👥',
      title: 'Batch Management',
      description: 'Organize students into batches and manage classes efficiently'
    },
    {
      icon: '📝',
      title: 'Assignment System',
      description: 'Create, distribute, and grade assignments seamlessly'
    },
    {
      icon: '📱',
      title: 'Mobile Responsive',
      description: 'Access your learning management system from any device'
    },
    {
      icon: '🌙',
      title: 'Dark Mode',
      description: 'Comfortable viewing experience with dark and light themes'
    }
  ]

  const stats = [
    { number: '1000+', label: 'Active Students' },
    { number: '50+', label: 'Teachers' },
    { number: '500+', label: 'Assignments Created' },
    { number: '95%', label: 'Satisfaction Rate' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-secondary-900 dark:via-secondary-800 dark:to-secondary-900">
      <Navbar />
      
      {/* Hero Section */}
      <main className="pt-20">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-6 py-20"
        >
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-6xl lg:text-7xl font-display font-bold text-secondary-900 dark:text-secondary-100 mb-6"
            >
              Welcome to{' '}
              <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Project Alpha
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl lg:text-2xl text-secondary-600 dark:text-secondary-400 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Your modern Learning Management System that revolutionizes education with AI-powered tools, 
              comprehensive analytics, and seamless collaboration between teachers and students.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            >
              <Link to="/login?role=teacher">
                <Button size="lg" className="w-full sm:w-auto">
                  <span className="mr-2">👨‍🏫</span>
                  Login as Teacher
                </Button>
              </Link>
              <Link to="/login?role=student">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  <span className="mr-2">👨‍🎓</span>
                  Login as Student
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl lg:text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-secondary-600 dark:text-secondary-400">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="py-20 bg-white/50 dark:bg-secondary-800/50 backdrop-blur-sm"
        >
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-display font-bold text-secondary-900 dark:text-secondary-100 mb-6">
                Powerful Features
              </h2>
              <p className="text-xl text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto">
                Everything you need to create an engaging and effective learning environment
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card interactive className="h-full text-center">
                    <div className="text-5xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-secondary-600 dark:text-secondary-400">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="py-20"
        >
          <div className="container mx-auto px-6">
            <Card className="max-w-4xl mx-auto text-center bg-gradient-to-r from-primary-600 to-accent-600 text-white">
              <div className="py-12">
                <h2 className="text-4xl font-display font-bold mb-6">
                  Ready to Transform Education?
                </h2>
                <p className="text-xl mb-8 opacity-90">
                  Join thousands of educators and students who are already using Project Alpha
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/signup">
                    <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                      Get Started Free
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="ghost" size="lg" className="w-full sm:w-auto text-white border-white hover:bg-white/10">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="bg-secondary-100 dark:bg-secondary-800 py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="text-2xl font-display font-bold text-primary-600 dark:text-primary-400 mb-4">
            Project Alpha
          </div>
          <p className="text-secondary-600 dark:text-secondary-400 mb-4">
            Empowering education through technology
          </p>
          <div className="text-sm text-secondary-500 dark:text-secondary-500">
            © 2024 Project Alpha. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage