import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { searchVendors } from '../api/search.api'
import { getAllCategories } from '../api/category.api'
import { toast } from 'react-toastify'

function StarRating({ rating, size = 13 }) {
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

export default function BrowseVendors() {
  const [searchParams] = useSearchParams()
  const initialCat = searchParams.get('category') || searchParams.get('cat') || ''

  const [loading, setLoading] = useState(true)
  const [vendors, setVendors] = useState([])
  const [pagination, setPagination] = useState({})
  const [allCategories, setAllCategories] = useState([])
  // Filters
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState(initialCat)
  const [stateFilter, setStateFilter] = useState('')
  const [cityFilter, setCityFilter] = useState('')

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const cats = await getAllCategories();
        // Assume API returns array of objects like { id, name } or raw strings
        setAllCategories(cats.data || []);
      } catch (error) {
        console.error("Categories fetch error", error);
      }
    }
    fetchInitialData();
  }, []);

  const fetchVendorsData = async () => {
    setLoading(true);
    try {
      const data = await searchVendors({
        category: selectedCat,
        state: stateFilter,
        city: cityFilter,
        keyword: search,
        page: 1,
        limit: 50
      });
      setVendors(data.data || []);
      setPagination(data.pagination || {});
    } catch (error) {
      toast.error("Error fetching vendors");
    } finally {
        setLoading(false);
    }
  }

  useEffect(() => {
    fetchVendorsData();
  }, [selectedCat, stateFilter, cityFilter, search]);

  const clearFilters = () => {
    setSelectedCat('');
    setStateFilter('');
    setCityFilter('');
    setSearch('');
  }

  const hasFilters = selectedCat || stateFilter || cityFilter || search;

  const getInitials = (name) => {
    if (!name) return 'V';
    const split = name.split(' ');
    if (split.length >= 2) return (split[0][0] + split[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh' }}>
      {/* ══ PAGE HEADER ══════════════════════════════════ */}
      <div style={{ background: 'var(--primary)', padding: '56px 0 48px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 85% 50%, rgba(200,169,81,0.07) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-label" style={{ color: 'var(--gold)' }}>Browse</div>
          <h1 className="headline-lg" style={{ color: '#ffffff', marginBottom: 10, marginTop: 4 }}>Find Your Perfect Vendor</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, marginBottom: 28, maxWidth: 480, lineHeight: 1.65 }}>
            Verified suppliers across multiple hospitality categories
          </p>
          {/* Search bar */}
          <div className="input-icon" style={{ maxWidth: 560 }}>
            <span className="material-icons-round icon">search</span>
            <input
              id="vendor-search"
              className="input"
              placeholder="Search by keywords..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                background: 'rgba(255,255,255,0.08)',
                color: '#ffffff',
                borderColor: 'rgba(255,255,255,0.15)',
              }}
            />
          </div>
        </div>
      </div>

      {/* ══ BROWSE LAYOUT ════════════════════════════════ */}
      <div className="container section-sm">
        <div className="browse-layout">
          {/* ── Filter Sidebar ── */}
          <aside>
            <div className="filter-panel sticky-sidebar">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--primary)' }}>Filter Results</span>
                {hasFilters && (
                  <button
                    className="btn btn-ghost btn-xs"
                    onClick={clearFilters}
                    style={{ fontSize: 12 }}
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="filter-section">
                <label className="filter-section-title" htmlFor="filter-category">Category</label>
                <select 
                   id="filter-category" 
                   className="input" 
                   value={selectedCat} 
                   onChange={(e) => setSelectedCat(e.target.value)}
                   style={{ marginBottom: 12 }}
                >
                   <option value="">All Categories</option>
                   {allCategories.map(cat => (
                     <option key={cat._id || cat.id || cat.name || cat} value={cat.name || cat}>{cat.name || cat}</option>
                   ))}
                </select>
              </div>

              <div className="filter-section">
                <label className="filter-section-title" htmlFor="filter-state">State / Region</label>
                <input 
                   id="filter-state" 
                   className="input" 
                   value={stateFilter} 
                   placeholder="e.g. NY"
                   onChange={(e) => setStateFilter(e.target.value)} 
                   style={{ marginBottom: 12 }}
                />
              </div>

               <div className="filter-section">
                <label className="filter-section-title" htmlFor="filter-city">City</label>
                <input 
                   id="filter-city" 
                   className="input" 
                   value={cityFilter} 
                   placeholder="e.g. New York"
                   onChange={(e) => setCityFilter(e.target.value)} 
                />
              </div>
            </div>
          </aside>

          {/* ── Results ── */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
              <p style={{ fontSize: 13, color: 'var(--on-surface-variant)' }}>
                Showing <strong style={{ color: 'var(--on-surface)' }}>{vendors.length}</strong> vendors
              </p>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--on-surface-variant)' }}>
                 <p style={{ fontSize: 16, fontWeight: 600 }}>Loading vendors...</p>
              </div>
            ) : vendors.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--on-surface-variant)' }}>
                <span className="material-icons-round" style={{ fontSize: 52, display: 'block', marginBottom: 16, opacity: 0.25 }}>search_off</span>
                <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--on-surface)', marginBottom: 6 }}>No vendors match</p>
                <p style={{ fontSize: 13 }}>Try adjusting or clearing your filters</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {vendors.map(vendor => (
                  <div
                    key={vendor._id || vendor.id}
                    className="vendor-card"
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 20, padding: '20px 24px' }}
                  >
                    {/* Avatar */}
                    <div className="vendor-avatar" style={{ flexShrink: 0 }}>{getInitials(vendor.company_name)}</div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
                        <span className="vendor-name">{vendor.company_name}</span>
                        {vendor.is_featured && <span className="badge-premium">Featured</span>}
                      </div>
                      <p className="vendor-tagline" style={{ maxWidth: 500, marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{vendor.description || 'Premium vendor...'}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <StarRating rating={vendor.rating || 0} />
                          <span style={{ fontSize: 12, color: 'var(--on-surface-variant)' }}>{vendor.rating || 0} ({vendor.reviews_count || 0} reviews)</span>
                        </div>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--on-surface-variant)' }}>
                          <span className="material-icons-round" style={{ fontSize: 13 }}>location_on</span>
                          {vendor.city || 'Global'}, {vendor.state || 'US'}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
                      <Link to={`/vendors/${vendor._id || vendor.id}`} className="btn btn-primary btn-sm">
                        View Profile
                      </Link>
                      <button className="btn btn-outline btn-sm">
                        Send RFQ
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
