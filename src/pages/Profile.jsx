import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiEdit2,
  FiSave,
} from "react-icons/fi";
import { Layout } from "../components/layout";
import { Alert, LoadingSpinner } from "../components/common";
import { useAuth } from "../contexts/AuthContext";
import { getInitials } from "../utils/helpers";

const Profile = () => {
  const { user, updateProfile, loading, error, clearError } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "",
      zipCode: user?.address?.zipCode || "",
      country: user?.address?.country || "",
    },
  });

  const onSubmit = async (data) => {
    clearError();
    setSuccess(false);

    const profileData = {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      address: {
        street: data.street,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country,
      },
    };

    const result = await updateProfile(profileData);
    if (result.success) {
      setSuccess(true);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
    clearError();
  };

  if (!user) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-auth rounded-xl p-8 text-white mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold">
              {getInitials(user.firstName, user.lastName)}
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-blue-100">{user.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-sm capitalize">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <Alert
            type="error"
            message={error}
            onClose={clearError}
            className="mb-6"
          />
        )}
        {success && (
          <Alert
            type="success"
            message="Profile updated successfully!"
            onClose={() => setSuccess(false)}
            className="mb-6"
          />
        )}

        {/* Profile Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Profile Information
            </h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-outline flex items-center space-x-2"
              >
                <FiEdit2 className="w-4 h-4" />
                <span>Edit</span>
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="label">
                  <FiUser className="inline w-4 h-4 mr-1" />
                  First Name
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  className={`input ${
                    errors.firstName ? "input-error" : ""
                  } disabled:bg-gray-50`}
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="label">
                  <FiUser className="inline w-4 h-4 mr-1" />
                  Last Name
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  className={`input ${
                    errors.lastName ? "input-error" : ""
                  } disabled:bg-gray-50`}
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              {/* Email (read-only) */}
              <div>
                <label className="label">
                  <FiMail className="inline w-4 h-4 mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="input bg-gray-50 text-gray-500"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="label">
                  <FiPhone className="inline w-4 h-4 mr-1" />
                  Phone
                </label>
                <input
                  type="tel"
                  disabled={!isEditing}
                  className="input disabled:bg-gray-50"
                  {...register("phone")}
                />
              </div>
            </div>

            {/* Address Section */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <FiMapPin className="w-5 h-5 mr-2" />
                Address
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="label">Street Address</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    className="input disabled:bg-gray-50"
                    {...register("street")}
                  />
                </div>

                <div>
                  <label className="label">City</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    className="input disabled:bg-gray-50"
                    {...register("city")}
                  />
                </div>

                <div>
                  <label className="label">State</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    className="input disabled:bg-gray-50"
                    {...register("state")}
                  />
                </div>

                <div>
                  <label className="label">ZIP Code</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    className="input disabled:bg-gray-50"
                    {...register("zipCode")}
                  />
                </div>

                <div>
                  <label className="label">Country</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    className="input disabled:bg-gray-50"
                    {...register("country")}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex items-center space-x-2"
                >
                  {loading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <FiSave className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
