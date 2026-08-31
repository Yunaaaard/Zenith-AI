import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ShieldAlert, Loader2, ArrowRight, UserCheck, Key, CheckCircle, Copy, HelpCircle } from 'lucide-react';
import Logo from '../ui/Logo';

export default function LoginForm({ onLogin, onRequestGuestToken, onVerifyGuestToken, loading, authError, setAuthError }) {
  const [authMode, setAuthMode] = useState('developer'); // 'developer' | 'guest'
  const [guestStep, setGuestStep] = useState('request'); // 'request' | 'verify'

  // Developer Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Guest Token Auth State
  const [guestName, setGuestName] = useState('');
  const [tokenInput, setTokenInput] = useState('');
  const [generatedToken, setGeneratedToken] = useState(null);
  const [copiedToken, setCopiedToken] = useState(false);
  const [requestNotice, setRequestNotice] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (setAuthError) setAuthError(null);

    if (authMode === 'guest') {
      if (guestStep === 'request') {
        if (!guestName.trim()) {
          if (setAuthError) setAuthError('Please enter your name.');
          return;
        }
        if (onRequestGuestToken) {
          const res = await onRequestGuestToken(guestName);
          if (res.success) {
            setGeneratedToken(res.token);
            setTokenInput(res.token);
            setRequestNotice(res.message);
            setGuestStep('verify');
          }
        }
      } else {
        if (!tokenInput.trim()) {
          if (setAuthError) setAuthError('Please enter your guest access token.');
          return;
        }
        if (onVerifyGuestToken) {
          onVerifyGuestToken(tokenInput);
        }
      }
    } else {
      onLogin(email, password, rememberMe);
    }
  };

  const copyTokenToClipboard = () => {
    if (generatedToken) {
      navigator.clipboard.writeText(generatedToken);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#080b11] p-4 sm:p-6 overflow-hidden">
      {/* Ambient background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-[450px] bg-[#0e131f]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-7 sm:p-9 shadow-2xl animate-fade-in">

        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-6">
          <Logo size="xl" showText={true} glow={true} className="mb-3" />
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mt-1">
            "Intelligence, elevated."
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Sign in to access your Zenith AI workspace.
          </p>
        </div>

        {/* Tab Switcher: Developer Login vs Guest Access */}
        <div className="flex items-center p-1 bg-slate-900/90 border border-white/10 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => {
              setAuthMode('developer');
              if (setAuthError) setAuthError(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${authMode === 'developer'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
              }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Developer Login</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode('guest');
              if (setAuthError) setAuthError(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${authMode === 'guest'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
              }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Guest Access</span>
          </button>
        </div>

        {/* Auth Error Banner */}
        {authError && (
          <div className="mb-6 flex items-start gap-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs leading-relaxed animate-fade-in">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{authError}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {authMode === 'developer' ? (
            <>
              {/* Email Field */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Developer Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    disabled={loading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter developer email"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#141b2d] border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    disabled={loading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#141b2d] border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition disabled:opacity-50"
                  />
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1 pb-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#141b2d] border-white/20 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"
                  />
                  <span className="text-xs text-slate-400">Remember me</span>
                </label>
              </div>
            </>
          ) : (
            <>
              {/* Guest Sub-Tab Switcher: Step 1 (Request Token) vs Step 2 (Enter Guest Token) */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#141b2d] border border-white/10 rounded-xl mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setGuestStep('request');
                    if (setAuthError) setAuthError(null);
                  }}
                  className={`py-2 px-2.5 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${
                    guestStep === 'request'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md border border-indigo-400/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>1. Request Token</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setGuestStep('verify');
                    if (setAuthError) setAuthError(null);
                  }}
                  className={`py-2 px-2.5 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${
                    guestStep === 'verify'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md border border-indigo-400/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>2. Enter Token</span>
                </button>
              </div>

              {guestStep === 'request' ? (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Your Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      disabled={loading}
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Enter your name (e.g. miksblitz)"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#141b2d] border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition disabled:opacity-50"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                    Submitting your name generates a token in <strong>Firebase Firestore</strong>. You must obtain this token from creator <strong>yunard pogi</strong> to sign in.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {generatedToken && (
                    <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs leading-relaxed animate-fade-in">
                      <div className="flex items-center justify-between font-bold text-white mb-1">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          Token Generated in Firebase!
                        </span>
                        <button
                          type="button"
                          onClick={copyTokenToClipboard}
                          className="text-[10px] bg-emerald-500/20 hover:bg-emerald-500/30 px-2 py-0.5 rounded text-emerald-300 flex items-center gap-1 transition"
                        >
                          <Copy className="w-3 h-3" />
                          {copiedToken ? 'Copied!' : 'Copy Code'}
                        </button>
                      </div>
                      <div className="font-mono text-sm text-indigo-300 font-bold bg-slate-900/80 px-2.5 py-1 rounded border border-white/10 text-center my-1.5 select-all">
                        {generatedToken}
                      </div>
                      <p className="text-[11px] text-slate-300">
                        Please ask creator <strong>yunard pogi</strong> to give you this token code to finalize your sign in!
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Guest Access Token
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Key className="w-4 h-4 text-indigo-400" />
                      </div>
                      <input
                        type="text"
                        required
                        disabled={loading}
                        value={tokenInput}
                        onChange={(e) => setTokenInput(e.target.value.toUpperCase())}
                        placeholder="Enter token code (e.g. ZENITH-894201)"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#141b2d] border border-white/10 rounded-xl text-sm font-mono text-indigo-300 placeholder-slate-500 uppercase tracking-wider focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition disabled:opacity-50"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-2">
                      <HelpCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>Verified against Firebase Firestore database.</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Primary Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>
                  {authMode === 'developer'
                    ? 'Sign In'
                    : guestStep === 'request'
                      ? 'Request Access Token'
                      : 'Verify & Enter Zenith AI'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Note */}
        <div className="mt-8 pt-5 border-t border-white/5 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Creator-Approved Token System (yunard pogi)</span>
        </div>
      </div>
    </div>
  );
}
