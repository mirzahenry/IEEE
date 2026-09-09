import { motion } from 'framer-motion';
import { Globe, Satellite, Map, BookOpen, Users, Lightbulb, Target, Eye, CheckCircle } from 'lucide-react';
import SectionHeader from '../components/common/SectionHeader';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } }),
};

const About = () => {
  const objectives = [
    'Promote awareness of geosciences and remote sensing among students',
    'Organize workshops, seminars, and training sessions on GIS and earth observation',
    'Facilitate research collaborations between students and faculty',
    'Provide hands-on experience with professional geospatial tools and software',
    'Connect students with industry professionals and researchers',
    'Participate in national and international competitions and conferences',
    'Develop innovative projects solving real-world environmental challenges',
    'Build a community of passionate geospatial technology enthusiasts',
  ];

  const whyJoin = [
    { icon: BookOpen, title: 'Learn & Grow', desc: 'Access workshops, seminars and hands-on training in cutting-edge geospatial technologies.' },
    { icon: Users, title: 'Network', desc: 'Connect with fellow students, researchers, faculty, and industry professionals.' },
    { icon: Lightbulb, title: 'Innovate', desc: 'Work on real-world research projects and contribute to geoscience innovation.' },
    { icon: Globe, title: 'Impact', desc: 'Contribute to environmental monitoring, disaster management, and sustainable development.' },
    { icon: Satellite, title: 'Technology', desc: 'Get hands-on experience with satellite data, GIS software, and remote sensing tools.' },
    { icon: Map, title: 'Field Work', desc: 'Participate in field visits to observatories, research stations, and survey sites.' },
  ];

  const areas = [
    { title: 'Geosciences', desc: 'Earth structure, geology, geomorphology and physical geography', color: 'from-blue-600 to-blue-700' },
    { title: 'Remote Sensing', desc: 'Satellite imagery, aerial photography and sensor data analysis', color: 'from-primary-600 to-primary-700' },
    { title: 'GIS', desc: 'Geographic Information Systems for spatial data analysis and mapping', color: 'from-earth-600 to-earth-700' },
    { title: 'Earth Observation', desc: 'Monitoring Earth\'s surface, atmosphere and oceans from space', color: 'from-teal-600 to-teal-700' },
    { title: 'Environmental Science', desc: 'Environmental monitoring, change detection and sustainability', color: 'from-green-600 to-green-700' },
    { title: 'Geospatial AI', desc: 'Machine learning applied to spatial data and satellite imagery', color: 'from-purple-600 to-purple-700' },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="section bg-gradient-to-br from-primary-900 via-primary-800 to-gray-900 text-white">
        <div className="container-custom text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <Satellite className="w-16 h-16 mx-auto mb-6 text-primary-300" />
            <h1 className="heading-xl mb-6">About GRSS</h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              The Geosciences and Remote Sensing Society is a student-driven organization
              dedicated to advancing knowledge in earth sciences, remote sensing, GIS,
              and geospatial technologies.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="card p-8 border-l-4 border-primary-600">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                To foster innovation and research in geosciences and remote sensing technologies among students,
                empowering them with the skills and knowledge to address real-world environmental challenges.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
              className="card p-8 border-l-4 border-earth-600">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-earth-100 dark:bg-earth-900/30 rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-earth-600 dark:text-earth-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Vision</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                To be a leading student society in earth observation and geospatial sciences,
                recognized for our contributions to research, education, and technological advancement.
              </p>
            </motion.div>
          </div>

          {/* Focus Areas */}
          <SectionHeader title="Our Focus Areas" subtitle="What We Do" centered />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-16">
            {areas.map((area, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i} whileHover={{ y: -4 }}
                className="card p-6 text-center">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${area.color} mx-auto mb-4 flex items-center justify-center`}>
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{area.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{area.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="section bg-gray-50 dark:bg-gray-800/50">
        <div className="container-custom">
          <SectionHeader title="Our Objectives" subtitle="Goals" centered />
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {objectives.map((obj, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i % 4}
                className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
                <CheckCircle className="w-5 h-5 text-earth-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-300 text-sm">{obj}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Join */}
      <section className="section bg-white dark:bg-gray-900">
        <div className="container-custom">
          <SectionHeader title="Why Join GRSS?" subtitle="Benefits" centered
            description="Becoming a member opens doors to a world of opportunities in geosciences and beyond." />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyJoin.map((item, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i} whileHover={{ y: -4 }}
                className="card card-hover p-6">
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
