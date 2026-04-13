import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getSavedVendors, saveVendor } from '../api/vendor.api'
import { toast } from 'react-toastify'

function StarRating({ rating }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map(i => (
        <span
          key={i}
          className={`material-icons-round star${i > Math.round(rating) ? ' star-empty' : ''}`}
          style={{ fontSize: 13 }}
        >star</span>
      ))}
    </div>
  )
}

export default function SavedVendors() {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchSaved = async () => {
    try {
      const res = await getSavedVendors()
      setVendors(res.data || [])
    } catch (e) {
      toast.error("Failed to load saved vendors")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSaved()
  }, [])

  const handleUnsave = async (id, e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await saveVendor(id)
      toast.success("Vendor removed from saved list")
      fetchSaved()
    } catch (e) {
      toast.error("Action failed")
    }
  }

  if (loading) return (
    <div className="container section" style={{ textAlign: 'center' }}>
      <div style={{ color: 'var(--primary)', fontWeight: 600 }}>Loading your saved vendors...</div>
    </div>
  )

  return (
    <div className="container section-sm" style={{ paddingBottom: 120 }}>
      <div style={{ marginBottom: 40 }}>
        <h1 className="display-md mb-8" style={{ color: 'var(--primary)' }}>Saved Vendors</h1>
        <p style={{ color: 'var(--on-surface-variant)' }}>Your curated list of hospitality partners and service providers.</p>
      </div>

      {vendors.length === 0 ? (
        <div style={{ 
          padding: '80px 0', 
          background: '#fff', 
          borderRadius: 12, 
          textAlign: 'center',
          boxShadow: 'var(--shadow-card)',
          border: '1px dashed var(--outline-variant)'
        }}>
          <span className="material-icons-round" style={{ fontSize: 64, color: 'var(--outline-variant)', marginBottom: 16 }}>bookmark_border</span>
          <h2 className="title-md mb-8">No saved vendors yet</h2>
          <p style={{ color: 'var(--on-surface-variant)', marginBottom: 24 }}>Browse the marketplace to find vendors you'd like to work with.</p>
          <Link to="/vendors" className="btn btn-primary">Discover Vendors</Link>
        </div>
      ) : (
        <div className="grid-3">
          {vendors.map(vendor => (
            <Link key={vendor._id} to={`/vendors/${vendor._id}`} className="vendor-card" style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ 
                  width: 52, height: 52, borderRadius: 12, 
                  background: 'var(--primary)', color: 'var(--gold)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  fontWeight: 800, fontSize: 18 
                }}>
                  {vendor.company_name?.charAt(0)}
                </div>
                <button 
                  onClick={(e) => handleUnsave(vendor._id, e)}
                  style={{ background: 'var(--gold-light)', color: 'var(--gold)', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Remove from saved"
                >
                  <span className="material-icons-round" style={{ fontSize: 18 }}>bookmark</span>
                </button>
              </div>

              <div>
                <h3 className="title-sm mb-4" style={{ color: 'var(--primary)' }}>{vendor.company_name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <StarRating rating={vendor.rating || 0} />
                  <span style={{ fontSize: 12, color: 'var(--on-surface-variant)', fontWeight: 600 }}>{vendor.rating || 0}</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--on-surface-variant)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {vendor.description}
                </p>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--outline-variant)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="material-icons-round" style={{ fontSize: 16, color: 'var(--outline)' }}>location_on</span>
                <span style={{ fontSize: 12, color: 'var(--on-surface-variant)' }}>{vendor.city}, {vendor.state || vendor.country}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
