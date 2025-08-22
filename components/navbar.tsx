"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { ArrowRight, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
    const {isSignedIn, user } = useUser();
    const pathName = usePathname();

    const isDashboardPage = pathName === '/dashboard';
    //const isBoardPage = pathName.startsWith('/boards/');

    if (isDashboardPage) {
        return (
            <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Bot className="text-blue-600" />
                        <span className="text-xl font-bold text-gray-600">HR Assistant</span>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <UserButton />
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Bot className="text-blue-600" />
                    <span className="text-xl font-bold text-gray-600">HR Assistant</span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-4">
                    {isSignedIn ? (
                        <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-1 sm:space-y-0 sm-space-x-4">
                            <span className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                                Welcome, {user.firstName ?? user.emailAddresses[0].emailAddress}
                            </span>
                            <Link href="/dashboard">
                                <Button size="sm" className="text-xs sm:text-sm">
                                    Go to Dashboard <ArrowRight />
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div>
                            <SignInButton>
                                <Button variant={"ghost"} size={"sm"} className="text-xs sm:text-sm">Sign in</Button>
                            </SignInButton>
                            <SignUpButton>
                                <Button size={"sm"} className="text-xs sm:text-sm">Sign up</Button>
                            </SignUpButton>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}