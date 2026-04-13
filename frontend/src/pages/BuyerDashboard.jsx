import { useState, useEffect, useContext, useRef } from 'react'
import { Link, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { getMyInquiries, replyToInquiry } from '../api/inquiry.api'
import { toast } from 'react-toastify'

function Sidebar({ rfqCount }) {
  const location = useLocation()
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  
  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const nameToDisplay = user?.full_name || 'Hotel Buyer'

  return (
    <aside className="sidebar">
      <div style={{ padding: '0 24px 24px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <div className="navbar-logo-mark" style={{ background: 'var(--gold)', color: 'var(--primary)' }}>SS</div>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>StaySource</span>
        </Link>
        <div style={{ fontSize: 10, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', paddingLeft: 46 }}>Buyer Console</div>
      </div>

      <nav className="sidebar-nav" style={{ marginTop: 24 }}>
        <Link to="/buyer-dashboard/rfqs" className={`sidebar-link ${location.pathname.startsWith('/buyer-dashboard/rfqs') || location.pathname === '/buyer-dashboard' ? 'active' : ''}`}>
          <span className="material-icons-round" style={{ fontSize: 20 }}>forum</span>
          <span style={{ flex: 1 }}>Messages</span>
          {rfqCount > 0 && (
            <span style={{ background: 'var(--gold)', color: 'var(--primary)', fontSize: 11, fontWeight: 700, borderRadius: 10, padding: '1px 7px' }}>
              {rfqCount}
            </span>
          )}
        </Link>
        <Link to="/vendors" className="sidebar-link">
          <span className="material-icons-round" style={{ fontSize: 20 }}>storefront</span>
          <span style={{ flex: 1 }}>Marketplace</span>
        </Link>
      </nav>

      <div style={{ padding: '24px 16px 0', marginTop: 'auto' }}>
        <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 6, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 4, background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 800, fontSize: 13 }}>
             {nameToDisplay.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{nameToDisplay}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Buyer Account</div>
          </div>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)' }} title="Logout">
             <span className="material-icons-round" style={{ fontSize: 20 }}>logout</span>
          </button>
        </div>
      </div>
    </aside>
  )
}

function BuyerRfqsView() {
  const { user } = useContext(AuthContext);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const data = await getMyInquiries();
        const items = data.data || [];
        setInquiries(items);
        if (items.length > 0 && !selectedId) {
          setSelectedId(items[0]._id);
        }
      } catch (error) {
        console.error("Failed to fetch inquiries");
      } finally {
        setLoading(false);
      }
    };
    fetchInquiries();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [selectedId, inquiries]);

  const handleReply = async () => {
    if (!replyText.trim() || !selectedId) return;
    setSubmitting(true);
    try {
      await replyToInquiry(selectedId, replyText);
      setReplyText("");
      const data = await getMyInquiries();
      setInquiries(data.data || []);
    } catch (e) {
      toast.error(e.response?.data?.message || e.message || "Failed to send reply");
    } finally {
      setSubmitting(false);
    }
  };

  const activeRfq = inquiries.find(r => r._id === selectedId);

  if (loading) return <div style={{ padding: 40, color: 'var(--primary)' }}>Loading conversations...</div>;

  if (inquiries.length === 0) {
    return (
      <div style={{ height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--surface-container)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <span className="material-icons-round" style={{ fontSize: 40, color: 'var(--primary)' }}>forum</span>
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--primary)', marginBottom: 8 }}>No messages yet</h2>
        <p style={{ color: 'var(--on-surface-variant)', maxWidth: 320 }}>Once you inquiry with vendors about products or services, your conversations will appear here.</p>
        <Link to="/vendors" className="btn btn-primary" style={{ marginTop: 24 }}>Browse Marketplace</Link>
      </div>
    );
  }

  return (
    <div className="chat-interface-container" style={{ 
      display: 'flex', 
      height: 'calc(100vh - 64px)', 
      background: '#fff', 
      borderRadius: 12, 
      overflow: 'hidden', 
      boxShadow: 'var(--shadow-card)', 
      margin: window.innerWidth > 768 ? '0 24px 24px' : '0' 
    }}>
      {/* Conversations List - Hidden on mobile if a chat is selected */}
      <div style={{ 
        width: window.innerWidth > 768 ? 320 : '100%', 
        display: (window.innerWidth <= 768 && selectedId) ? 'none' : 'flex',
        borderRight: '1px solid var(--outline-variant)', 
        flexDirection: 'column', 
        background: '#fcfcfc' 
      }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--outline-variant)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--primary)' }}>Chats</h2>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {inquiries.map(rfq => (
            <div 
              key={rfq._id} 
              onClick={() => setSelectedId(rfq._id)}
              style={{ 
                padding: '16px 20px', 
                cursor: 'pointer', 
                borderBottom: '1px solid var(--outline-variant)',
                background: selectedId === rfq._id ? 'rgba(200,169,81,0.08)' : 'transparent',
                transition: 'all 0.2s',
                display: 'flex',
                gap: 12,
                alignItems: 'center'
              }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--primary)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700 }}>
                {rfq.vendor_id?.company_name?.charAt(0) || 'V'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {rfq.vendor_id?.company_name || "Unknown Vendor"}
                  </div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--on-surface-variant)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {rfq.replies?.length > 0 ? rfq.replies[rfq.replies.length - 1].message : rfq.message}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Chat Window */}
      <div style={{ flex: 1, display: window.innerWidth <= 768 && !selectedId ? 'none' : 'flex', flexDirection: 'column' }}>
        {activeRfq ? (
          <>
            {/* Header */}
            <div style={{ padding: '12px 24px', borderBottom: '1px solid var(--outline-variant)', display: 'flex', alignItems: 'center', gap: 12, background: '#fff' }}>
              {window.innerWidth <= 768 && (
                <button 
                  onClick={() => setSelectedId(null)}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', marginRight: 8, display: 'flex', alignItems: 'center' }}
                >
                  <span className="material-icons-round">arrow_back</span>
                </button>
              )}
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--primary)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                {activeRfq.vendor_id?.company_name?.charAt(0) || 'V'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--primary)' }}>{activeRfq.vendor_id?.company_name || 'Vendor Details'}</div>
                <div style={{ fontSize: 11, color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)' }} /> Verified Professional
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 16, background: '#f5f7f9' }}>
               {/* Initial Inquiry Message */}
               <div style={{ alignSelf: 'center', margin: '8px 0', fontSize: 11, fontWeight: 700, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Conversation Started on {new Date(activeRfq.createdAt).toLocaleDateString()}
               </div>
               
               <div style={{ alignSelf: 'flex-end', maxWidth: '75%' }}>
                 <div style={{ background: 'var(--primary)', color: '#fff', padding: '10px 16px', borderRadius: '16px 16px 0 16px', fontSize: 14, lineHeight: 1.5, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                   {activeRfq.message}
                 </div>
                 <div style={{ fontSize: 10, color: 'var(--on-surface-variant)', textAlign: 'right', marginTop: 4 }}>
                   {new Date(activeRfq.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                 </div>
               </div>

               {activeRfq.replies?.map((reply, idx) => {
                 const isMe = reply.sender_id === user?.id || reply.sender_id === user?._id;
                 return (
                   <div key={idx} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
                     <div style={{ 
                        background: isMe ? 'var(--primary)' : '#fff', 
                        color: isMe ? '#fff' : 'var(--primary)', 
                        padding: '10px 16px', 
                        borderRadius: isMe ? '16px 16px 0 16px' : '16px 16px 16px 0',
                        fontSize: 14, 
                        lineHeight: 1.5,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        border: isMe ? 'none' : '1px solid var(--outline-variant)'
                      }}>
                       {reply.message}
                     </div>
                     <div style={{ fontSize: 10, color: 'var(--on-surface-variant)', textAlign: isMe ? 'right' : 'left', marginTop: 4 }}>
                       {new Date(reply.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                     </div>
                   </div>
                 )
               })}
               <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div style={{ padding: '20px 24px', borderTop: '1px solid var(--outline-variant)', display: 'flex', gap: 12, alignItems: 'center' }}>
              <input 
                type="text" 
                className="input" 
                placeholder="Type your message..." 
                style={{ flex: 1, borderRadius: 24, padding: '12px 20px' }}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleReply()}
              />
              <button 
                className="btn btn-primary" 
                style={{ width: 48, height: 48, borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={handleReply}
                disabled={submitting || !replyText.trim()}
              >
                <span className="material-icons-round" style={{ fontSize: 22 }}>send</span>
              </button>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f5f7f9' }}>
            <span className="material-icons-round" style={{ fontSize: 64, color: 'var(--outline-variant)', marginBottom: 16 }}>forum</span>
            <p style={{ color: 'var(--on-surface-variant)' }}>Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BuyerDashboard() {
  const [rfqCount, setRfqCount] = useState(0);

  useEffect(() => {
    getMyInquiries()
      .then(res => setRfqCount(res.data?.length || 0))
      .catch(() => {})
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar rfqCount={rfqCount} />
      <div className="dashboard-content" style={{ padding: '32px 0 0' }}>
         <Routes>
            <Route path="/" element={<BuyerRfqsView />} />
            <Route path="rfqs" element={<BuyerRfqsView />} />
         </Routes>
      </div>
    </div>
  )
}
