"use client";
import { Button } from "@/components/ui/button";
import { useJobs } from "@/hooks/useJobs";
import { useUser } from "@/providers/SignedInUserProvider";
import { Plus } from "lucide-react";
import { useEffect } from "react";


export default function DashboardPage() {
    const { user } = useUser();
    const { jobs, createJob, getListJob } = useJobs();

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

    useEffect(() => {
        getListJob(1, 10);
    }, []);

    return (<main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6 sm:py-8">
            <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-600 mb-2">
                    Welcome back, {" "}
                    {user?.firstName ?? user?.emailAddresses[0].emailAddress}!
                </h1>
                <p className="text-gray-500">Here is what happening with your boards today.</p>
                <Button className="w-full sm:w-auto" onClick={handleCreateOrganization}>
                    <Plus className="h-4 w-4 mr-2"/>
                    Create Organization
                </Button>
                <div>
                    {jobs.map(job => <h2 key={job.id}>{job.title}</h2>)}
                </div>
            </div>
        </div>
    </main>);
}