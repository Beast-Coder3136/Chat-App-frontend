"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SignUp from "../components/authentication/SignUp"
import Login from "../components/authentication/Login"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4 py-12 relative overflow-hidden">
      {/* Abstract background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-md z-10 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 mb-2">
            <h1 className="text-3xl font-extrabold tracking-tighter text-primary">
              TALK-A-TIVE
            </h1>
          </div>
          <p className="text-muted-foreground text-sm font-medium">
            Next generation real-time communication.
          </p>
        </div>

        <Card className="border border-border/50 shadow-xl bg-card/80 backdrop-blur-xl rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid grid-cols-2 w-full p-1 bg-muted/50 rounded-xl mb-8">
                <TabsTrigger
                  value="signup"
                  className="rounded-lg transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md"
                >
                  Sign Up
                </TabsTrigger>
                <TabsTrigger
                  value="login"
                  className="rounded-lg transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md"
                >
                  Login
                </TabsTrigger>
              </TabsList>

              <div className="mt-2">
                <TabsContent value="signup" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <SignUp />
                </TabsContent>

                <TabsContent value="login" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <Login />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground pt-4">
          By continuing, you agree to our Terms of Service.
        </p>
      </div>
    </div>
  )
}