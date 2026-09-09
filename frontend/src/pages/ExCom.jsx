import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Mail, Linkedin, Instagram, Globe } from 'lucide-react';
import { getExcomMembers } from '../services/excomService';
import SectionHeader from '../components/common/SectionHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

const ExCom = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getExcomMembers().then(setMembers).catch(console.error).finally(() => setLoading(false));
  }, []);

  // Group by position
  const grouped = members.reduce((acc, member) => {
    const pos = member.excom_positions?.title || 'Other';
    const order = member.excom_positions?.display_order || 99;
    if (!acc[pos]) acc[pos] = { members: [], order };
    acc[pos].members.push(member);
    return acc;
  }, {});

  const sortedPositions = Object.entries(grouped).sort((a, b) => a[1].order - b[1].order);

  // President (first position)
  const presidentEntry = sortedPositions[0];
  const president = presidentEntry?.[1]?.members?.[0];
  const rest = president ? sortedPositions.slice(1) : sortedPositions;

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-primary-900 to-gray-900 text-white">
        <div className="container-custom text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Users className="w-14 h-14 mx-auto mb-4 text-primary-300" />
            <h1 className="heading-xl mb-4">Executive Committee</h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Meet the dedicated team leading the Geosciences & Remote Sensing Society.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section bg-white dark:bg-gray-900">
        <div className="container-custom">
          {loading ? <LoadingSpinner /> : members.length === 0
            ? <EmptyState icon={Users} title="No members found" description="ExCom members will appear here once added." />
            : (
            <>
              {/* Featured President */}
              {president && (
                <div className="mb-16">
                  <SectionHeader title="Leadership" centered />
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="max-w-sm mx-auto text-center">
                    <MemberCard member={president} featured />
                  </motion.div>
                </div>
              )}

              {/* Rest of ExCom grouped by position */}
              {rest.map(([posTitle, { members: posMembers }]) => (
                <div key={posTitle} className="mb-12">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
                    {posTitle}
                  </h2>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {posMembers.map((member, i) => (
                      <motion.div key={member.id}
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                        <MemberCard member={member} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

const MemberCard = ({ member, featured = false }) => (
  <div className={`card group overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${featured ? 'p-8' : 'p-5'}`}>
    {/* Photo */}
    <div className={`rounded-full overflow-hidden mx-auto mb-4 border-4 border-primary-100 dark:border-primary-900/50 group-hover:border-primary-400 transition-colors shadow-md ${featured ? 'w-32 h-32' : 'w-24 h-24'}`}>
      {member.photo_url
        ? <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        : <div className="w-full h-full bg-gradient-to-br from-primary-600 to-earth-600 flex items-center justify-center">
            <span className={`text-white font-bold ${featured ? 'text-4xl' : 'text-2xl'}`}>{member.name.charAt(0)}</span>
          </div>
      }
    </div>

    <div className="text-center">
      <h3 className={`font-bold text-gray-900 dark:text-white ${featured ? 'text-xl mb-1' : 'text-base mb-0.5'}`}>{member.name}</h3>
      <p className={`text-primary-600 dark:text-primary-400 font-medium ${featured ? 'text-sm mb-2' : 'text-xs mb-1'}`}>
        {member.excom_positions?.title}
      </p>
      {member.department && <p className="text-xs text-gray-500 dark:text-gray-400">{member.department}</p>}
      {member.batch && <p className="text-xs text-gray-400 dark:text-gray-500">Batch: {member.batch}</p>}
      {member.bio && featured && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 leading-relaxed line-clamp-3">{member.bio}</p>
      )}

      {/* Social Icons */}
      <div className="flex justify-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {member.email && (
          <a href={`mailto:${member.email}`}
            className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-primary-600 dark:hover:bg-primary-600 flex items-center justify-center transition-colors group/icon">
            <Mail className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover/icon:text-white transition-colors" />
          </a>
        )}
        {member.linkedin_url && (
          <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer"
            className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-blue-600 flex items-center justify-center transition-colors group/icon">
            <Linkedin className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover/icon:text-white transition-colors" />
          </a>
        )}
        {member.instagram_url && (
          <a href={member.instagram_url} target="_blank" rel="noopener noreferrer"
            className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-pink-600 flex items-center justify-center transition-colors group/icon">
            <Instagram className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover/icon:text-white transition-colors" />
          </a>
        )}
      </div>
    </div>
  </div>
);

export default ExCom;
