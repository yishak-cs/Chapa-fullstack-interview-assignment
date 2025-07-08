import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, AlertTriangle } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/Components/ui/collapsible';
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Toaster, toast } from "react-hot-toast";


interface Contract {
    id: number;
    start_date: string;
    end_date: string;
    status: 'pending' | 'active' | 'expired' | 'terminated';
    unit_id: number;
    unit_code: string;
    business: string;
    business_type: string | '';
    business_owner: string;
    rent_amount: number;
    terms?: string;
    document_path?: string;
    notice_period_days?: number;
    payments?: Payment[];
}

interface Payment {
    name: string;
    status: 'pending' | 'paid' | 'overdue' | 'failed';
    amount: number;
    due_date: string;
    paid_date?: string;
    payment: string | null;
    transaction_reference: string | null;
    ref_id: string | null;
    transaction_details: any | null;
    owner?: string;
}

interface props extends PageProps {
    contract: Contract;
}

export default function Page({ auth, contract }: props) {
    const [expandedPayment, setExpandedPayment] = useState<string | null>(null);
    const [isTerminateDialogOpen, setIsTerminateDialogOpen] = useState(false);
    const [isTerminating, setIsTerminating] = useState(false);
    const contractData = ((contract && typeof contract === 'object' && 'data' in contract)
        ? contract.data
        : contract) as Contract;

    // Helper function to get status badge
    const getStatusBadge = (status: string) => {
        const statusClasses = {
            active: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            expired: 'bg-gray-100 text-gray-800',
            terminated: 'bg-red-100 text-red-800'
        };

        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusClasses[status as keyof typeof statusClasses]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    // Helper function to format dates
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleTerminateContract = async () => {
        try {
            setIsTerminating(true);
            const response = await axios.patch(`/contracts/${contractData.id}/terminate`, {
                status: 'terminated'
            });
            if (response.data.message) {
                toast.success(response.data.message || 'Contract terminated successfully');
            }
        } catch (error: any) {
            toast.error(error.response.data.error || error.response?.data?.message || 'Failed to terminate contract');
        } finally {
            setIsTerminating(false);
            setIsTerminateDialogOpen(false);
        }
    };

    const canTerminate = ['pending', 'active'].includes(contractData.status);
    const paymentsToCancel = Array.isArray(contractData.payments)
        ? contractData.payments.filter(p => ['pending', 'overdue', 'failed'].includes(p.status))
        : [];

    return (
        <AuthenticatedLayout
            user={{
                id: auth.user.id,
                fullname: auth.user.fullname,
                role: auth.user.role,
                email: auth.user.email,
                avatar: auth.user.avatar
            }}
        >
            <Toaster position="top-right" />
            {/* Add responsive base font size */}
            <style>{`
                @media (max-width: 640px) {
                    html { font-size: 14px; }
                }
                @media (min-width: 641px) and (max-width: 1024px) {
                    html { font-size: 15px; }
                }
                @media (min-width: 1025px) {
                    html { font-size: 16px; }
                }
            `}</style>

            <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
                {/* Contract Header */}
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                                {contractData.business}
                            </h1>
                            <p className="text-sm sm:text-base text-gray-500">Unit: {contractData.unit_code}</p>
                            <p className="text-sm sm:text-base text-gray-500">Owner: {contractData.business_owner}</p>
                            <p className="text-sm sm:text-base text-gray-500">type: {contractData.business_type}</p>
                        </div>
                        <div className="flex justify-start sm:justify-end items-start gap-4">
                            {getStatusBadge(contractData.status)}
                        </div>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-4 sm:mb-6">
                    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                        <h3 className="text-xs sm:text-sm font-medium text-gray-500">Rent Amount</h3>
                        <p className="mt-2 text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">
                            ${contractData.rent_amount.toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                        <h3 className="text-xs sm:text-sm font-medium text-gray-500">Contract Period</h3>
                        <p className="mt-2 text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">
                            {formatDate(contractData.start_date)} - {formatDate(contractData.end_date)}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                        <h3 className="text-xs sm:text-sm font-medium text-gray-500">Notice Period</h3>
                        <p className="mt-2 text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">
                            {contractData.notice_period_days} days
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                        <h3 className="text-xs sm:text-sm font-medium text-gray-500">Document</h3>
                        <div className="mt-2">
                            {contractData.document_path ? (
                                <a
                                    href={contractData.document_path}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-primary hover:underline text-sm sm:text-base"
                                >
                                    <FileText className="h-4 w-4" />
                                    View Document
                                </a>
                            ) : (
                                <p className="text-sm sm:text-base text-gray-500">No document attached</p>
                            )}
                        </div>
                    </div>
                    {/* Terminate Contract Action Section */}
                    {canTerminate && (
                        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                            <Button
                                variant="destructive"
                                onClick={() => setIsTerminateDialogOpen(true)}
                            >
                                Terminate Contract
                            </Button>
                        </div>
                    )}
                </div>

                {/* Payments Section */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="p-4 sm:p-6 border-b border-gray-200">
                        <h2 className="text-lg sm:text-xl font-medium text-gray-900">Payment History</h2>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {Array.isArray(contractData.payments) && contractData.payments.length > 0 ? (
                            contractData.payments.map((payment) => {
                                const paymentId = payment.ref_id || `${payment.name}-${payment.due_date}`;
                                return (
                                    <Collapsible
                                        key={paymentId}
                                        open={expandedPayment === paymentId}
                                        onOpenChange={() => setExpandedPayment(expandedPayment === paymentId ? null : paymentId)}
                                    >
                                        <div className="p-4">
                                            <CollapsibleTrigger className="w-full">
                                                <div className="flex items-center justify-between cursor-pointer">
                                                    <div className="flex-1">
                                                        <div className="flex items-center">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-medium
                                                                ${payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                                                                    payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                        payment.status === 'overdue' ? 'bg-red-100 text-red-800' :
                                                                            'bg-gray-100 text-gray-800'}`}>
                                                                {payment.status}
                                                            </span>
                                                            <span className="ml-3 text-sm sm:text-base font-medium text-gray-900">
                                                                {payment.name}
                                                            </span>
                                                        </div>
                                                        <div className="mt-1 text-xs sm:text-sm text-gray-500">
                                                            Due: {formatDate(payment.due_date)}
                                                        </div>
                                                    </div>
                                                    <div className="ml-6 flex items-center">
                                                        <span className="text-sm sm:text-base font-medium text-gray-900">
                                                            ${payment.amount.toLocaleString()}
                                                        </span>
                                                        {expandedPayment === paymentId ? (
                                                            <ChevronUp className="ml-2 h-5 w-5 text-gray-500" />
                                                        ) : (
                                                            <ChevronDown className="ml-2 h-5 w-5 text-gray-500" />
                                                        )}
                                                    </div>
                                                </div>
                                            </CollapsibleTrigger>

                                            <CollapsibleContent>
                                                <div className="mt-4">
                                                    <div className="rounded-md bg-gray-50 p-4">
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                            <div>
                                                                <p className="text-xs sm:text-sm font-medium text-gray-500">Payment Method</p>
                                                                <p className="mt-1 text-sm sm:text-base text-gray-900">
                                                                    {payment.payment ?? '-'}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs sm:text-sm font-medium text-gray-500">Paid Date</p>
                                                                <p className="mt-1 text-sm sm:text-base text-gray-900">
                                                                    {payment.paid_date ? formatDate(payment.paid_date) : '-'}
                                                                </p>
                                                            </div>
                                                            {payment.transaction_reference && (
                                                                <div>
                                                                    <p className="text-xs sm:text-sm font-medium text-gray-500">Transaction Reference</p>
                                                                    <p className="mt-1 text-sm sm:text-base text-gray-900">
                                                                        {payment.transaction_reference}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Transaction Details JSON Viewer */}
                                                        {payment.transaction_details && (
                                                            <div className="mt-4">
                                                                <p className="text-xs sm:text-sm font-medium text-gray-500 mb-2">Transaction Details</p>
                                                                <pre className="bg-gray-900 rounded-md p-4 overflow-x-auto">
                                                                    <code className="text-xs sm:text-sm text-gray-100">
                                                                        {JSON.stringify(payment.transaction_details, null, 2)}
                                                                    </code>
                                                                </pre>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </CollapsibleContent>
                                        </div>
                                    </Collapsible>
                                );
                            })
                        ) : (
                            <div className="p-4 sm:p-6 text-center text-sm sm:text-base text-gray-500">
                                No payment records found
                            </div>
                        )}
                    </div>
                </div>

                {/* Termination Dialog */}
                <Dialog open={isTerminateDialogOpen} onOpenChange={setIsTerminateDialogOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-destructive">
                                <AlertTriangle className="h-5 w-5" />
                                Terminate Contract
                            </DialogTitle>
                            <DialogDescription asChild>
                                <div className="pt-4">
                                    <div className="space-y-4">
                                        <div className="font-medium">
                                            Are you sure you want to terminate this contract? This action is <span className="text-destructive font-semibold">irreversible</span> and will:
                                        </div>
                                        <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                            <ul className="list-disc pl-5 space-y-2 text-sm text-red-800">
                                                <li>Cancel the following unpaid payments:</li>
                                                <ul className="pl-5">
                                                    {paymentsToCancel.length > 0 ? (
                                                        paymentsToCancel.map((p, idx) => (
                                                            <li key={idx} className="flex justify-between items-center py-1">
                                                                <span>{p.name} <span className="text-xs text-gray-500">(Due: {formatDate(p.due_date)})</span></span>
                                                                <span className="font-semibold">${p.amount.toLocaleString()}</span>
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li className="text-gray-500">No unpaid payments to cancel</li>
                                                    )}
                                                </ul>
                                                {contractData.status === 'active' && (
                                                    <li>
                                                        Reclaim the unit <span className="font-semibold">{contractData.unit_code}</span> and mark it as vacant
                                                    </li>
                                                )}
                                                <li>Change the contract status to <span className="font-semibold">terminated</span></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button
                                variant="outline"
                                onClick={() => setIsTerminateDialogOpen(false)}
                                disabled={isTerminating}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleTerminateContract}
                                disabled={isTerminating}
                            >
                                {isTerminating ? 'Terminating...' : 'Yes, Terminate Contract'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AuthenticatedLayout>
    );
}