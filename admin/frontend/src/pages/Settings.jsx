import React, { useState } from 'react';
import { Shield, User, Mail, Key, Database, Clock, Save, UserPlus, Phone } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('security');
  const [settings, setSettings] = useState({
    appName: 'Gemstone Admin',
    theme: 'system',
    language: 'en',
    timezone: 'UTC',
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    twoFactorAuth: false,
    sessionTimeout: '30',
    autoBackup: true,
    backupFrequency: 'daily',
  });

  const [newAdmin, setNewAdmin] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
  });

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  const handleAdminSubmit = () => {
    if (!newAdmin.name || !newAdmin.phone || !newAdmin.email || !newAdmin.password) {
      alert('Please fill in all fields');
      return;
    }
    alert(`Admin ${newAdmin.name} added successfully!`);
    setNewAdmin({ name: '', phone: '', email: '', password: '' });
  };

  const handleAdminChange = (key, value) => {
    setNewAdmin(prev => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'admin', label: 'Admin Management', icon: UserPlus },
    { id: 'data', label: 'Data & Backup', icon: Database },
  ];

  const SettingRow = ({ label, description, children }) => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
      <div className="mb-3 sm:mb-0 sm:mr-4">
        <label className="block text-sm font-medium text-gray-900 dark:text-white">
          {label}
        </label>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );

  const Toggle = ({ checked, onChange }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 min-w-0 max-w-6xl mx-auto">
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
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
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
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Security Settings</h2>
              
              <SettingRow label="Two-Factor Authentication" description="Add an extra layer of security">
                <Toggle
                  checked={settings.twoFactorAuth}
                  onChange={(val) => handleChange('twoFactorAuth', val)}
                />
              </SettingRow>

              <SettingRow label="Session Timeout" description="Auto logout after inactivity (minutes)">
                <select
                  value={settings.sessionTimeout}
                  onChange={(e) => handleChange('sessionTimeout', e.target.value)}
                  className="w-full sm:w-64 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                  <option value="never">Never</option>
                </select>
              </SettingRow>

              <div className="pt-4 space-y-3">
                <button className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors flex items-center justify-center gap-2">
                  <Key className="w-4 h-4" />
                  Change Password
                </button>
                <button className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4" />
                  View Login History
                </button>
              </div>
            </div>
          )}

          {activeTab === 'admin' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Admin Management</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Add new administrators to your platform</p>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Admin Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={newAdmin.name}
                      onChange={(e) => handleAdminChange('name', e.target.value)}
                      placeholder="Enter admin name"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Admin Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={newAdmin.phone}
                      onChange={(e) => handleAdminChange('phone', e.target.value)}
                      placeholder="Enter phone number"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Admin Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={newAdmin.email}
                      onChange={(e) => handleAdminChange('email', e.target.value)}
                      placeholder="Enter email address"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Admin Password
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={newAdmin.password}
                      onChange={(e) => handleAdminChange('password', e.target.value)}
                      placeholder="Enter password"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Password must be at least 8 characters long
                  </p>
                </div>

                <button
                  onClick={handleAdminSubmit}
                  className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Add Admin
                </button>
              </div>

              <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="flex items-start">
                  <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 mr-3 shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-purple-900 dark:text-purple-100">Admin Permissions</h4>
                    <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                      New admins will have full access to all platform features. You can modify permissions later.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Data & Backup</h2>
              
              <SettingRow label="Automatic Backup" description="Automatically backup your data">
                <Toggle
                  checked={settings.autoBackup}
                  onChange={(val) => handleChange('autoBackup', val)}
                />
              </SettingRow>

              <SettingRow label="Backup Frequency" description="How often to create backups">
                <select
                  value={settings.backupFrequency}
                  onChange={(e) => handleChange('backupFrequency', e.target.value)}
                  className="w-full sm:w-64 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500"
                  disabled={!settings.autoBackup}
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </SettingRow>

              <div className="pt-4 space-y-3">
                <button className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors flex items-center justify-center gap-2">
                  <Database className="w-4 h-4" />
                  Create Backup Now
                </button>
                <button className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4" />
                  View Backup History
                </button>
              </div>

              <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <div className="flex items-start">
                  <Database className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 mr-3 shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-amber-900 dark:text-amber-100">Data Storage</h4>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                      Last backup: 2 hours ago • Storage used: 2.4 GB / 10 GB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 sm:p-6 bg-gray-50 dark:bg-gray-900/50 rounded-b-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Changes are saved automatically
            </p>
            <button
              onClick={handleSave}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;