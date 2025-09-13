import React, { useState, useEffect } from 'react';
import { AppButton } from '../design-system/AppButton';
import { AppInput } from '../design-system/AppInput';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { DeleteAccountModal } from '../common/DeleteAccountModal';
import { ThemeToggle } from '../stock/ThemeToggle';
import { Download, Trash2, Settings, Shield, DollarSign, FileText, Bell } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SettingsScreenDesktopProps {
  isDarkMode?: boolean;
  onThemeToggle?: () => void;
}

export function SettingsScreenDesktop({ isDarkMode = false, onThemeToggle }: SettingsScreenDesktopProps) {
  const [quietHours, setQuietHours] = useState(true);
  const [sameBlockFirst, setSameBlockFirst] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(true);
  const [monthlyBudget, setMonthlyBudget] = useState([150]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(() => {
    return document.documentElement.getAttribute('data-reduce-motion') === 'true';
  });

  const currentSpend = 87;
  const budgetPercent = (currentSpend / monthlyBudget[0]) * 100;

  // Initialize motion preference from localStorage
  useEffect(() => {
    const savedMotionPreference = localStorage.getItem('reduce-motion');
    if (savedMotionPreference !== null) {
      const isReduced = savedMotionPreference === 'true';
      setReduceMotion(isReduced);
      document.documentElement.setAttribute('data-reduce-motion', isReduced.toString());
    }
  }, []);

  const handleDownloadStatement = (month: string) => {
    toast.success(`${month} statement downloaded`);
  };

  const handleDeleteData = () => {
    setShowDeleteModal(true);
  };

  const handleSaveBudget = () => {
    toast.success("Budget saved successfully!");
  };

  const handleDeleteComplete = () => {
    // Navigate back to home screen (this would be handled by parent component)
    window.location.href = '/';
  };

  const handleMotionToggle = (enabled: boolean) => {
    setReduceMotion(enabled);
    document.documentElement.setAttribute('data-reduce-motion', enabled.toString());
    // Save to localStorage for persistence
    localStorage.setItem('reduce-motion', enabled.toString());
  };

  const monthlyStatements = [
    { month: 'December 2024', amount: '$34.50', trades: 23, kWh: '47.2' },
    { month: 'November 2024', amount: '$42.80', trades: 31, kWh: '52.1' },
    { month: 'October 2024', amount: '$38.20', trades: 28, kWh: '44.8' },
    { month: 'September 2024', amount: '$41.60', trades: 29, kWh: '49.3' },
    { month: 'August 2024', amount: '$45.90', trades: 34, kWh: '56.7' },
  ];

  return (
    <div className="min-h-screen content-clean">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2" style={{ color: 'var(--txt-heading)' }}>Settings</h1>
          <p className="text-lg" style={{ color: 'var(--txt-primary)' }}>Manage your trading preferences, privacy, and account settings</p>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Main Settings */}
          <div className="col-span-8">
            <Tabs defaultValue="trading" className="space-y-6">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="trading" className="flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>Trading</span>
                </TabsTrigger>
                <TabsTrigger value="privacy" className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Privacy</span>
                </TabsTrigger>
                <TabsTrigger value="budget" className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4" />
                  <span>Budget</span>
                </TabsTrigger>
                <TabsTrigger value="data" className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Data & Export</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="trading" className="space-y-6">
                <div className="dashboard-block">
                  <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--txt-heading)' }}>Trading Preferences</h3>
                  
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-lg dashboard-block">
                          <div>
                            <p className="font-medium" style={{ color: 'var(--txt-heading)' }}>Quiet hours</p>
                            <p className="text-sm" style={{ color: 'var(--txt-primary)' }}>Pause all trading 9pm–7am daily</p>
                          </div>
                          <AppInput
                            type="toggle"
                            checked={quietHours}
                            onChange={setQuietHours}
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-lg dashboard-block">
                          <div>
                            <p className="font-medium" style={{ color: 'var(--txt-heading)' }}>Same block priority</p>
                            <p className="text-sm" style={{ color: 'var(--txt-primary)' }}>Match with immediate neighbors first</p>
                          </div>
                          <AppInput
                            type="toggle"
                            checked={sameBlockFirst}
                            onChange={setSameBlockFirst}
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-lg dashboard-block">
                          <div>
                            <p className="font-medium" style={{ color: 'var(--txt-heading)' }}>Push notifications</p>
                            <p className="text-sm" style={{ color: 'var(--txt-primary)' }}>Trade confirmations and important alerts</p>
                          </div>
                          <AppInput
                            type="toggle"
                            checked={notifications}
                            onChange={setNotifications}
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-lg dashboard-block">
                          <div>
                            <p className="font-medium" style={{ color: 'var(--txt-heading)' }}>Reduce motion</p>
                            <p className="text-sm" style={{ color: 'var(--txt-primary)' }}>Disable background animations and effects</p>
                          </div>
                          <AppInput
                            type="toggle"
                            checked={reduceMotion}
                            onChange={handleMotionToggle}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="dashboard-block">
                      <div className="flex items-center space-x-3 mb-4">
                        <Bell className="w-6 h-6 icon-energy-cyan" />
                        <h4 className="font-semibold" style={{ color: 'var(--txt-heading)' }}>Notification Settings</h4>
                      </div>
                      <div className="space-y-3 text-sm">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span style={{ color: 'var(--txt-primary)' }}>Trade completions</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span className="text-blue-800">Price alerts</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span className="text-blue-800">Budget warnings</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-blue-800">Community updates</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-blue-800">Weekly summaries</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="privacy" className="space-y-6">
                <div className="dashboard-block">
                  <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--txt-heading)' }}>Privacy & Security</h3>
                  
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 rounded-lg dashboard-block">
                        <div>
                          <p className="font-medium" style={{ color: 'var(--txt-heading)' }}>Limited profile visibility</p>
                          <p className="text-sm" style={{ color: 'var(--txt-primary)' }}>Show only first name + street to neighbors</p>
                        </div>
                        <AppInput
                          type="toggle"
                          checked={privacyMode}
                          onChange={setPrivacyMode}
                        />
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium" style={{ color: 'var(--txt-heading)' }}>What neighbors can see:</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span style={{ color: 'var(--txt-primary)' }}>First name:</span>
                            <span className="font-medium metric-energy-value">✓ Visible</span>
                          </div>
                          <div className="flex justify-between">
                            <span style={{ color: 'var(--txt-primary)' }}>Street name:</span>
                            <span className="font-medium metric-energy-value">✓ Visible</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Exact address:</span>
                            <span className="text-red-600">✗ Hidden</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Phone/email:</span>
                            <span className="text-red-600">✗ Hidden</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Trade history:</span>
                            <span className="text-red-600">✗ Hidden</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 p-6 rounded-xl">
                      <div className="flex items-center space-x-3 mb-4">
                        <Shield className="w-6 h-6 text-green-600" />
                        <h4 className="font-semibold text-green-900">Security Features</h4>
                      </div>
                      <div className="space-y-3 text-sm text-green-800">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                          <span>Address verification required</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                          <span>End-to-end encrypted communications</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                          <span>Secure payment processing</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                          <span>Regular security audits</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                          <span>GDPR compliant data handling</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="budget" className="space-y-6">
                <div className="dashboard-block">
                  <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--txt-heading)' }}>Budget Controls</h3>
                  
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <AppInput
                        type="slider"
                        label="Monthly spending limit"
                        value={monthlyBudget}
                        onChange={setMonthlyBudget}
                        min={50}
                        max={500}
                        step={10}
                        formatLabel={(value) => `$${value}`}
                      />
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Current month progress</span>
                          <span className="font-semibold">${currentSpend} / ${monthlyBudget[0]}</span>
                        </div>
                        <Progress value={budgetPercent} className="h-3" />
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>$0</span>
                          <span className={budgetPercent > 80 ? 'text-amber-600 font-medium' : ''}>
                            {budgetPercent > 80 ? 'Approaching limit' : 'On track'}
                          </span>
                          <span>${monthlyBudget[0]}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50 p-6 rounded-xl">
                      <h4 className="font-semibold text-amber-900 mb-4">Budget Alerts</h4>
                      <div className="space-y-3 text-sm">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span className="text-amber-800">Alert at 75% of budget</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span className="text-amber-800">Alert at 90% of budget</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span className="text-amber-800">Auto-pause at 100% of budget</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-amber-800">Weekly spending summaries</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="pt-6 border-t border-gray-200">
                    <AppButton
                      variant="primary"
                      onClick={handleSaveBudget}
                      className="px-8"
                    >
                      Save
                    </AppButton>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="data" className="space-y-6">
                <div className="dashboard-block">
                  <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--txt-heading)' }}>Data Export & Management</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Monthly Statements</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Month</TableHead>
                            <TableHead>Total Amount</TableHead>
                            <TableHead>Trades</TableHead>
                            <TableHead>Energy (kWh)</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {monthlyStatements.map((statement) => (
                            <TableRow key={statement.month}>
                              <TableCell className="font-medium">{statement.month}</TableCell>
                              <TableCell>{statement.amount}</TableCell>
                              <TableCell>{statement.trades}</TableCell>
                              <TableCell>{statement.kWh}</TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <AppButton
                                    variant="tertiary"
                                    size="sm"
                                    icon={<Download className="w-4 h-4" />}
                                    onClick={() => handleDownloadStatement(statement.month)}
                                  >
                                    CSV
                                  </AppButton>
                                  <AppButton
                                    variant="tertiary"
                                    size="sm"
                                    icon={<Download className="w-4 h-4" />}
                                    onClick={() => handleDownloadStatement(statement.month)}
                                  >
                                    PDF
                                  </AppButton>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                        <h4 className="font-semibold text-red-900 mb-4">Danger Zone</h4>
                        <p className="text-sm text-red-800 mb-4">
                          This action will permanently delete your account and all associated data. 
                          This cannot be undone.
                        </p>
                        <AppButton
                          variant="tertiary"
                          size="sm"
                          icon={<Trash2 className="w-4 h-4" />}
                          onClick={handleDeleteData}
                          className="text-red-600 hover:bg-red-100"
                        >
                          Delete Account & Data
                        </AppButton>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="appearance" className="space-y-6">
                <div className="dashboard-block">
                  <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--txt-heading)' }}>Appearance & Theme</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Dark Mode</p>
                        <p className="text-sm text-gray-600">Switch between light and dark themes</p>
                      </div>
                      {onThemeToggle && (
                        <ThemeToggle 
                          isDark={isDarkMode}
                          onToggle={onThemeToggle}
                          size="lg"
                        />
                      )}
                    </div>
                    
                    <div className="bg-blue-50 p-6 rounded-xl">
                      <div className="flex items-center space-x-3 mb-4">
                        <Bell className="w-6 h-6 text-blue-600" />
                        <h4 className="font-semibold text-blue-900">Theme Preferences</h4>
                      </div>
                      <div className="space-y-3 text-sm text-blue-800">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          <span>Dark mode applies to all screens after login</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          <span>Settings are saved locally to your device</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          <span>Changes take effect immediately</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="col-span-4 space-y-6">
            {/* Account Summary */}
            <div className="dashboard-block hero-energy-glow">
              <h4 className="font-semibold mb-4" style={{ color: 'var(--txt-heading)' }}>Account Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span style={{ color: 'var(--txt-primary)', opacity: 0.9 }}>Member since:</span>
                  <span className="font-medium metric-energy-value">Oct 2024</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--txt-primary)', opacity: 0.9 }}>Total trades:</span>
                  <span className="font-medium metric-energy-value">145</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--txt-primary)', opacity: 0.9 }}>Energy traded:</span>
                  <span className="font-medium metric-energy-value">249.8 kWh</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--txt-primary)', opacity: 0.9 }}>CO₂ avoided:</span>
                  <span className="font-medium metric-energy-value">172.4 kg</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="dashboard-block">
              <h4 className="font-semibold mb-4" style={{ color: 'var(--txt-heading)' }}>Quick Actions</h4>
              <div className="space-y-3">
                <AppButton variant="secondary" size="sm" className="w-full justify-start">
                  Download all data
                </AppButton>
                <AppButton variant="secondary" size="sm" className="w-full justify-start">
                  Update payment method
                </AppButton>
                <AppButton variant="secondary" size="sm" className="w-full justify-start">
                  Change password
                </AppButton>
                <AppButton variant="tertiary" size="sm" className="w-full justify-start">
                  Contact support
                </AppButton>
              </div>
            </div>

            {/* Support */}
            <div className="dashboard-block section-energy-glow">
              <h4 className="font-semibold mb-4" style={{ color: 'var(--txt-heading)' }}>Need Help?</h4>
              <div className="space-y-3 text-sm" style={{ color: 'var(--txt-primary)' }}>
                <p>Our support team is here to help with any questions about your account or trading preferences.</p>
                <div className="space-y-2">
                  <p><strong>Email:</strong> support@energylink.com</p>
                  <p><strong>Hours:</strong> Mon-Fri 9AM-6PM PST</p>
                  <p><strong>Response time:</strong> Within 24 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      <DeleteAccountModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onDeleteComplete={handleDeleteComplete}
      />
    </div>
  );
}