import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import DataTable from '@/Components/ui/datatable';
import DataTableColumnHeader from '@/Components/ui/datatableheader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';

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
  totalManagedUsers: number,
  activeManagedUsers: number,
  NumberOfTransactions: number,
  totalAmountProcessed: number,
  totalManagedUsersBalance: number

}

interface AdminDashboardProps extends PageProps {
  managedUsersTransactions: Transaction[];
  stats: DashboardStats;
}

export default function Dashboard({ auth, managedUsersTransactions, stats }: AdminDashboardProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const transactionsData = ((managedUsersTransactions && typeof managedUsersTransactions === 'object' && 'data' in managedUsersTransactions)
    ? managedUsersTransactions.data
    : managedUsersTransactions) as Transaction[];

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
            <Card className="flex flex-col justify-center items-center">
              <CardHeader className="w-full text-center">
                <CardTitle>Users</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center w-full">
                <div className="text-4xl font-bold text-primary mb-2">{stats.totalManagedUsers}</div>
                <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
                  <span className="">Active: <span className="font-semibold">{stats.activeManagedUsers}</span></span>
                </div>
              </CardContent>
            </Card>
            {/* Transactions stats card */}
            <Card className="flex flex-col justify-center items-center">
              <CardHeader className="w-full text-center">
                <CardTitle>Transactions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center w-full">
                <div className="text-4xl font-bold text-primary mb-2">{stats.NumberOfTransactions}</div>
                <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
                  <span>Total: <span className="font-semibold">{stats.totalAmountProcessed}</span></span>
                </div>
              </CardContent>
            </Card>
            {/* System balance card */}
            <Card className="flex flex-col justify-center items-center">
              <CardHeader className="w-full text-center">
                <CardTitle>total Users Balance</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center w-full">
                <div className="text-4xl font-bold text-primary mb-2">{stats.totalManagedUsersBalance}</div>
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
