import { useState } from "react";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Upload } from "lucide-react"
import { useAuthStore } from "../../store/autStore";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLogingIn } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ email, password });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Input
          type="email"
          placeholder="Email Address"
          className="bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary/50 h-11"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="relative space-y-2">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          className="bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary/50 pr-10 h-11"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-0 h-11 flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          className="w-full h-11 text-base font-semibold shadow-lg hover:shadow-primary/20 transition-all rounded-xl"
          disabled={isLogingIn}
        >
          {isLogingIn ? "Logging in..." : "Login"}
        </Button>
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Forgot your password? <span className="text-primary hover:underline cursor-pointer">Reset here</span>
        </p>
      </div>
    </form>
  )
}

export default Login;