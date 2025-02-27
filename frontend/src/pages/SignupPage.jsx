import { useState } from 'react';
import { Link } from 'react-router';
import { useAuthStore } from '../store/useAuthStore';
import { MessageSquare, Eye, EyeOff } from 'lucide-react';
import AuthImagePattern from '../components/AuthImagePattern';

const formInitialState = {
  fullName: '',
  email: '',
  password: ''
}

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(formInitialState);
  const { signup, isSigningUp } = useAuthStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log(formData);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <span className="block mb-2 text-sm">Full name</span>
            <label className="input w-full">
              <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </g>
              </svg>
              <input
                type="input"
                required
                placeholder="John Doe"
                name='fullName'
                value={formData.fullName}
                onChange={handleChange}
              />
            </label>

            <span className="block mb-2 text-sm">Email</span>
            <label className="input w-full">
              <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </g>
              </svg>
              <input
                type="email"
                placeholder="you@gmail.com"
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </label>

            <span className="block mb-2 text-sm">Password</span>
            <label className="input w-full">
              <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                  <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                  <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                </g>
              </svg>
              <input
                type={(showPassword) ? "text" : "password"}
                required
                placeholder="Password"
                minLength={6}
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              {(showPassword) ? (
                <EyeOff
                  className="cursor-pointer opacity-50 size-5"
                  onClick={() => setShowPassword(!showPassword)}
                  onMouseDown={(e) => e.preventDefault()}
                />
              ) : (
                <Eye
                  className="cursor-pointer opacity-50 size-5"
                  onClick={() => setShowPassword(!showPassword)}
                  onMouseDown={(e) => e.preventDefault()}
                />
              )}
            </label>

            <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
              {(isSigningUp) ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Loading...
                </>
              ) : (
                'Create Account'
              )}
            </button>

            <div className="text-center">
              <p className="text-base-content/60">
                Already have an account?{' '}
                <Link to="/login" className="link link-primary">Signin</Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* right side */}
      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div >
  );
};

export default SignupPage;
