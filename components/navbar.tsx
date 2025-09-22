"use client";

import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { ArrowLeft, ArrowRight, Bot, Filter, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { Badge } from "./ui/badge";

type NavbarProps = {
    jobTitle?: string;
    onEditJob?: () => void;

    onFilterClick?: () => void;
    filterCount?: number;
}
export default function Navbar({
    jobTitle,
    onEditJob,
    onFilterClick,
    filterCount = 0
}: NavbarProps) {
    const {isSignedIn, user } = useUser();
    const pathName = usePathname();

    const isDashboardPage = pathName === '/dashboard';
    const isJobPage = pathName.startsWith('/jobs/');

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

    if (isJobPage) {
        return (
            <header className="border-b bg-white sticky top-0 z-50">
                <div className="container mx-auto px-4 py-3 sm:py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
                            <Link href="/dashboard" className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-gray-900">
                                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5"/>
                                <span className="hidden sm:inline">Back to dashboard</span>
                                <span className="sm:hidden">Back</span>
                            </Link>
                            <div className="h-4 sm:h-6 w-px bg-gray-300 hidden sm:block"/>
                            <div className="flex items-center space-x-1 sm:space-x-2">
                                <Bot className="text-blue-600" />
                                <div className="items-center space-x-1 sm:space-x-2">
                                    <span className="text-lg font-bold text-gray-600 truncate">{jobTitle}</span>
                                    {onEditJob && (<Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 w-7"
                                        onClick={onEditJob}
                                    >
                                        <MoreHorizontal />
                                    </Button>)}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 sm:space-x-4">
                            {onFilterClick && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={`text-xs sm:text-sm ${
                                        filterCount > 0 ? "bg-blue-100 border-blue-200" : ""
                                    }`}
                                    onClick={onFilterClick}
                                >
                                    <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr2"/>
                                    <span className="hidden sm:inline">Filter</span>
                                    {filterCount > 0 && (
                                        <Badge variant="secondary" className="text-xs ml-1 sm:ml-2 bg-blue-100 border-blue-200">{filterCount}</Badge>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </header>
        )
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