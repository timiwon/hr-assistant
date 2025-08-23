"use client";

import { FileText, FileWarning, MonitorCheck, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useJobs } from "@/hooks/useJobs";
import { useUser } from "@/providers/SignedInUserProvider";


export default function DashboardPage() {
    const { user } = useUser();
    const { loading, error, jobs, jobsCount, createJob } = useJobs();

    const handleCreateOrganization = async () => {
        const organization = {
            name: "abc company",
            description: ""
        };
        await createJob({
            organization,
            job: {
                priority: "medium",
                title: "job 1",
                description: "",
                candidate_amount: 2
            }
        });
    };

    return (<main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6 sm:py-8">
            <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-600 mb-2">
                    Welcome back, {" "}
                    {user?.firstName ?? user?.emailAddresses[0].emailAddress}!
                </h1>
                <p className="text-gray-500">Here is what happening with your boards today.</p>
                <Button className="w-full sm:w-auto" onClick={handleCreateOrganization}>
                    <Plus className="h-4 w-4"/>
                    Create Job
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {jobsCount && <Card>
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
                </Card>}
                <Card>
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm font-medium text-gray-500">Recent Activity</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-600">
                                    {jobs.filter(job => {
                                        const updatedAt = new Date(job.updated_at);
                                        const oneWeekAgo = new Date();
                                        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                                        return  updatedAt > oneWeekAgo;
                                    }).length}
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
                                    {jobs.filter(job => job.status === 'pending').length}
                                </p>
                            </div>
                            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <FileWarning className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500"/>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>


            <div>
                {jobs.map((job, index) => <h2 key={index}>{job.title}</h2>)}
            </div>
        </div>
    </main>);
}