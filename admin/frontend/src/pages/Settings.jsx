import React, { useState, useMemo, useCallback, memo, useEffect } from "react";
import {
    User,
    Mail,
    Key,
    Database,
    Clock,
    UserPlus,
    Phone,
    Trash2,
    Eye,
    EyeOff,
    X,
    Lock,
} from "lucide-react";
import { dataService } from "../utils/dataService";
import toast from "react-hot-toast";
import { useStore } from "../store/useStore";

// Memoized components
const SettingRow = memo(({ label, description, children }) => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
        <div className="mb-3 sm:mb-0 sm:mr-4">
            <label className="block text-sm font-medium text-gray-900 dark:text-white">
                {label}
            </label>
            {description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {description}
                </p>
            )}
        </div>
        <div className="shrink-0">{children}</div>
    </div>
));

const Toggle = memo(({ checked, onChange }) => (
    <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            checked ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
        }`}
        aria-label={checked ? "Enabled" : "Disabled"}
    >
        <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                checked ? "translate-x-6" : "translate-x-1"
            }`}
        />
    </button>
));

const AdminRow = memo(({ admin, onToggleStatus, onDelete, isSuperAdmin }) => (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
            {admin.adm_name}
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
            {admin.adm_email}
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
            {admin.adm_phone}
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                admin.status === "active" 
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
            }`}>
                {admin.status === "active" ? "Active" : "Disabled"}
            </span>
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm">
            {isSuperAdmin && ( // Only show buttons if current user is super admin
                <div className="flex space-x-2">
                    <button
                        onClick={() => onToggleStatus(admin._id, admin.status)}
                        className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                            admin.status === "active"
                                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:hover:bg-yellow-900/50"
                                : "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
                        }`}
                    >
                        {admin.status === "active" ? "Disable" : "Enable"}
                    </button>
                    <button
                        onClick={() => onDelete(admin._id)}
                        className="px-3 py-1 text-xs font-medium bg-red-100 text-red-800 hover:bg-red-200 rounded transition-colors dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                        aria-label="Delete admin"
                    >
                        <Trash2 className="w-3 h-3" />
                    </button>
                </div>
            )}
        </td>
    </tr>
));

const Modal = memo(({ title, onClose, children }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6 sticky top-0 bg-white dark:bg-gray-800 pt-4 -mt-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    </div>
));

const InputField = memo(({ icon: Icon, type, value, onChange, placeholder, showToggle, onToggleShow, ...props }) => (
    <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />}
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full ${Icon ? 'pl-10' : 'pl-4'} ${showToggle !== undefined ? 'pr-10' : 'pr-4'} py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
            {...props}
        />
        {showToggle !== undefined && (
            <button
                type="button"
                onClick={onToggleShow}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label={showToggle ? "Hide password" : "Show password"}
            >
                {showToggle ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
        )}
    </div>
));

const Settings = () => {
    // State
    const [activeTab, setActiveTab] = useState("admin");
    const [settings, setSettings] = useState({
        autoBackup: true,
        backupFrequency: "daily",
    });

    const [showAddAdminModal, setShowAddAdminModal] = useState(false);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    
    const [passwordVisibility, setPasswordVisibility] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    
    const [newAdmin, setNewAdmin] = useState({
        adm_name: "",
        adm_phone: "",
        adm_email: "",
        password: "",
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    
    const [admins, setAdmins] = useState([]);

    // Get isSuperAdmin status from store
    const isSuperAdmin = useStore((state) => state.isSuperAdmin);

    const fetchAdmins = useCallback(async () => {
        try {
            const data = await dataService.getAdmins();
            setAdmins(data);
        } catch (_) {
            toast.error("Failed to fetch admins");
        }
    }, []);

    useEffect(() => {
        fetchAdmins();
    }, [fetchAdmins]);

    const tabs = useMemo(() => [
        { id: "admin", label: "Admin Management", icon: UserPlus },
        { id: "data", label: "Data & Backup", icon: Database },
    ], []);

    // Memoized values
    const activeAdminsCount = useMemo(() => 
        admins.filter(admin => admin.status === "active").length, 
        [admins]
    );

    const totalAdmins = useMemo(() => admins.length, [admins]);

    // Callbacks
    const handleChange = useCallback((key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    }, []);

    const handleAdminChange = useCallback((key, value) => {
        setNewAdmin(prev => ({ ...prev, [key]: value }));
    }, []);

    const handlePasswordChange = useCallback((key, value) => {
        setPasswordData(prev => ({ ...prev, [key]: value }));
    }, []);

    const togglePasswordVisibility = useCallback((field) => {
        setPasswordVisibility(prev => ({ ...prev, [field]: !prev[field] }));
    }, []);

    const handleAdminSubmit = useCallback(async () => {
        if (!isSuperAdmin) {
            toast.error("Only super admins can add new admins.");
            return;
        }
        if (!newAdmin.adm_name || !newAdmin.adm_phone || !newAdmin.adm_email || !newAdmin.password) {
            toast.error("Please fill in all fields");
            return;
        }
        
        if (newAdmin.password.length < 8) {
            toast.error("Password must be at least 8 characters long");
            return;
        }

        try {
            await dataService.addAdmin(newAdmin);
            toast.success(`Admin ${newAdmin.adm_name} added successfully!`);
            setNewAdmin({ adm_name: "", adm_phone: "", adm_email: "", password: "" });
            setShowAddAdminModal(false);
            fetchAdmins();
        } catch (error) { // Catch actual error to check for 403
            if (error.response && error.response.status === 403) {
                toast.error("You are not authorized to add new admins.");
            } else {
                toast.error("Failed to add admin");
            }
        }
    }, [newAdmin, fetchAdmins, isSuperAdmin]);

    const handleChangePasswordSubmit = useCallback(async () => {
        const { currentPassword, newPassword, confirmPassword } = passwordData;
        
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error("Please fill in all password fields");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("New password and confirm password do not match");
            return;
        }

        if (newPassword.length < 8) {
            toast.error("New password must be at least 8 characters long");
            return;
        }

        try {
            await dataService.changePassword(passwordData);
            toast.success("Password changed successfully!");
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            setShowChangePasswordModal(false);
        } catch (_) {
            toast.error("Failed to change password. Check current password.");
        }
    }, [passwordData]);

    const handleDeleteAdmin = useCallback(async (id) => {
        if (!isSuperAdmin) {
            toast.error("Only super admins can delete admins.");
            return;
        }
        if (window.confirm("Are you sure you want to delete this admin? This action cannot be undone.")) {
            try {
                await dataService.deleteAdmin(id);
                toast.success("Admin deleted successfully");
                fetchAdmins();
            } catch (error) {
                 if (error.response && error.response.status === 403) {
                    toast.error("You are not authorized to delete admins.");
                } else {
                    toast.error("Failed to delete admin");
                }
            }
        }
    }, [fetchAdmins, isSuperAdmin]);

    const handleToggleAdminStatus = useCallback(async (id, currentStatus) => {
        if (!isSuperAdmin) {
            toast.error("Only super admins can change admin status.");
            return;
        }
        const newStatus = currentStatus === "active" ? "disabled" : "active";
        try {
            await dataService.updateAdminStatus(id, newStatus);
            toast.success(`Admin status updated to ${newStatus}`);
            fetchAdmins();
        } catch (error) {
            if (error.response && error.response.status === 403) {
                toast.error("You are not authorized to change admin status.");
            } else {
                toast.error("Failed to update admin status");
            }
        }
    }, [fetchAdmins, isSuperAdmin]);

    const resetForms = useCallback(() => {
        setNewAdmin({ adm_name: "", adm_phone: "", adm_email: "", password: "" });
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setPasswordVisibility({ current: false, new: false, confirm: false });
    }, []);

    // Event handlers
    const handleAddAdminClick = useCallback(() => {
        resetForms();
        setShowAddAdminModal(true);
    }, [resetForms]);

    const handleChangePasswordClick = useCallback(() => {
        resetForms();
        setShowChangePasswordModal(true);
    }, [resetForms]);

    const handleTabClick = useCallback((tabId) => {
        if (tabId !== "data") {
            setActiveTab(tabId);
        }
    }, []);

    // Modal components
    const AddAdminModalContent = useMemo(() => (
        <div className="space-y-5">
            <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Admin Name
                </label>
                <InputField
                    icon={User}
                    type="text"
                    value={newAdmin.adm_name}
                    onChange={(e) => handleAdminChange("adm_name", e.target.value)}
                    placeholder="Enter admin name"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Admin Phone
                </label>
                <InputField
                    icon={Phone}
                    type="tel"
                    value={newAdmin.adm_phone}
                    onChange={(e) => handleAdminChange("adm_phone", e.target.value)}
                    placeholder="Enter phone number"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Admin Email
                </label>
                <InputField
                    icon={Mail}
                    type="email"
                    value={newAdmin.adm_email}
                    onChange={(e) => handleAdminChange("adm_email", e.target.value)}
                    placeholder="Enter email address"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Admin Password
                </label>
                <InputField
                    icon={Key}
                    type="password"
                    value={newAdmin.password}
                    onChange={(e) => handleAdminChange("password", e.target.value)}
                    placeholder="Enter password"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Password must be at least 8 characters long
                </p>
            </div>

            <div className="flex gap-3 pt-2">
                <button
                    onClick={() => setShowAddAdminModal(false)}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={handleAdminSubmit}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                    <UserPlus className="w-4 h-4" />
                    Add Admin
                </button>
            </div>
        </div>
    ), [newAdmin, handleAdminChange, handleAdminSubmit]);

    const ChangePasswordModalContent = useMemo(() => (
        <div className="space-y-5">
            <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Current Password
                </label>
                <InputField
                    icon={Lock}
                    type={passwordVisibility.current ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                    placeholder="Enter current password"
                    showToggle={passwordVisibility.current}
                    onToggleShow={() => togglePasswordVisibility("current")}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    New Password
                </label>
                <InputField
                    icon={Lock}
                    type={passwordVisibility.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                    placeholder="Enter new password"
                    showToggle={passwordVisibility.new}
                    onToggleShow={() => togglePasswordVisibility("new")}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Confirm New Password
                </label>
                <InputField
                    icon={Lock}
                    type={passwordVisibility.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                    placeholder="Confirm new password"
                    showToggle={passwordVisibility.confirm}
                    onToggleShow={() => togglePasswordVisibility("confirm")}
                />
            </div>

            <div className="flex gap-3 pt-2">
                <button
                    onClick={() => setShowChangePasswordModal(false)}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={handleChangePasswordSubmit}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                    <Key className="w-4 h-4" />
                    Change Password
                </button>
            </div>
        </div>
    ), [passwordData, passwordVisibility, handlePasswordChange, handleChangePasswordSubmit, togglePasswordVisibility]);

    return (
        <>
            <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 min-w-0 max-w-6xl mx-auto">
                {/* Header */}
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                        Settings
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Manage your application preferences and configurations
                    </p>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-hidden">
                    <nav className="flex space-x-1 sm:space-x-4 min-w-max">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isDisabled = tab.id === "data";

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabClick(tab.id)}
                                    disabled={isDisabled}
                                    className={`flex items-center space-x-2 px-3 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                                    ${
                                        activeTab === tab.id && !isDisabled
                                            ? "border-blue-600 text-blue-600 dark:text-blue-400"
                                            : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                    }
                                    ${
                                        isDisabled
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Content */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="p-4 sm:p-6">
                        {activeTab === "admin" ? (
                            <div className="space-y-6">                                
                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    {isSuperAdmin && ( // Only show if current user is super admin
                                        <button
                                            onClick={handleAddAdminClick}
                                            className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
                                        >
                                            <UserPlus className="w-4 h-4" />
                                            Add Admins
                                        </button>
                                    )}
                                    
                                    <button
                                        onClick={handleChangePasswordClick}
                                        className="px-4 py-2.5 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Key className="w-4 h-4" />
                                        Change Password
                                    </button>
                                </div>

                                {/* Admins List */}
                                <div className="pt-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-md font-medium text-gray-900 dark:text-white">
                                            Administrators
                                        </h3>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {activeAdminsCount} active • {totalAdmins} total
                                        </div>
                                    </div>
                                    
                                    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead className="bg-gray-50 dark:bg-gray-900">
                                                <tr>
                                                    {["Name", "Email", "Phone", "Status"].map((header) => (
                                                        <th 
                                                            key={header}
                                                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                                        >
                                                            {header}
                                                        </th>
                                                    ))}
                                                    {isSuperAdmin && (
                                                        <th 
                                                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                                        >
                                                            Actions
                                                        </th>
                                                    )}
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                {admins.map((admin) => (
                                                    <AdminRow
                                                        key={admin._id}
                                                        admin={admin}
                                                        onToggleStatus={handleToggleAdminStatus}
                                                        onDelete={handleDeleteAdmin}
                                                        isSuperAdmin={isSuperAdmin}
                                                    />
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Data & Backup
                                </h2>

                                <SettingRow
                                    label="Automatic Backup"
                                    description="Automatically backup your data"
                                >
                                    <Toggle
                                        checked={settings.autoBackup}
                                        onChange={(val) => handleChange("autoBackup", val)}
                                    />
                                </SettingRow>

                                <SettingRow
                                    label="Backup Frequency"
                                    description="How often to create backups"
                                >
                                    <select
                                        value={settings.backupFrequency}
                                        onChange={(e) => handleChange("backupFrequency", e.target.value)}
                                        className="w-full sm:w-64 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 transition-colors"
                                        disabled={!settings.autoBackup}
                                    >
                                        {["hourly", "daily", "weekly", "monthly"].map((option) => (
                                            <option key={option} value={option}>
                                                {option.charAt(0).toUpperCase() + option.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </SettingRow>

                                <div className="pt-4 gap-2 flex flex-wrap">
                                    <button className="px-4 py-2 text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors flex items-center justify-center gap-2">
                                        <Database className="w-4 h-4" />
                                        Create Backup Now
                                    </button>
                                    <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        View Backup History
                                    </button>
                                </div>

                                <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                                    <div className="flex items-start">
                                        <Database className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 mr-3 shrink-0" />
                                        <div>
                                            <h4 className="text-sm font-medium text-amber-900 dark:text-amber-100">
                                                Data Storage
                                            </h4>
                                            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                                                Last backup: 2 hours ago • Storage used: 2.4 GB / 10 GB
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showAddAdminModal && (
                <Modal 
                    title="Add New Admin" 
                    onClose={() => setShowAddAdminModal(false)}
                >
                    {AddAdminModalContent}
                </Modal>
            )}
            
            {showChangePasswordModal && (
                <Modal 
                    title="Change Password" 
                    onClose={() => setShowChangePasswordModal(false)}
                >
                    {ChangePasswordModalContent}
                </Modal>
            )}
        </>
    );
};

export default memo(Settings);