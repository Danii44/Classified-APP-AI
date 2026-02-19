'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  Menu, X, Home, Plus, MessageCircle, User, LogOut, Settings,
  Bell, Search, MapPin, Package2, LogIn
} from 'lucide-react'

export function Header() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        const sessionUser = data.session?.user

        if (sessionUser) {
          setUser(sessionUser)
          // Check if user is admin
          const { data: adminData } = await supabase
            .from('admin_users')
            .select('id')
            .eq('id', sessionUser.id)
            .single()
          setIsAdmin(!!adminData)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkUser()
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setIsAdmin(false)
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-primary/10 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-white">
            <Package2 size={18} />
          </div>
          <span className="hidden sm:inline text-brand-primary">NexusMarket</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <Home size={18} />
              Home
            </Button>
          </Link>
          {user && (
            <>
              <Link href="/messages">
                <Button variant="ghost" className="gap-2">
                  <MessageCircle size={18} />
                  Messages
                </Button>
              </Link>
              <Link href="/listings/create">
                <Button variant="ghost" className="gap-2">
                  <Plus size={18} />
                  Post Ad
                </Button>
              </Link>
            </>
          )}
        </nav>

        {/* Right side - Auth/User Menu */}
        <div className="flex items-center gap-2 lg:gap-4">
          <ThemeToggle />

          {!loading && (
            <>
              {user ? (
                <>
                  {/* Desktop Menu */}
                  <div className="hidden md:block">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="gap-2">
                          <User size={18} />
                          <span className="hidden lg:inline text-sm">
                            {user.user_metadata?.first_name || 'Account'}
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem asChild>
                          <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                            <User size={16} />
                            Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
                            <Settings size={16} />
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                        {isAdmin && (
                          <DropdownMenuItem asChild>
                            <Link href="/admin" className="flex items-center gap-2 cursor-pointer">
                              <Settings size={16} />
                              Admin Panel
                            </Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer text-red-500">
                          <LogOut size={16} />
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Mobile Menu */}
                  <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                    <SheetTrigger asChild className="md:hidden">
                      <Button variant="ghost" size="icon">
                        <Menu size={20} />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[280px]">
                      <nav className="flex flex-col gap-4 mt-8">
                        <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start gap-2">
                            <Home size={18} />
                            Home
                          </Button>
                        </Link>
                        <Link href="/messages" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start gap-2">
                            <MessageCircle size={18} />
                            Messages
                          </Button>
                        </Link>
                        <Link href="/listings/create" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start gap-2">
                            <Plus size={18} />
                            Post Ad
                          </Button>
                        </Link>
                        <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start gap-2">
                            <User size={18} />
                            Profile
                          </Button>
                        </Link>
                        <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start gap-2">
                            <Settings size={18} />
                            Dashboard
                          </Button>
                        </Link>
                        {isAdmin && (
                          <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start gap-2">
                              <Settings size={18} />
                              Admin Panel
                            </Button>
                          </Link>
                        )}
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-2 text-red-500"
                          onClick={async () => {
                            await handleLogout()
                            setMobileMenuOpen(false)
                          }}
                        >
                          <LogOut size={18} />
                          Logout
                        </Button>
                      </nav>
                    </SheetContent>
                  </Sheet>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/auth/login" className="hidden sm:block">
                    <Button variant="ghost" className="gap-2">
                      <LogIn size={18} />
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/sign-up">
                    <Button className="gap-2 bg-brand-primary hover:bg-brand-primary/90">
                      <Plus size={18} />
                      <span className="hidden sm:inline">Sign Up</span>
                    </Button>
                  </Link>

                  {/* Mobile - show menu icon */}
                  <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                    <SheetTrigger asChild className="md:hidden">
                      <Button variant="ghost" size="icon">
                        <Menu size={20} />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[280px]">
                      <nav className="flex flex-col gap-4 mt-8">
                        <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start gap-2">
                            <Home size={18} />
                            Home
                          </Button>
                        </Link>
                        <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                          <Button className="w-full justify-start gap-2 bg-brand-primary hover:bg-brand-primary/90">
                            <LogIn size={18} />
                            Login
                          </Button>
                        </Link>
                        <Link href="/auth/sign-up" onClick={() => setMobileMenuOpen(false)}>
                          <Button className="w-full justify-start gap-2 bg-brand-accent hover:bg-brand-accent/90">
                            <Plus size={18} />
                            Sign Up
                          </Button>
                        </Link>
                      </nav>
                    </SheetContent>
                  </Sheet>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}
