import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getVendorById, saveVendor } from '../api/vendor.api'
import { createInquiry } from '../api/inquiry.api'
import { addReview, getVendorReviews } from '../api/review.api'
import { toast } from 'react-toastify'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

function StarRating({ rating, size = 14 }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map(i => (
        <span
          key={i}
          className={`material-icons-round star${i > Math.round(rating) ? ' star-empty' : ''}`}
          style={{ fontSize: size }}
        >star</span>
      ))}
    </div>
  )
}

function ReviewCard({ r }) {
  const initials = r.user_id?.full_name ? r.user_id.full_name.charAt(0).toUpperCase() : 'U';
  const authorName = r.user_id?.full_name || 'Verified Buyer';
  
  return (
    <div style={{ background: '#fff', borderRadius: 8, padding: 24, boxShadow: 'var(--shadow-card)', border: '1px solid var(--outline-variant)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12, gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'var(--surface-container)', color: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 13, flexShrink: 0,
          }}>{initials}</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
              {authorName}
              <span className="material-icons-round" style={{ fontSize: 14, color: 'var(--success)' }}>verified</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--on-surface-variant)', marginTop: 2 }}>Verified Hotel Manager</div>
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <StarRating rating={r.rating} />
          <div style={{ fontSize: 11, color: 'var(--on-surface-variant)', marginTop: 6 }}>{new Date(r.createdAt).toLocaleDateString()}</div>
        </div>
      </div>
      <p style={{ fontSize: 14, color: 'var(--on-surface)', lineHeight: 1.6, fontStyle: 'italic' }}>"{r.comment}"</p>
    </div>
  )
}

export default function VendorProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const [vendor, setVendor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [rfqSent, setRfqSent] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [formData, setFormData] = useState({ name: '', hotel: '', email: '', message: '' })

  const [vendorReviews, setVendorReviews] = useState([])
  const [reviewStats, setReviewStats] = useState({ rating: 0, count: 0 })
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' })
  const [submittingReview, setSubmittingReview] = useState(false)

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const data = await getVendorById(id);
        const vData = data.data || data;
        setVendor(vData);
        if (user && user.saved_vendors) {
          setIsSaved(user.saved_vendors.includes(id));
        }
      } catch (error) {
        console.error("Vendor load error", error);
        setVendor(null);
      } finally {
        setLoading(false);
      }
    };
    fetchVendor();

    const fetchReviews = async () => {
      try {
        const res = await getVendorReviews(id);
        if (res.data) {
          setVendorReviews(res.data.reviews || []);
          setReviewStats(res.data.stats || { rating: 0, count: 0 });
        }
      } catch (e) {}
    };
    fetchReviews();
  }, [id, user]);

  const handleAddReview = async () => {
    if (!newReview.comment.trim()) return toast.error("Please add a comment");
    setSubmittingReview(true);
    try {
      await addReview({
        vendor_id: id,
        rating: newReview.rating,
        comment: newReview.comment
      });
      toast.success("Review posted!");
      setNewReview({ rating: 5, comment: '' });
      // Refresh reviews
      const res = await getVendorReviews(id);
      setVendorReviews(res.data.reviews || []);
      setReviewStats(res.data.stats || { rating: 0, count: 0 });
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to post review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
        <div style={{ color: 'var(--primary)', fontWeight: 600 }}>Loading vendor...</div>
      </div>
    )
  }

  if (!vendor) {
    return (
      <div style={{ padding: '120px 0', textAlign: 'center', background: 'var(--background)', minHeight: '100vh' }}>
        <span className="material-icons-round" style={{ fontSize: 64, color: 'var(--outline-variant)', display: 'block', marginBottom: 16 }}>search_off</span>
        <h2 style={{ color: 'var(--primary)', marginBottom: 8 }}>Vendor not found</h2>
        <p style={{ color: 'var(--on-surface-variant)', marginBottom: 24 }}>This vendor may have been removed or the link is incorrect.</p>
        <Link to="/vendors" className="btn btn-primary">Back to Listings</Link>
      </div>
    )
  }

  const getInitials = (name) => {
    if (!name) return 'V';
    const split = name.split(' ');
    if (split.length >= 2) return (split[0][0] + split[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const rating = reviewStats.rating || 0;
  const reviewsCount = reviewStats.count || 0;
  const location = `${vendor.city || ''}, ${vendor.state || vendor.country || 'US'}`;

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh' }}>
      {/* ══ PROFILE HERO ══ */}
      <div className="profile-hero">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="breadcrumb">
            <Link to="/vendors">Marketplace</Link>
            <span className="sep material-icons-round" style={{ fontSize: 18 }}>chevron_right</span>
            <span>{vendor.company_name}</span>
          </nav>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' }}>
            {/* Left: avatar + info */}
            <div className="profile-avatar-lg">{getInitials(vendor.company_name)}</div>

            <div style={{ flex: 1, minWidth: 240 }}>
              {/* Name row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 6 }}>
                <h1 className="profile-name">{vendor.company_name}</h1>
                {vendor.is_featured && <span className="badge-premium">Featured</span>}
                {vendor.is_approved && (
                  <span className="verified-badge">
                    <span className="material-icons-round" style={{ fontSize: 15 }}>verified</span>
                    Verified Vendor
                  </span>
                )}
              </div>

              <p className="profile-subtitle">{vendor.description}</p>

              {/* Meta row */}
              <div style={{ display: 'flex', gap: 24, marginTop: 16, flexWrap: 'wrap' }}>
                <span className="profile-meta-item">
                  <StarRating rating={rating} size={13} />
                  <strong style={{ marginLeft: 4 }}>{rating}</strong>
                  <span>({reviewsCount} reviews)</span>
                </span>
                <span className="profile-meta-item">
                  <span className="material-icons-round" style={{ fontSize: 15 }}>location_on</span>
                  {location}
                </span>
                {vendor.since && (
                  <span className="profile-meta-item">
                    <span className="material-icons-round" style={{ fontSize: 15 }}>calendar_today</span>
                    Est. {vendor.since}
                  </span>
                )}
              </div>
            </div>

            {/* Right: CTA buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 180, flexShrink: 0 }}>
              {rfqSent ? (
                <div style={{
                  background: 'rgba(26, 122, 74, 0.15)', color: '#4ade80',
                  borderRadius: 6, padding: '12px 20px', textAlign: 'center',
                  fontWeight: 600, fontSize: 14,
                  border: '1px solid rgba(74, 222, 128, 0.25)',
                }}>
                  <span className="material-icons-round" style={{ fontSize: 20, display: 'block', margin: '0 auto 4px' }}>check_circle</span>
                  RFQ Sent!
                </div>
              ) : (
                <button 
                  className="btn btn-secondary btn-lg" 
                  onClick={async () => {
                    if (!user) {
                      toast.info("Please login to send an RFQ");
                      navigate('/login');
                      return;
                    }
                    try {
                      await createInquiry({
                        vendor_id: vendor._id,
                        hotel_name: "Interested Buyer", // Placeholder or from user profile if we had one
                        full_name: user.full_name,
                        email: user.email,
                        message: `Hello ${vendor.company_name}, I am interested in your services and would like to request a formal quote.`
                      });
                      setRfqSent(true);
                      toast.success("Quote request sent successfully!");
                    } catch (e) {
                      toast.error("Failed to send quote request.");
                    }
                  }}
                >
                  <span className="material-icons-round">mail_outline</span>
                  Request Quote
                </button>
              )}
              <button 
                className={`btn ${isSaved ? 'btn-primary' : 'btn-outline'} btn-sm`}
                onClick={async () => {
                  if (!user) {
                    toast.info("Please login to save this vendor");
                    navigate('/login');
                    return;
                  }
                  try {
                    const res = await saveVendor(vendor._id || vendor.id);
                    setIsSaved(res.data.saved);
                    toast.success(res.data.saved ? "Vendor saved!" : "Vendor removed from favorites");
                  } catch (e) {
                    toast.error("Failed to save vendor");
                  }
                }}
              >
                <span className="material-icons-round" style={{ fontSize: 15 }}>{isSaved ? 'bookmark' : 'bookmark_border'}</span>
                {isSaved ? 'Saved' : 'Save Vendor'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ══ TABS + CONTENT ══ */}
      <div className="container" style={{ paddingTop: 36, paddingBottom: 80 }}>
        <div className="tab-bar">
          {['overview', 'contact', 'reviews'].map(tab => (
            <button
              key={tab}
              className={`tab${activeTab === tab ? ' active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="profile-content-grid">
          {/* ── Main content ── */}
          <div>
            {/* OVERVIEW */}
            {activeTab === 'overview' && (
              <>
                <h2 className="title-md mb-16">About {vendor.company_name}</h2>
                <p className="body-lg" style={{ color: 'var(--on-surface-variant)', marginBottom: 36 }}>{vendor.description || 'Verified hospitality vendor providing extensive services directly addressing procurement needs.'}</p>

                {vendor.categories && vendor.categories.length > 0 && (
                  <>
                    <h3 className="title-sm mb-16" style={{ color: 'var(--primary)' }}>Specialized Categories</h3>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 36 }}>
                      {vendor.categories.map((cat, i) => (
                        <div key={i} className="chip chip-gold" style={{ padding: '6px 14px' }}>
                          {cat.name || cat}
                        </div>
                      ))}
                    </div>
                  </>
                )}
                
                {vendor.address_line1 && (
                  <>
                    <h3 className="title-sm mb-16" style={{ color: 'var(--primary)' }}>Business Address</h3>
                    <p style={{ color: 'var(--on-surface-variant)', marginBottom: 36 }}>
                      {vendor.address_line1} {vendor.address_line2} <br/>
                      {vendor.city}, {vendor.state} {vendor.zip_code} {vendor.country}
                    </p>
                  </>
                )}
              </>
            )}

            {/* REVIEWS */}
            {activeTab === 'reviews' && (
              <>
                <div style={{ background: '#fff', borderRadius: 12, padding: 32, marginBottom: 32, display: 'flex', alignItems: 'center', gap: 48, boxShadow: 'var(--shadow-card)' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 64, fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>{rating}</div>
                    <div style={{ marginTop: 12 }}><StarRating rating={rating} size={20} /></div>
                    <div style={{ fontSize: 13, color: 'var(--on-surface-variant)', marginTop: 8, fontWeight: 600 }}>{reviewsCount} Total Reviews</div>
                  </div>
                  
                  <div style={{ flex: 1, borderLeft: '1px solid var(--outline-variant)', paddingLeft: 48 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--primary)', marginBottom: 8 }}>Rating Performance</h3>
                    <p style={{ color: 'var(--on-surface-variant)', fontSize: 14, lineHeight: 1.6 }}>
                      Based on verified procurement experiences within the StaySource marketplace. Our architecture ensures all feedback is from legitimate hotel industry professionals.
                    </p>
                  </div>
                </div>

                {/* Add Review Form (Only for Hotel Owners) */}
                {user && user.role === 'hotel_owner' && (
                  <div style={{ background: 'var(--surface-container)', borderRadius: 12, padding: 24, marginBottom: 32 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--primary)', marginBottom: 16 }}>Share Your Experience</h3>
                    <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
                      {[1, 2, 3, 4, 5].map(i => (
                        <span 
                          key={i} 
                          className="material-icons-round" 
                          style={{ cursor: 'pointer', fontSize: 24, color: i <= newReview.rating ? 'var(--gold)' : 'var(--outline-variant)' }}
                          onClick={() => setNewReview({ ...newReview, rating: i })}
                        >
                          star
                        </span>
                      ))}
                    </div>
                    <textarea 
                      className="input" 
                      placeholder="Was the delivery on time? How was the product quality? Describe your experience..." 
                      rows={3} 
                      value={newReview.comment}
                      onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                      style={{ marginBottom: 16, background: '#fff' }}
                    />
                    <button 
                      className="btn btn-primary" 
                      onClick={handleAddReview}
                      disabled={submittingReview}
                    >
                      {submittingReview ? 'Posting...' : 'Post Review'}
                    </button>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {vendorReviews.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px 0', background: '#fff', borderRadius: 8, border: '1px dashed var(--outline-variant)' }}>
                      <p style={{ color: 'var(--on-surface-variant)' }}>No reviews yet. Be the first to share your experience!</p>
                    </div>
                  ) : (
                    vendorReviews.map((r, i) => <ReviewCard key={i} r={r} />)
                  )}
                </div>
              </>
            )}

            {/* CONTACT */}
            {activeTab === 'contact' && (
              <>
                <h2 className="title-md mb-24">Contact Information</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{
                      display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer',
                      background: 'var(--surface-white)', borderRadius: 6,
                      padding: '18px 22px', boxShadow: 'var(--shadow-card)',
                      transition: 'transform 0.2s'
                  }} onClick={() => vendor.email && window.open('mailto:' + vendor.email)}>
                    <div className="contact-icon" style={{
                          width: 40, height: 40, borderRadius: 6,
                          background: 'var(--gold-light)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'var(--gold)', fontSize: 20, flexShrink: 0,
                    }}>
                      <span className="material-icons-round">mail_outline</span>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--on-surface-variant)', marginBottom: 2 }}>Email</div>
                      <div style={{ fontWeight: 500, fontSize: 14, color: 'var(--on-surface)' }}>{vendor.email || 'N/A'}</div>
                    </div>
                  </div>

                  <div style={{
                      display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer',
                      background: 'var(--surface-white)', borderRadius: 6,
                      padding: '18px 22px', boxShadow: 'var(--shadow-card)',
                      transition: 'transform 0.2s'
                  }} onClick={() => vendor.phone && window.open('tel:' + vendor.phone)}>
                    <div className="contact-icon" style={{
                          width: 40, height: 40, borderRadius: 6,
                          background: 'var(--gold-light)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'var(--gold)', fontSize: 20, flexShrink: 0,
                    }}>
                      <span className="material-icons-round">phone</span>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--on-surface-variant)', marginBottom: 2 }}>Phone</div>
                      <div style={{ fontWeight: 500, fontSize: 14, color: 'var(--on-surface)' }}>{vendor.phone || 'N/A'}</div>
                    </div>
                  </div>

                  {vendor.website && (
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer',
                        background: 'var(--surface-white)', borderRadius: 6,
                        padding: '18px 22px', boxShadow: 'var(--shadow-card)',
                        transition: 'transform 0.2s'
                    }} onClick={() => window.open(vendor.website.includes('http') ? vendor.website : 'https://' + vendor.website, '_blank')}>
                      <div className="contact-icon" style={{
                            width: 40, height: 40, borderRadius: 6,
                            background: 'var(--gold-light)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'var(--gold)', fontSize: 20, flexShrink: 0,
                      }}>
                        <span className="material-icons-round">language</span>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--on-surface-variant)', marginBottom: 2 }}>Website</div>
                        <div style={{ fontWeight: 500, fontSize: 14, color: 'var(--primary)' }}>{vendor.website}</div>
                      </div>
                    </div>
                  )}

                  {vendor.contact_first_name && (
                     <div style={{
                        display: 'flex', alignItems: 'center', gap: 16,
                        background: 'var(--surface-white)', borderRadius: 6,
                        padding: '18px 22px',
                        boxShadow: 'var(--shadow-card)',
                        marginTop: 12
                    }}>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--on-surface-variant)', marginBottom: 2 }}>Primary Contact</div>
                        <div style={{ fontWeight: 500, fontSize: 14, color: 'var(--on-surface)' }}>
                           {vendor.contact_salutation || ''} {vendor.contact_first_name} {vendor.contact_last_name}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* ── Sidebar enquiry form ── */}
          <div>
            <div className="sticky-sidebar" style={{
              background: 'var(--surface-white)',
              borderRadius: 6,
              padding: 24,
              boxShadow: 'var(--shadow-ambient)',
            }}>
              <h3 className="title-sm mb-16">Send an Enquiry</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="input-group">
                  <label className="input-label" htmlFor="enq-name">Your Name</label>
                  <input
                    id="enq-name"
                    className="input"
                    placeholder="Hotel manager name"
                    value={formData.name}
                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="enq-hotel">Hotel Name</label>
                  <input
                    id="enq-hotel"
                    className="input"
                    placeholder="Property name"
                    value={formData.hotel}
                    onChange={e => setFormData(p => ({ ...p, hotel: e.target.value }))}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="enq-email">Email</label>
                  <input
                    id="enq-email"
                    type="email"
                    className="input"
                    placeholder="procurement@hotel.com"
                    value={formData.email}
                    onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="enq-msg">Message</label>
                  <textarea
                    id="enq-msg"
                    className="input"
                    rows={4}
                    placeholder="Describe your requirements…"
                    style={{ resize: 'vertical' }}
                    value={formData.message}
                    onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                  />
                </div>
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={async () => {
                    try {
                      await createInquiry({
                        vendor_id: id,
                        full_name: formData.name,
                        hotel_name: formData.hotel,
                        email: formData.email,
                        message: formData.message
                      });
                      setRfqSent(true);
                      toast.success("Enquiry sent successfully!");
                      setActiveTab('overview');
                    } catch (error) {
                      toast.error("Failed to send enquiry");
                    }
                  }}
                >
                  Send Request for Quote
                </button>
              </div>

              <div className="divider" />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { icon: 'lock_outline',   text: 'Secure, encrypted contact' },
                  { icon: 'verified_user',  text: 'Identity verified vendor' },
                ].map(item => (
                  <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'var(--on-surface-variant)' }}>
                    <span className="material-icons-round" style={{ fontSize: 16, color: 'var(--gold)' }}>{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
