import React, { useState } from 'react';
import { useCampusBite } from '../../context/CampusBiteContext';
import { HostelAddress } from '../../types';
import { 
  MapPin, 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  Building, 
  Phone, 
  FileText,
  X,
  Sparkles
} from 'lucide-react';

export const SavedAddressesView: React.FC = () => {
  const { 
    addresses, 
    selectedAddressId, 
    setSelectedAddressId, 
    addAddress, 
    updateAddress, 
    deleteAddress, 
    setDefaultAddress,
    user,
    setStudentView
  } = useCampusBite();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  // Form fields
  const [label, setLabel] = useState('Hostel Room');
  const [hostelName, setHostelName] = useState('Aryabhatta Boys Hostel (H-4)');
  const [buildingName, setBuildingName] = useState('Block B - Wing 2');
  const [block, setBlock] = useState('Block B');
  const [floorNumber, setFloorNumber] = useState('3rd Floor');
  const [roomNumber, setRoomNumber] = useState('Room 314');
  const [studentPhoneNumber, setStudentPhoneNumber] = useState(user.phoneNumber || '+91 98765 43210');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');

  const openAddModal = () => {
    setEditingAddressId(null);
    setLabel('My Hostel Room');
    setHostelName('Aryabhatta Boys Hostel (H-4)');
    setBuildingName('North Wing');
    setBlock('Block A');
    setFloorNumber('2nd Floor');
    setRoomNumber('Room 205');
    setStudentPhoneNumber(user.phoneNumber || '+91 98765 43210');
    setDeliveryInstructions('');
    setIsModalOpen(true);
  };

  const openEditModal = (addr: HostelAddress) => {
    setEditingAddressId(addr.id);
    setLabel(addr.label);
    setHostelName(addr.hostelName);
    setBuildingName(addr.buildingName);
    setBlock(addr.block);
    setFloorNumber(addr.floorNumber);
    setRoomNumber(addr.roomNumber);
    setStudentPhoneNumber(addr.studentPhoneNumber);
    setDeliveryInstructions(addr.deliveryInstructions);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAddressId) {
      updateAddress(editingAddressId, {
        label,
        hostelName,
        buildingName,
        block,
        floorNumber,
        roomNumber,
        studentPhoneNumber,
        deliveryInstructions
      });
    } else {
      addAddress({
        label,
        hostelName,
        buildingName,
        block,
        floorNumber,
        roomNumber,
        studentPhoneNumber,
        deliveryInstructions,
        isDefault: addresses.length === 0
      });
    }
    setIsModalOpen(false);
  };

  const campusHostelPresets = [
    'Aryabhatta Boys Hostel (H-4)',
    'Ramanujan Hall of Residence (H-2)',
    'Kalpana Chawla Girls Hostel (GH-1)',
    'Gargi Hall of Residence (GH-3)',
    'Tagore Senior Research Hostel (H-6)',
    'Central Campus Library Reading Room'
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <span className="text-xs font-bold text-[#F07832] uppercase tracking-wider">
            Hostel Address System
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#242424] mt-0.5">
            Saved Campus Delivery Locations
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Save your hostel room, academic wing, or library desk for fast room delivery.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl bg-[#F07832] hover:bg-[#e06b25] text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Hostel Address</span>
        </button>
      </div>

      {/* Address Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map(addr => {
          const isSelected = selectedAddressId === addr.id;

          return (
            <div
              key={addr.id}
              className={`p-5 rounded-2xl border transition-all bg-white relative flex flex-col justify-between ${
                isSelected 
                  ? 'border-[#F07832] shadow-sm ring-1 ring-[#F07832]/30' 
                  : 'border-stone-200 hover:border-stone-300 shadow-xs'
              }`}
            >
              <div className="space-y-3">
                
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-sm text-stone-900">
                      {addr.label}
                    </span>
                    {addr.isDefault && (
                      <span className="bg-[#FFF0E4] text-[#F07832] text-[10px] font-bold px-2 py-0.5 rounded-md">
                        Default
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(addr)}
                      className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
                      title="Edit address"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {addresses.length > 1 && (
                      <button
                        onClick={() => deleteAddress(addr.id)}
                        className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete address"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Address Details */}
                <div className="space-y-1.5 text-xs text-stone-600">
                  <div className="flex items-start gap-2">
                    <Building className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-stone-900">{addr.hostelName}</p>
                      <p>{addr.buildingName} · {addr.block}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pl-6">
                    <span className="font-medium text-stone-900">{addr.roomNumber}</span>
                    <span>·</span>
                    <span>{addr.floorNumber}</span>
                  </div>

                  <div className="flex items-center gap-2 pl-6 text-stone-500">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{addr.studentPhoneNumber}</span>
                  </div>

                  {addr.deliveryInstructions && (
                    <div className="mt-2 p-2.5 bg-stone-50 rounded-xl text-[11px] text-stone-600 border border-stone-100">
                      <strong>Delivery Note:</strong> "{addr.deliveryInstructions}"
                    </div>
                  )}
                </div>

              </div>

              {/* Bottom Actions */}
              <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                {!addr.isDefault ? (
                  <button
                    onClick={() => setDefaultAddress(addr.id)}
                    className="text-stone-500 hover:text-[#F07832] font-semibold text-[11px]"
                  >
                    Set as Default
                  </button>
                ) : (
                  <span className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Primary Address
                  </span>
                )}

                <button
                  onClick={() => setSelectedAddressId(addr.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    isSelected 
                      ? 'bg-[#F07832] text-white' 
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {isSelected ? 'Selected' : 'Select for Order'}
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Address Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
          <div 
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 p-6 space-y-5 animate-in zoom-in-95"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-heading font-bold text-lg text-stone-900">
                {editingAddressId ? 'Edit Hostel Address' : 'Add New Hostel Room'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Label */}
              <div className="space-y-1">
                <label className="font-semibold text-stone-800">Address Label</label>
                <input
                  type="text"
                  required
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g. My Hostel Room, Friends Room, Study Room"
                  className="w-full p-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#F07832]"
                />
              </div>

              {/* Hostel Name Preset / Custom */}
              <div className="space-y-1">
                <label className="font-semibold text-stone-800">Hostel Name</label>
                <select
                  value={hostelName}
                  onChange={(e) => setHostelName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#F07832] bg-white"
                >
                  {campusHostelPresets.map(preset => (
                    <option key={preset} value={preset}>{preset}</option>
                  ))}
                </select>
              </div>

              {/* Building & Block */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-800">Building / Wing Name</label>
                  <input
                    type="text"
                    required
                    value={buildingName}
                    onChange={(e) => setBuildingName(e.target.value)}
                    placeholder="e.g. North Wing, Phase 1"
                    className="w-full p-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#F07832]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-stone-800">Block</label>
                  <input
                    type="text"
                    required
                    value={block}
                    onChange={(e) => setBlock(e.target.value)}
                    placeholder="e.g. Block A, Block B"
                    className="w-full p-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#F07832]"
                  />
                </div>
              </div>

              {/* Floor & Room */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-800">Floor Number</label>
                  <input
                    type="text"
                    required
                    value={floorNumber}
                    onChange={(e) => setFloorNumber(e.target.value)}
                    placeholder="e.g. 2nd Floor, Ground Floor"
                    className="w-full p-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#F07832]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-stone-800">Room Number</label>
                  <input
                    type="text"
                    required
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    placeholder="e.g. Room 218"
                    className="w-full p-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#F07832]"
                  />
                </div>
              </div>

              {/* Phone number */}
              <div className="space-y-1">
                <label className="font-semibold text-stone-800">Student Phone Number (for Runner)</label>
                <input
                  type="tel"
                  required
                  value={studentPhoneNumber}
                  onChange={(e) => setStudentPhoneNumber(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full p-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#F07832]"
                />
              </div>

              {/* Delivery Instructions */}
              <div className="space-y-1">
                <label className="font-semibold text-stone-800">Delivery Instructions (Optional)</label>
                <textarea
                  rows={2}
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                  placeholder="e.g. If door is locked, leave on shelf next to room door or call twice."
                  className="w-full p-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#F07832]"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 border border-stone-300 text-stone-700 font-semibold rounded-xl hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#F07832] hover:bg-[#e06b25] text-white font-semibold rounded-xl shadow-xs"
                >
                  {editingAddressId ? 'Save Changes' : 'Save Hostel Address'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
