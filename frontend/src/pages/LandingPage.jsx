import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllVendors } from '../api/vendor.api'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'

const categories = [
  { icon: 'chair', name: 'Furniture/Fixtures' },
  { icon: 'restaurant', name: 'Food/Beverage' },
  { icon: 'bed', name: 'Linens/Textiles' },
  { icon: 'cleaning_services', name: 'Housekeeping/Janitorial Services' },
  { icon: 'devices', name: 'Televisions/Electronics' },
  { icon: 'spa', name: 'In-Room Amenities' },
  { icon: 'local_laundry_service', name: 'Laundry Equipment' },
  { icon: 'security', name: 'Security Control/Safety Products' },
  { icon: 'kitchen', name: 'Equipment/Appliance Provider' },
  { icon: 'park', name: 'Landscaping' },
  { icon: 'build', name: 'Maintenance Supplies' },
  { icon: 'wifi', name: 'Internet Services' },
];

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

function VendorCard({ vendor }) {
  const rating = vendor.rating || 0;
  const reviewsCount = vendor.reviews_count || 0;
  // Default to initials of company name
  const getInitials = (name) => {
    if (!name) return 'V';
    const split = name.split(' ');
    if (split.length >= 2) return (split[0][0] + split[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className={`vendor-card${vendor.premium ? ' premium' : ''}`}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <div className="vendor-avatar">{getInitials(vendor.company_name)}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 2 }}>
            <span className="vendor-name">{vendor.company_name}</span>
            {vendor.is_featured && <span className="badge-premium">Featured</span>}
            {vendor.is_approved && (
              <span title="Verified Vendor" className="material-icons-round" style={{ fontSize: 16, color: '#C8A951' }}>verified</span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <StarRating rating={rating} />
            <span style={{ fontSize: 12, color: 'var(--on-surface-variant)' }}>{rating} ({reviewsCount} reviews)</span>
          </div>
        </div>
      </div>

      <p className="vendor-tagline" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{vendor.description || "Premium vendor..."}</p>

      <div className="vendor-meta">
        <span>
          <span className="material-icons-round" style={{ fontSize: 14 }}>location_on</span>
          {vendor.city || 'Global'}, {vendor.state || vendor.country || 'US'}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        <Link to={`/vendors/${vendor._id || vendor.id}`} className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
          View Profile
          <span className="material-icons-round" style={{ fontSize: 16 }}>arrow_forward</span>
        </Link>
        <button className="btn btn-outline btn-sm">
          <span className="material-icons-round" style={{ fontSize: 15 }}>mail_outline</span>
          RFQ
        </button>
      </div>
    </div>
  )
}

export default function LandingPage() {
  const { isAuthenticated } = useAuth()
  const [featuredVendors, setFeaturedVendors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const data = await getAllVendors(1, 3);
        setFeaturedVendors(data.data || []);
      } catch (error) {
        console.error("Failed to fetch featured vendors", error)
        toast.error("Could not load featured vendors");
      } finally {
        setLoading(false);
      }
    }
    fetchVendors();
  }, [])


  return (
    <>
      {/* ═══ HERO — Split layout (left text, right image) ══ */}
      <section className="hero-split" id="hero">
        <div className="container">
          <div className="hero-split-inner">
            {/* Left: text content */}
            <div className="hero-split-content">
              <div className="hero-eyebrow fade-up">B2B Hospitality Marketplace</div>
              <h1 className="fade-up fade-up-delay-1">
                The Architectural<br />Curator for<br />Hospitality Supply
              </h1>
              <p className="hero-subtitle fade-up fade-up-delay-2">
                Browse verified vendors across 60+ categories. Streamline your procurement with our curated database of hospitality solutions—furniture, F&B, tech, linens, and beyond.
              </p>
              <div className="hero-actions fade-up fade-up-delay-3">
                <Link to="/vendors" className="btn btn-secondary btn-lg">
                  Browse Vendors
                  <span className="material-icons-round">arrow_forward</span>
                </Link>
                {!isAuthenticated && (
                  <Link
                    to="/register"
                    className="btn btn-outline btn-lg"
                    style={{ borderColor: 'rgba(255,255,255,0.25)', color: '#ffffff' }}
                  >
                    List Your Business
                  </Link>
                )}
              </div>

            </div>

            {/* Right: image column */}
            <div className="hero-split-image fade-up fade-up-delay-2">
              <img
                src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80&auto=format&fit=crop"
                alt="Luxury hotel guestroom with premium furnishing"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CATEGORIES ══════════════════════════════════════ */}
      <section className="section" id="categories" style={{ background: 'var(--background)' }}>
        <div className="container">
          <div className="section-label">Explore</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
            <h2 className="headline-md">Browse by Category</h2>
            <Link to="/vendors" className="btn btn-ghost btn-sm">
              View All
              <span className="material-icons-round" style={{ fontSize: 16 }}>arrow_forward</span>
            </Link>
          </div>
          <div className="category-grid">
            {categories.map(cat => (
              <Link to={`/vendors?cat=${cat.name}`} key={cat.name} className="category-card">
                <div className="category-icon">
                  <span className="material-icons-round">{cat.icon}</span>
                </div>
                <span className="category-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══════════════════════════════════ */}
      <section style={{ background: 'var(--surface-low)', padding: '80px 0' }} id="how-it-works">
        <div className="container">
          <div className="section-label">Process</div>
          <h2 className="headline-md mb-32">Architectural Precision in 3 Steps</h2>
          <div className="steps">
            {[
              {
                n: '01',
                icon: 'search',
                title: 'Search',
                desc: 'Filter through thousands of verified providers based on specific hotel requirements, category, location, and certification standards.'
              },
              {
                n: '02',
                icon: 'visibility',
                title: 'Browse',
                desc: 'Evaluate detailed portfolios, performance ratings, compliance certifications, and real client testimonials for each vendor.'
              },
              {
                n: '03',
                icon: 'handshake',
                title: 'Connect',
                desc: 'Initiate secure RFQs and build long-term supply relationships through our integrated procurement console.'
              },
            ].map(step => (
              <div key={step.n} className="step-card">
                <div className="step-number">{step.n}</div>
                <h3 className="step-title">{step.title}</h3>
                <p style={{ color: 'var(--on-surface-variant)', fontSize: 14, lineHeight: 1.65 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURED VENDORS ═══════════════════════════════ */}
      <section className="section">
        <div className="container">
          <div className="section-label">Featured</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h2 className="headline-md">Top Performing Vendors</h2>
              <p style={{ color: 'var(--on-surface-variant)', marginTop: 4, fontSize: 14 }}>
                Top performing vendors this quarter
              </p>
            </div>
            <Link to="/vendors" className="btn btn-ghost btn-sm">
              View All Vendors
              <span className="material-icons-round" style={{ fontSize: 16 }}>arrow_forward</span>
            </Link>
          </div>
          <div className="grid-3">
            {featuredVendors.map(v => <VendorCard key={v._id || v.id} vendor={v} />)}
          </div>
        </div>
      </section>


      {!isAuthenticated && (
        <section style={{ background: 'var(--primary)', padding: '96px 0', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at 60% 50%, rgba(200,169,81,0.08) 0%, transparent 65%)',
            pointerEvents: 'none'
          }} />
          <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>For Vendors</div>
            <h2 className="headline-lg" style={{ color: '#ffffff', marginBottom: 16, marginTop: 4 }}>
              Connect with Hotels<br />Ready to Source
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, maxWidth: 460, margin: '0 auto 36px', lineHeight: 1.7 }}>
              List your hospitality business and receive qualified RFQs from verified hotel procurement managers.
            </p>
            <Link to="/register" className="btn btn-secondary btn-lg">
              Start Your Free Listing
              <span className="material-icons-round">arrow_forward</span>
            </Link>
          </div>
        </section>
      )}
    </>
  )
}
