/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Heart, LogOut, Edit, Plus, Trash2, LoaderCircle, User, CircleSlash2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import Header from "../components/layout/Header";
import { useLocation } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { Product } from "../types/product";
import { OrderList } from "../components/order/OrderList";
import { updateProfile } from "../services/authService";
import { useToast } from "../hooks/useToast";
import LoginRegisterSection from "./LoginRegisterSection";

type TabType = "profile" | "orders" | "wishlist";

interface NavItemType {
  id: TabType;
  name: string;
  icon: React.ElementType;
}

const AccountPage: React.FC = () => {
  const { customer, isAuthenticated, logout, token, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [isEditing, setIsEditing] = useState(false);
  const { wishlist, removeFromWishlist, addToCart } = useCart();
  const toast = useToast();
  const location = useLocation();

  /** ----------------------------
   * NAVIGATION
   ----------------------------- */
  const Navigation: NavItemType[] = [
    { id: "profile", name: "Profile Information", icon: User },
    { id: "orders", name: "Order History", icon: Package },
    { id: "wishlist", name: "Wishlist", icon: Heart },
  ];

  /** ----------------------------
   * HANDLE QUERY PARAM FOR ACTIVE TAB
   ----------------------------- */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("activeTab") as TabType;

    if (["profile", "orders", "wishlist"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  /** ----------------------------
   * PROFILE DATA STATE
   ----------------------------- */
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  // Sync state when customer loads
  useEffect(() => {
    if (customer) {
      setProfileData({
        firstName: customer.firstName || "",
        lastName: customer.lastName || "",
        email: customer.email || "",
        phone: customer.phone || "",
      });
    }
  }, [customer]);

  /** ----------------------------
   * HANDLE PROFILE UPDATE
   ----------------------------- */
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);

    try {
      const updated = await updateProfile(profileData);
      toast.success("Profile updated successfully!");
      console.log("Updated Profile:", updated);

    } catch (error: any) {
      console.error("Profile update failed:", error);
      toast.error(error?.message || "Failed to update profile. Please try again.");
    }
  };

  /** ----------------------------
   * ADD TO CART HANDLER
   ----------------------------- */
  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  /** ----------------------------
   * UNAUTHENTICATED VIEW
   ----------------------------- */
  if (!isAuthenticated || !customer) {
    return <LoginRegisterSection />;
  }

  /** ----------------------------
   * AUTHENTICATED VIEW
   ----------------------------- */
  return (
    <>
      <Header title="My Account" descripton="Account details" />

      <div className="min-h-screen bg-gradient-to-r from-black/95 to-yellow-700/95">
        <div className="px-6 sm:px-6 lg:px-32 py-20">

          {/* HEADER */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-purple-600">My Account</h1>
            <p className="text-sm text-gray-300">Welcome back, {customer.firstName}!</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">

            {/* SIDEBAR */}
            <div className="">
              <div className="bg-black/20 backdrop-blur-lg border border-yellow-500/20 rounded-2xl shadow-sm p-6 sticky top-24">

                {/* AVATAR */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {customer.firstName?.[0]}{customer.lastName?.[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-purple-600">{customer.firstName} {customer.lastName}</p>
                    <p className="text-sm text-gray-300">{customer.email}</p>
                  </div>
                </div>

                {/* NAVIGATION */}
                <nav className="space-y-1">
                  {Navigation.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full text-left text-sm px-3 py-3 rounded-lg transition-colors flex items-center space-x-3 ${
                        activeTab === item.id
                          ? "bg-yellow-600/20 text-purple-600 font-medium"
                          : "text-gray-50 hover:bg-yellow-600/10"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </button>
                  ))}

                  {/* LOGOUT */}
                  <button
                    onClick={logout}
                    className="w-full text-left text-sm px-3 py-3 rounded-lg text-red-600 bg-transparent hover:bg-yellow-600/20 transition-colors flex items-center space-x-3 mt-4"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </nav>
              </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">

                {/* PROFILE TAB */}
                {activeTab === "profile" && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-black/20 backdrop-blur-lg border border-yellow-500/20 rounded-2xl shadow-sm p-6"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-purple-600">Profile Information</h2>

                      {!isEditing && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700"
                        >
                          <Edit className="h-4 w-4" />
                          <span>Edit Profile</span>
                        </button>
                      )}
                    </div>

                    {isEditing ? (
                      <form onSubmit={handleProfileUpdate} className="space-y-4">

                        {/* Names */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <InputField
                            label="First Name"
                            value={profileData.firstName}
                            onChange={(v) => setProfileData({ ...profileData, firstName: v })}
                          />

                          <InputField
                            label="Last Name"
                            value={profileData.lastName}
                            onChange={(v) => setProfileData({ ...profileData, lastName: v })}
                          />
                        </div>

                        {/* Email & Phone */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <InputField
                            label="Email Address"
                            value={profileData.email}
                            type="email"
                            onChange={(v) => setProfileData({ ...profileData, email: v })}
                          />

                          <InputField
                            label="Phone Number"
                            value={profileData.phone}
                            type="tel"
                            onChange={(v) => setProfileData({ ...profileData, phone: v })}
                          />
                        </div>

                        {/* SAVE / CANCEL */}
                        <div className="flex space-x-3 pt-4">
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1"
                          >
                            {isLoading && <LoaderCircle size={18} className="animate-spin" />}
                            Save Changes
                          </button>

                          <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="px-6 py-2 border-2 border-yellow-600/20 text-sm text-yellow-500 hover:bg-yellow-800/40 rounded-lg font-semibold"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <ProfileView profile={profileData} />
                    )}
                  </motion.div>
                )}

                {/* ORDERS TAB */}
                {activeTab === "orders" && (
                  <motion.div
                    key="orders"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-black/20 backdrop-blur-lg border border-yellow-500/20 rounded-2xl shadow-sm"
                  >
                    <div className="p-6 border-b border-yellow-600/20">
                      <h2 className="text-xl font-semibold text-purple-600">Order History</h2>
                      <p className="text-gray-300 mt-1">View and track your orders</p>
                    </div>

                    <OrderList token={token} />
                  </motion.div>
                )}

                {/* WISHLIST TAB */}
                {activeTab === "wishlist" && (
                  <motion.div
                    key="wishlist"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-black/20 backdrop-blur-lg border border-yellow-500/20 rounded-2xl shadow-sm"
                  >
                    <div className="p-6 border-b border-yellow-600/20">
                      <h2 className="text-xl font-semibold text-purple-600">Wishlist</h2>
                      <p className="text-gray-300 mt-1">Your saved items</p>
                    </div>

                    <div className="grid lg:grid-cols-1 gap-4 p-6">
                      {wishlist.length > 0 ? (
                        <>
                          {wishlist.map((item) => (
                            <div
                              key={item._id}
                              className="flex flex-col md:flex-row items-start justify-between gap-4 p-2 bg-black/20 rounded-lg"
                            >
                              {/* Item info */}
                              <div className="flex items-start gap-2">
                                <img src={item.images[0]?.url} alt={item.name} className="w-16 h-16 object-cover rounded" />

                                <div className="flex-1">
                                  <div className="text-sm font-semibold text-white">{item.name}</div>

                                  <span className="text-sm font-semibold text-blue-600">
                                    ₵
                                    {item?.sellingPrice
                                      ? item.sellingPrice.toFixed(2)
                                      : "0.00"}
                                  </span>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-2 w-full md:w-auto">
                                <button
                                  title="Reduce"
                                  onClick={() => removeFromWishlist(item._id)}
                                  className="w-8 h-8 bg-black/20 border border-yellow-600/20 text-red-600 rounded-lg flex items-center justify-center hover:bg-yellow-700/20"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>

                                <button
                                  title="Increase"
                                  onClick={() => handleAddToCart(item)}
                                  className="w-8 h-8 bg-black/20 border border-yellow-600/20 text-white rounded-lg flex items-center justify-center hover:bg-yellow-700/20"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </>
                      ) : <div className="flex flex-col items-center gap-3">
                        <CircleSlash2 className="text-gray-400" size={18}/>
                        <span className="text-sm text-gray-400 text-center">Wishlist is empty!</span>
                      </div>}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

/* ----------------------------
 * SMALL HELPER COMPONENTS
 ----------------------------- */

const InputField = ({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
    <input
      title={label}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2.5 bg-transparent text-white text-sm border border-yellow-600/20 rounded-lg focus:ring-2 focus:ring-yellow-500"
    />
  </div>
);

const ProfileView = ({ profile }: { profile: any }) => (
  <div className="grid md:grid-cols-2 gap-4">
    {Object.entries(profile).map(([key, val]) => (
      <div key={key} className="bg-yellow-600/20 rounded-lg px-3 py-2 flex items-center gap-2 text-sm">
        <label className="block text-sm font-medium text-gray-300 capitalize">
          {key.replace(/([A-Z])/g, " N")}:
        </label>
        <p className="text-gray-300">
          {val && typeof val === "object" && "country" in val
            ? (val as any).country
            : val || "—"}
        </p>

      </div>
    ))}
  </div>
);

export default AccountPage;