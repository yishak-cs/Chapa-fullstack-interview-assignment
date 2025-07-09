import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import DataTable from '@/Components/ui/datatable';
import DataTableColumnHeader from '@/Components/ui/datatableheader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { Users, ArrowLeftRight, CircleDollarSign } from "lucide-react";

// Transaction interface
interface Transaction {
  id: number;
  amount: string;
  currency: string;
  description: string;
  status: string;
  reference_number: string;
  sender: {
    id: number;
    name: string;
    email: string;
  };
  recipient: {
    id: number;
    name: string;
    email: string;
  };
}

// Dashboard stats interface
interface DashboardStats {
  totalUsers: number;
  totalAdmins: number;
  totalRegularUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalTransactions: number;
  totalAmountProcessed: number;
  totalSystemBalance: number;
  todaysTransactions: number;
  todaysAmount: number;
}

interface SuperAdminDashboardProps extends PageProps {
  allTransactions: Transaction[];
  stats: DashboardStats;
}

export default function Dashboard({ auth, allTransactions, stats }: SuperAdminDashboardProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const transactionsData = ((allTransactions && typeof allTransactions === 'object' && 'data' in allTransactions)
    ? allTransactions.data
    : allTransactions) as Transaction[];


  useEffect(() => {
    if (selectedTransaction) {
      fetchTransactionDetails(selectedTransaction.id);
    }
  }, [selectedTransaction]);

  const fetchTransactionDetails = async (transactionId: number) => {
    try {
      router.visit(`/transaction/${transactionId}`);
    } catch (error) {
      console.error('Error fetching tenant details:', error);
    }
  };

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
    },
    {
      accessorKey: 'amount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Amount" />
      ),
    },
    {
      accessorKey: 'currency',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Currency" />
      ),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
    },
    {
      accessorKey: 'reference_number',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Reference Number" />
      ),
    },
    {
      accessorKey: 'sender.name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Sender" />
      ),
    },
    {
      accessorKey: 'recipient.name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Recipient" />
      ),
    },
  ];

  return (
    <AuthenticatedLayout user={auth.user}>
      <div className="flex flex-1 flex-col gap-4 p-4 sm:p-6 pt-0">
        <div className="space-y-6">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            {/* Users stats card */}
            <Card className="aspect-video flex flex-col justify-center items-center shadow-lg">
              <CardHeader className="w-full text-center flex flex-col items-center">
                <Users className="h-8 w-8 text-green-500 mb-2" />
                <CardTitle className="text-lg font-semibold">Users</CardTitle>
                <CardDescription>
                  Total users in the system.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center w-full">
                <div className="text-4xl font-bold text-primary mb-2">{stats.totalUsers}</div>
                <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
                  <span>Admins: <span className="font-semibold">{stats.totalAdmins}</span></span>
                  <span>Regular: <span className="font-semibold">{stats.totalRegularUsers}</span></span>
                  <span>Active: <span className="font-semibold">{stats.activeUsers}</span></span>
                  <span>Inactive: <span className="font-semibold">{stats.inactiveUsers}</span></span>
                </div>
              </CardContent>
            </Card>
            {/* Transactions stats card */}
            <Card className="aspect-video flex flex-col justify-center items-center shadow-lg">
              <CardHeader className="w-full text-center flex flex-col items-center">
                <ArrowLeftRight className="h-8 w-8 text-blue-500 mb-2" />
                <CardTitle className="text-lg font-semibold">Transactions</CardTitle>
                <CardDescription>
                  Total value and count of all transactions in the system.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center w-full">
                <div className="text-4xl font-bold text-primary mb-2">{stats.totalAmountProcessed}</div>
                <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
                  <span>Total: <span className="font-semibold">{stats.totalTransactions}</span></span>
                  <span>Today's: <span className="font-semibold">{stats.todaysTransactions}</span></span>
                  <span>Today's Amount: <span className="font-semibold">{stats.todaysAmount}</span></span>
                </div>
              </CardContent>
            </Card>
            {/* System balance card */}
            <Card className="aspect-video flex flex-col justify-center items-center shadow-lg">
              <CardHeader className="w-full text-center flex flex-col items-center">
                <CircleDollarSign className="h-8 w-8 text-yellow-500 mb-2" />
                <CardTitle className="text-lg font-semibold">System Balance</CardTitle>
                <CardDescription>
                  Sum of all wallet balances across the entire system.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center w-full">
                <div className="text-4xl font-bold text-primary mb-2">{stats.totalSystemBalance}</div>
              </CardContent>
            </Card>
          </div>
          {/* Transactions table or other dashboard content can go here */}
          <Card>
            <CardHeader>
              <CardTitle>Transactions</CardTitle>
              <CardDescription>
                Click on a Transaction to view the details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={transactionsData}
                searchKey='reference_number'
                onRowClick={(row) =>
                  setSelectedTransaction(row.original)
                }
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
