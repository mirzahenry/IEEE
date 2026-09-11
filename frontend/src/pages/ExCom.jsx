import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Mail, Linkedin, Instagram } from 'lucide-react';
import { getExcomMembers } from '../services/excomService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

const ExCom = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getExcomMembers().then(setMembers).catch(console.error).finally(() => setLoading(false));
  }, []);

  // Sort all members by position display_order then by their own display_order
  const sorted = [...members].sort((a, b) => {
    const posA = a.excom_positions?.display_order ?? 99;
    const posB = b.excom_positions?.display_order ?? 99;
    if (posA !== posB) return posA - posB;
    return (a.display_order ?? 0) - (b.display_order ?? 0);
  });

  return (
    <div className="min-h-screen pt-20">

      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-primary-900 to-gray-900 text-white">
        <div className="container-custom text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Users className="w-14 h-14 mx-auto mb-4 text-primary-300" />
            <h1 className="heading-xl mb-4">Executive Committee</h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Meet the dedicated team leading our IEEE Student Branch.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section bg-white dark:bg-gray-900">
        <div className="container-custom">
          {loading
            ? <LoadingSpinner />
            : members.length === 0
              ? <EmptyState icon={Users} title="No members found" description="ExCom members will appear here once added." />
              : (
                <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
                  {sorted.map((member, i) => (
                    <motion.div key={member.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}>
                      <MemberCard member={member} />
                    </motion.div>
                  ))}
                </div>
              )
          }
        </div>
      </section>
    </div>
  );
};

const MemberCard = ({ member }) => (
  <div className="card group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 p-6 h-full">
    {/* Photo */}
    <div className="w-28 h-28 rounded-full overflow-hidden mx-auto mb-4 border-4 border-primary-100 dark:border-primary-900/50 group-hover:border-primary-400 transition-colors shadow-md">
      {member.photo_url
        ? <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        : <div className="w-full h-full bg-gradient-to-br from-primary-600 to-earth-600 flex items-center justify-center">
            <span className="text-white font-bold text-3xl">{member.name.charAt(0)}</span>
          </div>
      }
    </div>

    <div className="text-center">
      <h3 className="font-bold text-gray-900 dark:text-white text-base leading-tight mb-1">{member.name}</h3>
      <p className="text-primary-600 dark:text-primary-400 font-medium text-sm mb-1">
        {member.excom_positions?.title}
      </p>
      {member.department && <p className="text-xs text-gray-500 dark:text-gray-400">{member.department}</p>}
      {member.batch      && <p className="text-xs text-gray-400 dark:text-gray-500">Batch: {member.batch}</p>}

      {/* Social Icons */}
      <div className="flex justify-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {member.email && (
          <a href={`mailto:${member.email}`}
            className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-primary-600 flex items-center justify-center transition-colors">
            <Mail className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </a>
        )}
        {member.linkedin_url && (
          <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer"
            className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-blue-600 flex items-center justify-center transition-colors">
            <Linkedin className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </a>
        )}
        {member.instagram_url && (
          <a href={member.instagram_url} target="_blank" rel="noopener noreferrer"
            className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-pink-600 flex items-center justify-center transition-colors">
            <Instagram className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </a>
        )}
      </div>
    </div>
  </div>
);

export default ExCom;
