import { useState, useEffect, useContext } from 'react'
import { Link, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { getMyVendorProfile, updateVendor, createVendor } from '../api/vendor.api'
import { getAllCategories } from '../api/category.api'
import { getMyInquiries, replyToInquiry, deleteInquiry, deleteMessage } from '../api/inquiry.api'
import { getMyProducts, createProduct, deleteProduct } from '../api/product.api'
import { toast } from 'react-toastify'

const navItems = [
  { to: '/dashboard', icon: 'dashboard', label: 'Dashboard', exact: true },
  { to: '/dashboard/profile', icon: 'person', label: 'My Profile' },
  { to: '/dashboard/edit', icon: 'edit', label: 'Edit Profile' },
  { to: '/dashboard/inventory', icon: 'inventory_2', label: 'Inventory' },
  { to: '/dashboard/messages', icon: 'chat', label: 'Messages' },
]

function Sidebar({ inquiries }) {
  const location = useLocation()
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  
  
  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const getInitials = (first, last) => {
     if(first && last) return (first[0] + last[0]).toUpperCase();
     if(first) return first[0].toUpperCase();
     if(user?.full_name) return user.full_name[0].toUpperCase();
     return 'V';
  }

  const nameToDisplay = user?.full_name || (user?.first_name ? `${user?.first_name} ${user?.last_name || ''}` : '') || 'Vendor User'

  return (
    <aside className="sidebar">
      <div style={{ padding: '0 24px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <div className="navbar-logo-mark" style={{ background: 'var(--gold)', color: 'var(--primary)' }}>SS</div>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>StaySource</span>
        </div>
        <div style={{ fontSize: 10, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', paddingLeft: 46 }}>Management Console</div>
      </div>

      <nav className="sidebar-nav" style={{ marginTop: 24 }}>
        {navItems.map(item => {
          const isActive = item.exact
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to)

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`sidebar-link${isActive ? ' active' : ''}`}
            >
              <span className="material-icons-round" style={{ fontSize: 20 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom User Area */}
      <div style={{ padding: '24px 16px 0', marginTop: 'auto' }}>
        <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 6, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 4, background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 800, fontSize: 13 }}>
             {getInitials(user?.first_name, user?.last_name)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{nameToDisplay}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Vendor Account</div>
          </div>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)' }} title="Logout">
             <span className="material-icons-round" style={{ fontSize: 20 }}>logout</span>
          </button>
        </div>
      </div>
    </aside>
  )
}

function ProfileView({ profile }) {
  const navigate = useNavigate();
  if(!profile) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2 className="headline-md" style={{ color: 'var(--primary)' }}>No Profile Found</h2>
        <p style={{ marginTop: 8, color: 'var(--on-surface-variant)' }}>It looks like you haven't published your business profile yet.</p>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard/edit')} style={{marginTop: 24}}>Create Profile</button>
      </div>
    )
  }

  return (
    <div style={{ paddingBottom: 64 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 className="headline-md" style={{ color: 'var(--primary)' }}>My Profile</h1>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard/edit')}>Edit Profile</button>
      </div>

      <div style={{ background: '#fff', borderRadius: 8, boxShadow: 'var(--shadow-card)', padding: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 32 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--surface-container)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: 32, fontWeight: 700 }}>
             {profile.company_name?.charAt(0) || 'B'}
          </div>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--primary)', marginBottom: 4 }}>{profile.company_name}</h2>
            <div style={{ color: 'var(--on-surface-variant)', fontSize: 14 }}>{profile.city}, {profile.state}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr', gap: 32 }}>
          <div>
            <h3 style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--on-surface-variant)', fontWeight: 700, marginBottom: 12 }}>Contact Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14, color: 'var(--primary)' }}>
              <div><strong>Email:</strong> {profile.email || '—'}</div>
              <div><strong>Phone:</strong> {profile.phone || '—'}</div>
              <div><strong>Website:</strong> {profile.website || '—'}</div>
              <div><strong>Contact Person:</strong> {profile.contact_first_name} {profile.contact_last_name}</div>
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--on-surface-variant)', fontWeight: 700, marginBottom: 12 }}>Categories</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {profile.categories?.map(c => (
                <span key={c._id || c.id || c} style={{ padding: '4px 12px', background: 'var(--surface-container)', borderRadius: 20, fontSize: 12, fontWeight: 600, color: 'var(--primary)' }}>
                  {c.name || 'Category'}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 32 }}>
           <h3 style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--on-surface-variant)', fontWeight: 700, marginBottom: 12 }}>Description</h3>
           <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--on-surface)' }}>{profile.description || 'No description provided.'}</p>
        </div>
      </div>
    </div>
  )
}

function InventoryView() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', category: '', price: '', status: 'In Stock', quantity: 0 });

  const fetchProducts = async () => {
    try {
      const data = await getMyProducts();
      setProducts(data.data || []);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreate = async () => {
    if (!newProduct.name) return toast.error("Product name is required");
    try {
      await createProduct(newProduct);
      toast.success("Product added!");
      setShowAddForm(false);
      setNewProduct({ name: '', category: '', price: '', status: 'In Stock', quantity: 0 });
      fetchProducts();
    } catch (e) {
      const msg = e.response?.data?.message || e.message || "Failed to add product";
      toast.error(msg);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      toast.success("Product deleted");
      fetchProducts();
    } catch (e) {
      toast.error("Failed to delete product");
    }
  };

  return (
    <div style={{ paddingBottom: 64 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 className="headline-md" style={{ color: 'var(--primary)' }}>Inventory</h1>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Add New Item'}
        </button>
      </div>

      {showAddForm && (
        <div style={{ background: 'var(--surface-low)', padding: 24, borderRadius: 8, marginBottom: 32, display: 'grid', gridTemplateColumns: window.innerWidth > 600 ? '1fr 1fr' : '1fr', gap: 16 }}>
          <input className="input" placeholder="Product Name" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
          <input className="input" placeholder="Category" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} />
          <input className="input" placeholder="Price (e.g. $850)" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
          <input className="input" type="number" placeholder="Quantity (e.g. 40)" value={newProduct.quantity} onChange={e => setNewProduct({...newProduct, quantity: parseInt(e.target.value) || 0})} />
          <select className="input" value={newProduct.status} onChange={e => setNewProduct({...newProduct, status: e.target.value})}>
             <option>In Stock</option>
             <option>Low Stock</option>
             <option>Out of Stock</option>
          </select>
          <button className="btn btn-primary" onClick={handleCreate} style={{ gridColumn: window.innerWidth > 600 ? 'span 2' : 'span 1' }}>Save Product</button>
        </div>
      )}

      <div className="table-container" style={{ background: '#fff', borderRadius: 8, boxShadow: 'var(--shadow-card)', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ padding: 40 }}>Loading products...</div>
        ) : products.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center' }}>No products found in your inventory.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--surface-low)', borderBottom: '1px solid var(--outline-variant)' }}>
                <th style={{ padding: '16px 24px', fontSize: 12, fontWeight: 700, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Product Name</th>
                <th style={{ padding: '16px 24px', fontSize: 12, fontWeight: 700, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Category</th>
                <th style={{ padding: '16px 24px', fontSize: 12, fontWeight: 700, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Price</th>
                <th style={{ padding: '16px 24px', fontSize: 12, fontWeight: 700, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Stock</th>
                <th style={{ padding: '16px 24px', fontSize: 12, fontWeight: 700, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Status</th>
                <th style={{ padding: '16px 24px', fontSize: 12, fontWeight: 700, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(item => (
                <tr key={item._id} style={{ borderBottom: '1px solid var(--outline-variant)' }}>
                  <td style={{ padding: '16px 24px', fontSize: 14, fontWeight: 600, color: 'var(--primary)' }}>{item.name}</td>
                  <td style={{ padding: '16px 24px', fontSize: 14, color: 'var(--on-surface)' }}>{item.category}</td>
                   <td style={{ padding: '16px 24px', fontSize: 14, color: 'var(--on-surface)' }}>{item.price}</td>
                  <td style={{ padding: '16px 24px', fontSize: 14, color: 'var(--on-surface)', fontWeight: 700 }}>{item.quantity || 0}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700, 
                      background: (item.quantity > 10) ? 'rgba(26,122,74,0.1)' : (item.quantity > 0 ? 'rgba(200,169,81,0.1)' : 'rgba(234,67,53,0.1)'), 
                      color: (item.quantity > 10) ? '#1a7a4a' : (item.quantity > 0 ? '#C8A951' : '#ea4335') 
                    }}>
                      {item.quantity > 10 ? 'In Stock' : (item.quantity > 0 ? 'Low Stock' : 'Out of Stock')}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <button style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }} onClick={() => handleDelete(item._id)}><span className="material-icons-round" style={{ fontSize: 18 }}>delete</span></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}


function MessagesView({ inquiries, setInquiries, fetchInquiries }) {
  const { user } = useContext(AuthContext);
  const [selectedId, setSelectedId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (inquiries.length > 0 && !selectedId) {
      setSelectedId(inquiries[0]._id);
    }
  }, [inquiries, selectedId]);

  const handleSelectChat = (id) => {
    setSelectedId(id);
  };

  useEffect(() => {
    if (!inquiries.length) {
      setLoading(true);
      fetchInquiries()
        .finally(() => setLoading(false));
    }
  }, []);

  const handleReply = async () => {
    if (!replyText.trim() || !selectedId) return;
    setSubmitting(true);
    try {
      await replyToInquiry(selectedId, replyText);
      setReplyText("");
      const data = await getMyInquiries();
      setInquiries(data.data || []);
    } catch (e) {
      toast.error("Failed to send reply");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReply = async (inquiryId, replyId) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await deleteMessage(inquiryId, replyId);
      const data = await getMyInquiries();
      setInquiries(data.data || []);
    } catch (e) {
      toast.error("Failed to delete message");
    }
  };

  const activeRfq = inquiries.find(r => r._id === selectedId);

  if (loading) return <div style={{ padding: 40 }}>Loading messages...</div>;

  if (inquiries.length === 0) {
    return (
      <div style={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--surface-container)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <span className="material-icons-round" style={{ fontSize: 40, color: 'var(--primary)' }}>forum</span>
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--primary)', marginBottom: 8 }}>Your inbox is empty</h2>
        <p style={{ color: 'var(--on-surface-variant)' }}>Inquiries from Hotel Buyers will appear here.</p>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      height: 'calc(100vh - 64px)', 
      background: '#fff', 
      borderRadius: 12, 
      overflow: 'hidden', 
      boxShadow: 'var(--shadow-card)',
      border: '1px solid var(--outline-variant)',
      margin: '0 24px 24px'
    }}>
      {/* Conversations List */}
      <div style={{ width: 320, borderRight: '1px solid var(--outline-variant)', display: 'flex', flexDirection: 'column', background: '#fcfcfc' }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--outline-variant)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--primary)' }}>Messages</h2>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {inquiries.map(rfq => (
            <div 
              key={rfq._id} 
              onClick={() => handleSelectChat(rfq._id)}
              style={{ 
                padding: '16px 20px', 
                cursor: 'pointer', 
                borderBottom: '1px solid var(--outline-variant)',
                background: selectedId === rfq._id ? 'rgba(200,169,81,0.08)' : 'transparent',
                display: 'flex', gap: 12, alignItems: 'center'
              }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700 }}>
                {rfq.full_name?.charAt(0) || 'B'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {rfq.full_name}
                </div>
                <div style={{ fontSize: 11, color: 'var(--on-surface-variant)', fontWeight: 600 }}>{rfq.hotel_name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Chat Window */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {activeRfq ? (
          <>
            <div style={{ padding: '12px 24px', borderBottom: '1px solid var(--outline-variant)', display: 'flex', alignItems: 'center', gap: 12, background: '#fff' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                {activeRfq.full_name?.charAt(0) || 'B'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--primary)' }}>{activeRfq.full_name}</div>
                <div style={{ fontSize: 12, color: 'var(--on-surface-variant)' }}>{activeRfq.hotel_name}</div>
              </div>
              <button 
                onClick={() => handleDelete(activeRfq._id)}
                style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', padding: 8 }}
                title="Delete Conversation"
              >
                <span className="material-icons-round">delete_outline</span>
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 16, background: '#f5f7f9' }}>
               <div style={{ alignSelf: 'flex-start', maxWidth: '75%' }}>
                 <div style={{ background: '#fff', color: 'var(--primary)', padding: '10px 16px', borderRadius: '16px 16px 16px 0', fontSize: 14, boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid var(--outline-variant)' }}>
                   {activeRfq.message}
                 </div>
                 <div style={{ fontSize: 10, color: 'var(--on-surface-variant)', marginTop: 4 }}>
                   {new Date(activeRfq.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                 </div>
               </div>

                {activeRfq.replies?.map((reply, idx) => {
                  const isMe = reply.sender_id === user?.id || reply.sender_id === user?._id;
                  return (
                    <div key={idx} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, flexDirection: isMe ? 'row-reverse' : 'row' }}>
                        <div style={{ 
                           background: isMe ? 'var(--primary)' : '#fff', 
                           color: isMe ? '#fff' : 'var(--primary)', 
                           padding: '10px 16px', 
                           borderRadius: isMe ? '16px 16px 0 16px' : '16px 16px 16px 0',
                           fontSize: 14, 
                           boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                           border: isMe ? 'none' : '1px solid var(--outline-variant)'
                         }}>
                          {reply.message}
                        </div>
                        {isMe && (
                          <button 
                            onClick={() => handleDeleteReply(activeRfq._id, reply._id)}
                            style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', padding: 4, opacity: 0.3 }}
                          >
                            <span className="material-icons-round" style={{ fontSize: 16 }}>delete</span>
                          </button>
                        )}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--on-surface-variant)', textAlign: isMe ? 'right' : 'left', marginTop: 4 }}>
                        {new Date(reply.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  )
                })}
            </div>

            <div style={{ padding: '20px 24px', borderTop: '1px solid var(--outline-variant)', display: 'flex', gap: 12, alignItems: 'center' }}>
              <input 
                type="text" 
                className="input" 
                placeholder="Type your reply..." 
                style={{ flex: 1, borderRadius: 24, padding: '12px 20px' }}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleReply()}
              />
              <button 
                className="btn btn-primary" 
                style={{ width: 44, height: 44, borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={handleReply}
                disabled={submitting || !replyText.trim()}
              >
                <span className="material-icons-round" style={{ fontSize: 20 }}>send</span>
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


function DashboardOverview({ profile, formData }) {
  const { user } = useContext(AuthContext)
  const [inquiryCount, setInquiryCount] = useState(0)
  const [productCount, setProductCount] = useState(0)

  useEffect(() => {
    getMyInquiries().then(res => setInquiryCount(res.data?.length || 0)).catch(() => {})
    getMyProducts().then(res => setProductCount(res.data?.length || 0)).catch(() => {})
  }, [])
  
  const completionFields = ['company_name', 'description', 'street_name', 'city', 'state', 'country', 'phone', 'email', 'website', 'categories'];
  let filledFields = 0;
  completionFields.forEach(f => {
    if (f === 'categories' && formData[f].length > 0) filledFields++;
    else if (f !== 'categories' && formData[f] && formData[f].trim() !== '') filledFields++;
  });
  const completionPercentage = Math.round((filledFields / completionFields.length) * 100);

  const nameToDisplay = user?.full_name || user?.first_name || 'Vendor'

  return (
    <div style={{ paddingBottom: 64 }}>
      {/* ── HEADER ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <h1 className="headline-md" style={{ color: 'var(--primary)' }}>Good morning, {nameToDisplay}</h1>
      </div>

      {!profile && (
        <div style={{ background: 'var(--primary)', color: 'white', borderRadius: 8, padding: 32, marginBottom: 40 }}>
           <h2 className="headline-md" style={{ color: 'white' }}>Welcome to StaySource</h2>
           <p style={{ marginTop: 8, color: 'rgba(255,255,255,0.8)', maxWidth: 600 }}>Create your public business profile in the "Edit Profile" tab to get discovered by verified Hotel Buyers.</p>
           <Link to="/dashboard/edit" className="btn btn-secondary" style={{ marginTop: 24 }}>Set up Profile</Link>
        </div>
      )}

      {/* ── STATS ROW ── */}
      <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 900 ? 'repeat(3, 1fr)' : 'repeat(1, 1fr)', gap: 24, marginBottom: 32 }}>
        {/* Profile Saves */}
        <div className="stat-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--on-surface-variant)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <span className="material-icons-round" style={{ fontSize: 16, color: 'var(--primary)' }}>bookmark</span>
              Total Saves
            </div>
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>{profile?.saved_count || "0"}</div>
        </div>

        {/* Active Products */}
        <div className="stat-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--on-surface-variant)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <span className="material-icons-round" style={{ fontSize: 16, color: 'var(--primary)' }}>inventory_2</span>
              Active Products
            </div>
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>{productCount}</div>
        </div>

        {/* Total Inquiries */}
        <div className="stat-card" style={{ padding: 24 }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--on-surface-variant)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <span className="material-icons-round" style={{ fontSize: 16, color: 'var(--primary)' }}>mail</span>
              Total Inquiries
            </div>
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>{inquiryCount || 0}</div>
        </div>

      </div>

      {/* ── ANALYTICS PREVIEW ── */}
      <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 900 ? '1fr 340px' : '1fr', gap: 32 }}>
        <div style={{ background: '#fff', borderRadius: 8, padding: 32, boxShadow: 'var(--shadow-card)', minHeight: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--outline-variant)' }}>
          <span className="material-icons-round" style={{ fontSize: 48, color: 'var(--surface-high)', marginBottom: 16 }}>insights</span>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--primary)' }}>Engagement Data</div>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: 13, marginTop: 8, textAlign: 'center' }}>Your engagement trends will be visualized here once more data points are collected.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ background: 'var(--primary)', color: '#fff', borderRadius: 8, padding: 24 }}>
             <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>Pro Tip</div>
             <p style={{ fontSize: 13, lineHeight: 1.6 }}>Keep your inventory updated to rank higher in search results for hotel buyers.</p>
          </div>
        </div>
      </div>

    </div>
  )
}

function EditProfileView({ profile, setProfile, formData, setFormData, allCategories }) {
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => {
     setFormData(prev => ({
        ...prev,
        [e.target.name]: e.target.value
     }))
  }

  const handleCategoryToggle = (id) => {
    setFormData(prev => {
      const isSelected = prev.categories.includes(id);
      return {
        ...prev,
        categories: isSelected ? prev.categories.filter(c => c !== id) : [...prev.categories, id]
      }
    });
  }

  const handleSave = async () => {
     if(!formData.company_name) return toast.error("Company Name is required")
     if(!formData.description) return toast.error("Description is required")
     if(!formData.street_name) return toast.error("Street Name is required")
     if(!formData.city) return toast.error("City is required")
     if(!formData.state) return toast.error("State is required")
     if(!formData.country) return toast.error("Country is required")
     if(formData.categories.length === 0) return toast.error("Select at least 1 category")

     setSaving(true);
     try {
        if (profile && (profile._id || profile.id)) {
           await updateVendor(profile._id || profile.id, formData);
           toast.success("Profile updated successfully!");
        } else {
           const newProfile = await createVendor(formData);
           const pData = newProfile.data || newProfile;
           setProfile(pData);
           toast.success("Profile created successfully!");
        }
        window.scrollTo(0,0)
     } catch (error) {
        toast.error("Failed to save profile");
        console.error(error);
     } finally {
        setSaving(false);
     }
  }

  return (
      <div style={{ marginBottom: 48 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid rgba(196, 198, 206, 0.3)' }}>
          <div>
            <h2 className="headline-md" style={{ color: 'var(--primary)' }}>{profile ? 'Edit' : 'Create'} Business Profile</h2>
            <p style={{ fontSize: 14, color: 'var(--on-surface-variant)', marginTop: 4 }}>Update your public-facing marketplace information.</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 40, alignItems: 'start' }}>
          {/* Business Section */}
          <div>
            <h3 style={{fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--primary)'}}>Business Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div className="input-group">
                <label className="input-label" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Company Name *</label>
                <input className="input" name="company_name" value={formData.company_name} onChange={handleChange} />
                </div>
                <div className="input-group">
                <label className="input-label" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Business Email</label>
                <input className="input" name="email" value={formData.email} onChange={handleChange} />
                </div>
                <div className="input-group">
                <label className="input-label" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Business Phone</label>
                <input className="input" name="phone" value={formData.phone} onChange={handleChange} />
                </div>
                <div className="input-group">
                <label className="input-label" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Website URL</label>
                <input className="input" name="website" value={formData.website} onChange={handleChange} />
                </div>
                <div className="input-group">
                <label className="input-label" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>LinkedIn URL</label>
                <input className="input" name="linkedin_url" value={formData.linkedin_url} onChange={handleChange} />
                </div>
                <div className="input-group">
                <label className="input-label" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Facebook URL</label>
                <input className="input" name="facebook_url" value={formData.facebook_url} onChange={handleChange} />
                </div>
            </div>
            <div className="input-group" style={{marginTop: 24}}>
               <label className="input-label" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Description *</label>
               <textarea className="input" name="description" value={formData.description} onChange={handleChange} rows={4} style={{ resize: 'none', lineHeight: 1.6 }} />
            </div>
          </div>

          <hr style={{borderTop: '1px solid rgba(196, 198, 206, 0.3)', width: '100%'}} />

          {/* Location Section */}
          <div>
            <h3 style={{fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--primary)'}}>Location</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div className="input-group">
                <label className="input-label" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Street Name *</label>
                <input className="input" name="street_name" value={formData.street_name} onChange={handleChange} />
                </div>
                <div className="input-group">
                <label className="input-label" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Number</label>
                <input className="input" name="number" value={formData.number} onChange={handleChange} />
                </div>
                <div className="input-group">
                <label className="input-label" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Area</label>
                <input className="input" name="area" value={formData.area} onChange={handleChange} />
                </div>
                <div className="input-group">
                <label className="input-label" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>District</label>
                <input className="input" name="district" value={formData.district} onChange={handleChange} />
                </div>
                <div className="input-group">
                <label className="input-label" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>City *</label>
                <input className="input" name="city" value={formData.city} onChange={handleChange} />
                </div>
                <div className="input-group">
                <label className="input-label" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>State *</label>
                <input className="input" name="state" value={formData.state} onChange={handleChange} />
                </div>
                <div className="input-group">
                <label className="input-label" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Country *</label>
                <input className="input" name="country" value={formData.country} onChange={handleChange} />
                </div>
            </div>
          </div>

          <hr style={{borderTop: '1px solid rgba(196, 198, 206, 0.3)', width: '100%'}} />

          {/* Contact Person Section */}
          <div>
            <h3 style={{fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--primary)'}}>Contact Person</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 24 }}>
                <div className="input-group">
                <label className="input-label" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Ext</label>
                <select className="input" name="contact_salutation" value={formData.contact_salutation} onChange={handleChange} style={{appearance: 'auto'}}>
                   <option value=""></option>
                   <option value="Mr">Mr.</option>
                   <option value="Mrs">Mrs.</option>
                   <option value="Ms">Ms.</option>
                </select>
                </div>
                <div className="input-group">
                <label className="input-label" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>First Name</label>
                <input className="input" name="contact_first_name" value={formData.contact_first_name} onChange={handleChange} />
                </div>
                <div className="input-group">
                <label className="input-label" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Middle Name</label>
                <input className="input" name="contact_middle_name" value={formData.contact_middle_name} onChange={handleChange} />
                </div>
                <div className="input-group">
                <label className="input-label" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Last Name</label>
                <input className="input" name="contact_last_name" value={formData.contact_last_name} onChange={handleChange} />
                </div>
            </div>
          </div>

          <hr style={{borderTop: '1px solid rgba(196, 198, 206, 0.3)', width: '100%'}} />

          {/* Product Categories Section */}
          <div>
            <h3 style={{fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--primary)'}}>Product Categories *</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, maxHeight: 300, overflowY: 'auto', padding: '16px', background: 'var(--surface-container)', borderRadius: 6, border: '1px solid var(--outline-variant)' }}>
                {allCategories.map(cat => {
                   const cId = cat._id || cat.id || cat;
                   const cName = cat.name || cat;
                   const checked = formData.categories.includes(cId);
                   return (
                      <label key={cId} style={{
                         display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', 
                         background: checked ? 'rgba(200, 169, 81, 0.15)' : '#fff', 
                         border: `1px solid ${checked ? 'var(--gold)' : 'var(--outline-variant)'}`, 
                         borderRadius: 20, cursor: 'pointer', transition: 'all 0.2s',
                         fontSize: 13, fontWeight: 600, color: checked ? 'var(--primary)' : 'var(--on-surface-variant)'
                      }}>
                         <input 
                            type="checkbox" 
                            style={{ display: 'none' }} 
                            checked={checked} 
                            onChange={() => handleCategoryToggle(cId)}
                         />
                         {checked && <span className="material-icons-round" style={{fontSize: 14, color: 'var(--gold)'}}>check</span>}
                         {cName}
                      </label>
                   )
                })}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
             <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{padding: '16px 32px', fontSize: 15}}>
                {saving ? 'Saving...' : 'Save Profile'}
             </button>
          </div>
        </div>
      </div>
  )
}

export default function VendorDashboard() {
  const { user } = useContext(AuthContext)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [allCategories, setAllCategories] = useState([])

  // Initialize formData with whatever we have (even registration data)
  const [formData, setFormData] = useState(() => {
     // Try to get cached user from localStorage if AuthContext hasn't settled
     const cachedUser = JSON.parse(localStorage.getItem('staysource_user') || 'null');
     const u = user || cachedUser;
     const nameParts = u?.full_name?.split(' ') || [];
     return {
        company_name: u?.company_name || u?.full_name || '',
        description: '', street_name: '', number: '', area: '', district: '',
        city: '', state: '', country: '',
        phone: u?.phone || '', email: u?.email || '', website: '', linkedin_url: '', facebook_url: '',
        contact_salutation: '', contact_first_name: nameParts[0] || '', 
        contact_middle_name: '', contact_last_name: nameParts.slice(1).join(' ') || '', categories: []
     };
  });

  const [inquiries, setInquiries] = useState([]);

  const fetchInquiries = async () => {
    if (user && user.role === 'vendor') {
      try {
        const res = await getMyInquiries();
        setInquiries(res.data || []);
      } catch (err) {}
    }
  };

  useEffect(() => {
    const fetchCats = async () => {
      try {
         const cats = await getAllCategories()
         setAllCategories(cats.data || [])
      } catch (err) { }
    }

    const fetchProfile = async () => {
       try {
          let p = null;
          try {
             const resData = await getMyVendorProfile();
             // Standardize: backend returns { success, message, data }
             // We want the actual vendor object from 'data'
             if (resData && resData.data && typeof resData.data === 'object') {
                p = resData.data;
             }
          } catch (e) {
             // API error or 404
          }

          if (p && (p._id || p.id)) {
             setProfile(p);
             const catIds = (p.categories || []).map(c => c._id || c.id || c);
             setFormData({
                company_name: p.company_name || '', description: p.description || '', street_name: p.street_name || '',
                number: p.number || '', area: p.area || '', district: p.district || '', city: p.city || '', state: p.state || '',
                country: p.country || '', phone: p.phone || '', email: p.email || '', website: p.website || '',
                linkedin_url: p.linkedin_url || '', facebook_url: p.facebook_url || '',
                contact_salutation: p.contact_salutation || '', contact_first_name: p.contact_first_name || '',
                contact_middle_name: p.contact_middle_name || '', contact_last_name: p.contact_last_name || '', categories: catIds
             });
          } else if (user) {
             // Profile truly doesn't exist, use registration data
             const nameParts = user.full_name?.split(' ') || [];
             setFormData(prev => ({
                ...prev,
                company_name: user.company_name || user.full_name || '',
                email: user.email || '',
                phone: user.phone || '',
                contact_first_name: nameParts[0] || user.first_name || '',
                contact_last_name: nameParts.slice(1).join(' ') || user.last_name || ''
             }));
          }
       } catch (error) {
          console.error("Critical error in fetchProfile:", error);
       } finally { 
          setLoading(false); 
       }
    };
    
    fetchCats();
    fetchProfile();
    fetchInquiries();
  }, [user]);

  if (loading) return <div style={{ padding: 40, color: 'var(--primary)' }}>Loading dashboard...</div>

  return (
    <div className="dashboard-layout">
      <Sidebar inquiries={inquiries} />
      <div className="dashboard-content">
        <Routes>
          <Route index element={<DashboardOverview profile={profile} formData={formData} />} />
          <Route path="profile" element={<ProfileView profile={profile} />} />
          <Route path="edit" element={<EditProfileView profile={profile} setProfile={setProfile} formData={formData} setFormData={setFormData} allCategories={allCategories} />} />
          <Route path="inventory" element={<InventoryView />} />
          <Route path="messages" element={<MessagesView inquiries={inquiries} setInquiries={setInquiries} fetchInquiries={fetchInquiries} />} />
        </Routes>
      </div>
    </div>
  )
}
