import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axiosClient from "../api/axiosClient";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [original, setOriginal] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const res = await axiosClient.get("/user/profile");
      setProfile(res.data.profile);
      setOriginal(res.data.profile);
    } catch (err) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);


  const isValidName =
    /^[A-Za-z]{2,}$/.test(profile?.name || "");

  const isValidDesignation =
    profile?.designation &&
    profile.designation.trim().length > 0 &&
    /^[A-Za-z\s]+$/.test(profile.designation);

  const updateProfile = async () => {
    if (!isValidName)
      return toast.error(
        "Name must be at least 2 letters and cannot contain spaces"
      );

    if (!isValidDesignation)
      return toast.error(
        "Designation is required & must contain letters only"
      );

    try {
      await axiosClient.put("/user/update", {
        name: profile.name.trim(),
        designation: profile.designation.trim(),
      });

      toast.success("Profile updated successfully");
      setOriginal(profile);
      setEditMode(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  // 🔹 Cancel Edit
  const cancelEdit = () => {
    setProfile(original);
    setEditMode(false);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-300">
        Loading profile...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <Navbar />

      <main className="px-6 py-8 max-w-xl mx-auto">
        <h2 className="text-xl font-semibold mb-6">User Profile</h2>

        <div className="glass-card p-6 rounded-xl space-y-4">

          {/* NAME */}
          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Full Name
            </label>

            {editMode ? (
              <input
                className={`w-full mt-1 px-3 py-2 border rounded-lg text-sm 
                  bg-white/80 dark:bg-slate-800/80 ${
                    !isValidName ? "border-red-500" : ""
                  }`}
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                placeholder="Letters only, no spaces"
              />
            ) : (
              <p className="mt-1 text-sm">{profile.name}</p>
            )}
          </div>

          {/* DESIGNATION */}
          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Designation
            </label>

            {editMode ? (
              <input
                className={`w-full mt-1 px-3 py-2 border rounded-lg text-sm 
                bg-white/80 dark:bg-slate-800/80 ${
                  !isValidDesignation ? "border-red-500" : ""
                }`}
                value={profile.designation || ""}
                onChange={(e) =>
                  setProfile({ ...profile, designation: e.target.value })
                }
                placeholder="Letters only (required)"
              />
            ) : (
              <p className="mt-1 text-sm">
                {profile.designation || "Not set"}
              </p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Email
            </label>
            <p className="mt-1 text-sm text-slate-500">{profile.email}</p>
          </div>

          {/* DATES */}
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <p>Created: {profile.created_at.split("T")[0]}</p>
            {profile.updated_at && (
              <p>Updated: {profile.updated_at.split("T")[0]}</p>
            )}
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-3 pt-2">
            {editMode && (
              <button
                className="px-3 py-1 rounded-full text-sm bg-slate-300 dark:bg-slate-700"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            )}

            {!editMode ? (
              <button
                className="px-3 py-1 rounded-full text-sm bg-blue-600 text-white"
                onClick={() => setEditMode(true)}
              >
                Edit
              </button>
            ) : (
              <button
                className="px-3 py-1 rounded-full text-sm bg-green-600 text-white"
                disabled={!isValidName || !isValidDesignation}
                onClick={updateProfile}
              >
                Save
              </button>
            )}

            <button
              className="px-3 py-1 rounded-full text-sm bg-primary text-white"
              onClick={() => navigate("/")}
            >
              Go Home
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
