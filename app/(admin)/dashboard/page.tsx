"use client";

import { useState } from "react";
import { FileText, FileWarning, Filter, Grid3X3, List, MonitorCheck, Plus, Search } from "lucide-react";

import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useJobs } from "@/hooks/useJobs";
import { useUser } from "@/providers/SignedInUserProvider";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";


export default function DashboardPage() {
    const { user } = useUser();
    const {
        error,
        recentActivityJobsCount,
        jobs,
        jobsCount,
        pendingJobsCount,
        createJob
    } = useJobs();

    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

    const handleCreateJob = async () => {
        const organization = {
            name: "abc company",
            description: ""
        };
        await createJob({
            organization,
            job: {
                status: "open",
                priority: "medium",
                title: "job 1",
                description: "",
                headcount: 2,
                organization_id: "1",
                domain_id: "1"
            }
        });
    };

    if (error) {
        throw new Error(error);
    }

    return (<main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-6 sm:py-8">
            <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-600 mb-2">
                    Welcome back, {" "}
                    {user?.firstName ?? user?.emailAddresses[0].emailAddress}!
                </h1>
                <p className="text-gray-500">Here is what happening with your boards today.</p>
                <Button className="w-full sm:w-auto" onClick={handleCreateJob}>
                    <Plus className="h-4 w-4"/>
                    Create Job
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {jobsCount !== null && jobsCount > 0 && (<Card>
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm font-medium text-gray-500">Total Jobs</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-600">{jobsCount}</p>
                            </div>
                            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500"/>
                            </div>
                        </div>
                    </CardContent>
                </Card>)}
                <Card>
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm font-medium text-gray-500">Recent Activity</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-600">
                                    {recentActivityJobsCount}
                                </p>
                            </div>
                            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <MonitorCheck className="h-5 w-5 sm:h-6 sm:w-6 text-green-500"/>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm font-medium text-gray-500">Pending Jobs</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-600">
                                    {pendingJobsCount}
                                </p>
                            </div>
                            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <FileWarning className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500"/>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>


            {/* Toolbar */}
            <div className="mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-600">Opening Jobs</h2>
                        <p className="text-gray-500">Manage jobs and processes</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0">
                    <div className="flex items-center space-x-2 bg-white border p-1">
                        <Button
                            variant={viewMode === "grid" ? "default" : "ghost"}
                            size={"sm"}
                            onClick={() => setViewMode("grid")}
                        >
                            <Grid3X3 />
                        </Button>
                        <Button
                            variant={viewMode === "list" ? "default" : "ghost"}
                            size={"sm"}
                            onClick={() => setViewMode("list")}
                        >
                            <List />
                        </Button>
                    </div>
                    
                    <Button variant={"outline"} size="sm">
                        <Filter />
                        Filter
                    </Button>

                    <Button onClick={handleCreateJob}>
                        <Plus />
                        Create Job
                    </Button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-4 sm:mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
                <Input id="search" placeholder="Search jobs..." className="pl-10"/>
            </div>

            {/* Jobs */}
            {jobs.length === 0 && (<div>
                No jobs
            </div>)}

            {jobs.length > 0 && viewMode === "grid" && (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {jobs.map((job, index) => <Link key={index} href={`/jobs/${job.id}`}>
                    <Card className="hover:shadow-lg transition-shadow duration-500 cursor-pointer group">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div className={`w-4 h-4 ${job.status === 'open' ? 'bg-green-400' : job.status === 'pending' ? 'bg-yellow-400' : 'bg-gray-400'} rounded`}/>
                                <Badge className="text-xs" variant="secondary">New</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6">
                            <CardTitle className="text-base sm:text-lg mb-2 group-hover:text-blue-600 transition-colors duration-500">{job.title}</CardTitle>
                            <CardDescription className="text-sm mb-4">{job.description}</CardDescription>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500 space-y-1 sm:space-y-0">
                                <span>
                                    Created {" "}
                                    {new Date(job.created_at).toLocaleDateString()}
                                </span>
                                <span>
                                    Updated {" "}
                                    {new Date(job.updated_at).toLocaleDateString()}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </Link>)}

                <Card className="border border-dashed border-gray-300 hover:border-gray-700 transition-colors duration-500 cursor-pointer group">
                    <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center h-full min-h-[150px]">
                        <Plus className="h-6 w-6 sm:h-7 sm:w-7 text-gray-400 group-hover:text-blue-600 transition-colors duration-500"/>
                        <p className="text-sm sm:text-base text-gray-500 group-hover:text-blue-600 font-medium transition-colors duration-500">Create new job</p>
                    </CardContent>
                </Card>
            </div>)}

            {jobs.length > 0 && viewMode === "list" && (<div>
                {jobs.map((job, index) => <div key={index} className={index > 0 ? "mt-4" : ""}>
                    <Link href={`/jobs/${job.id}`}>
                        <Card className="hover:shadow-lg transition-shadow duration-500 cursor-pointer group">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className={`w-4 h-4 ${job.status === 'open' ? 'bg-green-400' : job.status === 'pending' ? 'bg-yellow-400' : 'bg-gray-400'} rounded`} />
                                    <Badge className="text-xs" variant="secondary">New</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 sm:p-6">
                                <CardTitle className="text-base sm:text-lg mb-2 group-hover:text-blue-600 transition-colors duration-500">{job.title}</CardTitle>
                                <CardDescription className="text-sm mb-4">{job.description}</CardDescription>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500 space-y-1 sm:space-y-0">
                                    <span>
                                        Created {" "}
                                        {new Date(job.created_at).toLocaleDateString()}
                                    </span>
                                    <span>
                                        Updated {" "}
                                        {new Date(job.updated_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </div>)}

                <Card className="mt-4 border border-dashed border-gray-300 hover:border-gray-700 transition-colors duration-500 cursor-pointer group">
                    <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center h-full min-h-[150px]">
                        <Plus className="h-6 w-6 sm:h-7 sm:w-7 text-gray-400 group-hover:text-blue-600 transition-colors duration-500"/>
                        <p className="text-sm sm:text-base text-gray-500 group-hover:text-blue-600 font-medium transition-colors duration-500">Create new job</p>
                    </CardContent>
                </Card>
            </div>)}

            {jobs.length > 0 && viewMode === "list" && (<div>

            </div>)}
        </div>
    </main>);
}