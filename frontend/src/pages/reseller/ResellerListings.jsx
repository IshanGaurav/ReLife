import React, { useState, useEffect } from 'react';
import { Package, Search, Plus, ExternalLink, Leaf } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyRelifeListingsApi, deleteRelifeListingApi } from '../../api/client';
import { getImageUrl } from '../../utils/imageUtils';

export default function ResellerListings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const data = await getMyRelifeListingsApi();
      if (data && Array.isArray(data)) {
        // Format the data to match UI expectations
        const formattedProducts = data.map(p => ({
          id: p._id,
          name: p.name,
          sku: p.originalId,
          price: p.relifePrice,
          status: p.status === 'ACTIVE' || p.status === 'active' ? 'active' : p.status === 'PENDING' || p.status === 'pending' ? 'pending' : 'sold',
          condition: p.availableUnits?.[0]?.conditionLabel || 'Good',
          score: p.conditionScore || 90,
          greenCredits: p.greenCredits || 35,
          image: p.image,
          dateListed: p.createdAt
        }));
        setProducts(formattedProducts);
      }
    } catch (err) {
      console.error("Failed to load listings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing? You can relist it later from your Purchase History.")) return;
    try {
      await deleteRelifeListingApi(id);
      fetchListings(); // Refresh the list
    } catch (error) {
      alert(error.message || "Failed to delete listing");
    }
  };

  const filteredProducts = products.filter(p => {
    if (activeTab === 'active') return p.status === 'active';
    if (activeTab === 'pending') return p.status === 'pending';
    if (activeTab === 'sold') return p.status === 'sold';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0F1111]">My ReLife Listings</h1>
          <p className="text-sm text-[#565959] mt-1">Manage your resold products and Digital Passports.</p>
        </div>
        <button 
          onClick={() => navigate('/reseller')}
          className="bg-[#FFD814] hover:bg-[#F7CA00] px-4 py-2 rounded-md font-medium text-sm flex items-center border border-[#FCD200] shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4 mr-1" /> Sell Another Item
        </button>
      </div>

      <div className="bg-white border border-[#D5D9D9] rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="border-b border-[#D5D9D9] bg-[#F7FAFA] px-6 py-4 flex items-center justify-between">
          <div className="flex space-x-6">
            <button 
              onClick={() => setActiveTab('active')}
              className={`pb-4 -mb-4 font-bold text-sm ${activeTab === 'active' ? 'text-[#0F1111] border-b-2 border-[#C7511F]' : 'text-[#007185] hover:text-[#C7511F]'}`}
            >
              Active Listings
            </button>
            <button 
              onClick={() => setActiveTab('pending')}
              className={`pb-4 -mb-4 font-bold text-sm ${activeTab === 'pending' ? 'text-[#0F1111] border-b-2 border-[#C7511F]' : 'text-[#007185] hover:text-[#C7511F]'}`}
            >
              Pending Inspection
            </button>
            <button 
              onClick={() => setActiveTab('sold')}
              className={`pb-4 -mb-4 font-bold text-sm ${activeTab === 'sold' ? 'text-[#0F1111] border-b-2 border-[#C7511F]' : 'text-[#007185] hover:text-[#C7511F]'}`}
            >
              Sold Products
            </button>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
             <div className="flex justify-center p-12">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF9900]"></div>
             </div>
          ) : filteredProducts.length === 0 ? (
             <div className="text-center py-12">
               <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
               <h3 className="text-lg font-bold text-[#0F1111]">No listings found</h3>
               <p className="text-[#565959] mt-1">You don't have any products in this category.</p>
             </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map(product => (
                <div key={product.id} className="border border-[#D5D9D9] rounded-lg p-4 flex items-center justify-between hover:border-[#FF9900] transition-colors">
                  <div className="flex items-center">
                    <div className="bg-[#F7FAFA] p-2 rounded-md border border-gray-100 mr-4">
                      <img src={getImageUrl(product.coverImage || product.thumbnailUrl || product.image)} alt={product.name} className="w-16 h-16 object-contain mix-blend-multiply" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#0F1111]">{product.name}</h3>
                      <div className="flex items-center text-xs text-[#565959] mt-1 space-x-3">
                        <span>SKU: {product.sku}</span>
                        <span>Listed: {new Date(product.dateListed).toLocaleDateString()}</span>
                        <span className="flex items-center text-[#16a34a] font-bold">
                           <Leaf className="w-3 h-3 mr-1" /> +{product.greenCredits} Credits
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-8">
                    <div className="text-right">
                      <div className="text-sm text-[#565959]">Listing Price</div>
                      <div className="font-bold text-lg text-[#B12704]">₹{product.price.toLocaleString()}</div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-[#565959]">Condition</div>
                      <div className="font-bold text-[#0F1111]">{product.condition} ({product.score}/100)</div>
                    </div>

                    <div className="text-right w-32">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        product.status === 'active' ? 'bg-green-100 text-green-800' :
                        product.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {product.status === 'active' ? 'Active' : product.status === 'pending' ? 'Pending Inspection' : 'Sold'}
                      </span>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      <button className="text-[#007185] hover:text-[#C7511F] text-sm flex items-center font-medium">
                        View Passport <ExternalLink className="w-4 h-4 ml-1" />
                      </button>
                      {product.status === 'active' && (
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-800 text-sm flex items-center font-medium"
                        >
                          Delete Listing
                        </button>
                      )}
                      {product.status === 'sold' && (
                        <span className="text-[#16a34a] text-sm font-bold flex items-center mt-2">
                           ✓ Payment Received
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
