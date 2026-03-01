import { useState } from "react";
import { useAuthStore } from "../../store/autStore";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Upload } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";


const SignUp = () => {

  const [fullname, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [preview, setPreview] = useState(null);
  const { isSigningUp, signUp } = useAuthStore()

  const handleSubmit = (e) => {
    e.preventDefault();
    signUp({ fullname, email, password, file });
  }

  const handleImage = (e) => {
    e.preventDefault();
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Input
          placeholder="Full Name"
          className="bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary/50 h-11"
          value={fullname}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
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

      <div className="flex items-center gap-4 py-2">
        <div className="relative group">
          <Avatar className="w-16 h-16 border-2 border-primary/20 group-hover:border-primary transition-all">
            <AvatarImage src={preview || ""} />
            <AvatarFallback className="bg-muted text-muted-foreground">
              {fullname ? fullname[0].toUpperCase() : <Upload size={20} />}
            </AvatarFallback>
          </Avatar>
        </div>

        <label className="flex-1">
          <span className="flex items-center gap-2 cursor-pointer text-sm font-medium text-primary hover:text-primary/80 transition-all underline underline-offset-4 decoration-primary/30">
            <Upload size={16} /> Choose Profile Picture
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="hidden"
          />
        </label>
      </div>

      <Button
        type="submit"
        className="w-full h-11 text-base font-semibold shadow-lg hover:shadow-primary/20 transition-all rounded-xl"
        disabled={isSigningUp}
      >
        {isSigningUp ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  )
}

export default SignUp