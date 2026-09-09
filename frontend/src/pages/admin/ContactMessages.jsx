import { useState, useEffect } from 'react';
import { Mail, MailOpen, Trash2, Search } from 'lucide-react';
import { supabase } from '../../config/supabase';
import { formatDate } from '../../utils/helpers';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

const ContactMessages = () => {
  const [messages,  setMessages]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState('');
  const [filter,    setFilter]    = useState('all');   // all | unread | read
  const [selected,  setSelected]  = useState(null);    // message open in modal
  const [deleteId,  setDeleteId]  = useState(null);

  useEffect(() => { fetchMessages(); }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      let q = supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      const { data, error } = await q;
      if (error) throw error;
      setMessages(data || []);
    } catch { toast.error('Failed to load messages'); }
    finally { setLoading(false); }
  };

  const markRead = async (id) => {
    await supabase.from('contact_messages').update({ is_read: true }).eq('id', id);
    setMessages(ms => ms.map(m => m.id === id ? { ...m, is_read: true } : m));
  };

  const handleOpen = async (msg) => {
    setSelected(msg);
    if (!msg.is_read) await markRead(msg.id);
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('contact_messages').delete().eq('id', id);
    if (!error) {
      toast.success('Deleted');
      setMessages(ms => ms.filter(m => m.id !== id));
      if (selected?.id === id) setSelected(null);
    } else toast.error('Delete failed');
  };

  const filtered = messages.filter(m => {
    const matchesFilter =
      filter === 'all' ? true :
      filter === 'unread' ? !m.is_read :
      m.is_read;
    const matchesSearch = !search ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      (m.subject || '').toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Messages</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {messages.length} total
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-semibold">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, subject..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-9 py-2 text-sm"
          />
        </div>
        <div className="flex gap-2">
          {[['all','All'],['unread','Unread'],['read','Read']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === val
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="card overflow-hidden">
        {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
          <EmptyState icon={Mail} title="No messages" description="Contact form submissions will appear here." />
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {filtered.map(msg => (
              <div
                key={msg.id}
                onClick={() => handleOpen(msg)}
                className={`flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer transition-colors ${
                  !msg.is_read ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''
                }`}
              >
                {/* Icon */}
                <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${
                  msg.is_read
                    ? 'bg-gray-100 dark:bg-gray-700'
                    : 'bg-primary-100 dark:bg-primary-900/40'
                }`}>
                  {msg.is_read
                    ? <MailOpen className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    : <Mail     className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  }
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-semibold text-sm ${!msg.is_read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                      {msg.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{msg.email}</span>
                    {!msg.is_read && <Badge variant="primary" size="sm">New</Badge>}
                  </div>
                  {msg.subject && (
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-0.5 truncate">{msg.subject}</p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{msg.message}</p>
                </div>

                {/* Meta */}
                <div className="flex-shrink-0 flex flex-col items-end gap-2">
                  <span className="text-xs text-gray-400">{formatDate(msg.created_at, 'short')}</span>
                  <button
                    onClick={e => { e.stopPropagation(); setDeleteId(msg.id); }}
                    className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message Detail Modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Message Details" size="md">
        {selected && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: 'From',    value: selected.name  },
                { label: 'Email',   value: selected.email, link: `mailto:${selected.email}` },
                { label: 'Subject', value: selected.subject || '(no subject)', span: true },
                { label: 'Date',    value: formatDate(selected.created_at) },
              ].map(({ label, value, link, span }) => (
                <div key={label} className={span ? 'sm:col-span-2' : ''}>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
                  {link
                    ? <a href={link} className="font-medium text-primary-600 dark:text-primary-400 hover:underline">{value}</a>
                    : <p className="font-medium text-gray-900 dark:text-white">{value}</p>
                  }
                </div>
              ))}
            </div>

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Message</p>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
                {selected.message}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <a
                href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Your message to GRSS'}`}
                className="flex-1 btn-primary text-center text-sm"
              >
                Reply via Email
              </a>
              <button
                onClick={() => setDeleteId(selected.id)}
                className="px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 text-sm font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => handleDelete(deleteId)}
        title="Delete Message"
        message="Are you sure you want to permanently delete this message?"
      />
    </div>
  );
};

export default ContactMessages;
