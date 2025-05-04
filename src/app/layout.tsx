"use client";

import { Poppins } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FaShoppingCart, FaBars } from "react-icons/fa";
import { CartProvider, useCart } from "@/context/CartContext"; 
import CartContent from "@/component/CartContent";
import { Toaster } from 'sonner';
import { useState } from "react";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <html lang="en" className="!scroll-smooth">
      <body className={`${poppins.variable} antialiased`}>
        <CartProvider>
          <header className="border-b border-lightblue p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/">
                <img src="/img/magescologo.png" alt="Magesco Logo" className="h-10 md:h-12" />
              </Link>
              <Link href="/">
                <h1 className="text-lg md:text-xl font-medium hidden sm:block">
                  Magesco Garden and Pool Services
                </h1>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <NavigationMenu>
                <NavigationMenuList className="flex gap-3">
                  <NavigationMenuItem>
                    <NavigationMenuLink href="/products" className="px-3 py-2 hover:text-blue-600">
                      Products
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuLink href="/services" className="px-3 py-2 hover:text-blue-600">
                      Services
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuLink href="/userlogin" className="px-3 py-2 hover:text-blue-600">
                      Login
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuLink href="/account" className="px-3 py-2 hover:text-blue-600">
                      Account
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuLink href="/aboutus" className="px-3 py-2 hover:text-blue-600">
                      About us
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  
                </NavigationMenuList>
              </NavigationMenu>

              <CartButton />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
              <CartButton />
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-800"
                aria-label="Toggle menu"
              >
                <FaBars className="text-xl" />
              </button>
            </div>
          </header>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white shadow-lg p-4">
              <nav className="flex flex-col gap-3">
                <Link href="/products" className="px-3 py-2 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>
                  Products
                </Link>
                <Link href="/services" className="px-3 py-2 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>
                  Services
                </Link>
                <Link href="/aboutus" className="px-3 py-2 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>
                  About us
                </Link>
                <Link href="#" className="px-3 py-2 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>
                  Contact us
                </Link>
              </nav>
            </div>
          )}

          {children}
          <Toaster richColors />
          
          <footer className="bg-gray-900 text-white p-6 md:p-12">
            <div className="container mx-auto flex flex-col md:flex-row justify-between gap-8">
              <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-6">
                <div className="flex-shrink-0">
                  <img src="/img/magescologo.png" alt="Logo" className="h-12" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Magesco Garden and Pool Services</h2>
                  <p className="mt-1 text-gray-400 text-sm max-w-md">
                    Transform your backyard into a resort-worthy retreat with our expert pool and landscaping solutions.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 md:flex md:space-x-12">
                <div>
                  <h3 className="text-blue-400 font-bold">About</h3>
                  <ul className="mt-2 space-y-1">
                    <li><a href="#" className="hover:text-blue-300 text-sm">Shipping</a></li>
                    <li><a href="#" className="hover:text-blue-300 text-sm">Help</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-blue-400 font-bold">Info</h3>
                  <ul className="mt-2 space-y-1">
                    <li><a href="#" className="hover:text-blue-300 text-sm">Contact us</a></li>
                    <li><a href="#" className="hover:text-blue-300 text-sm">Terms & Conditions</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}

function CartButton() {
  const { totalCartItems } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="relative cursor-pointer">
          <FaShoppingCart className="text-xl text-gray-800" />
          {totalCartItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              {totalCartItems}
            </span>
          )}
        </div>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>My Cart</SheetTitle>
        </SheetHeader>
        <CartContent />
      </SheetContent>
    </Sheet>
  );
}