import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import DataTable from '@/Components/ui/datatable';
import DataTableColumnHeader from '@/Components/ui/datatableheader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/Components/ui/button';
import { Eye, EyeOff, Send, ArrowUpRight, ArrowDownLeft, Clock, User, Wallet, DollarSign, Check, ChevronDown } from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/Components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/Components/ui/command';
import { Textarea } from '@/Components/ui/textarea';
import { router } from '@inertiajs/react';

interface Transaction {
  id: number;
  amount: string;
  currency: string;
  description: string;
  status: 'completed' | 'failed';
  reference_number: string;
  created_at: string;
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

interface Wallet {
  id: number;
  balance: number;
  currency: string;
  user_id: number;
}

interface DashboardStats {
  totalSent: number;
  totalReceived: number;
  transactionCount: number;
}

interface UserDashboardProps extends PageProps {
  wallet: Wallet;
  transactions: Transaction[] | { data: Transaction[] }; // Handle both direct array and paginated object
  stats: DashboardStats;
}

export default function Dashboard({ auth, wallet, transactions, stats }: UserDashboardProps) {
  const [balanceVisible, setBalanceVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [candidates, setCandidates] = useState<{ id: string | number, name: string }[]>([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [formData, setFormData] = useState({
    recipientId: '',
    amount: '',
    currency: 'ETB',
    description: ''
  });

  // Normalize transactions data whether it's paginated or a direct array
  const transactionsData = ((transactions && typeof transactions === 'object' && 'data' in transactions)
    ? transactions.data
    : transactions) as Transaction[];

  const isSent = (transaction: Transaction) => auth.user.id === transaction.sender.id;
  const isReceived = (transaction: Transaction) => !isSent(transaction);

  const toggleBalanceVisibility = () => {
    setBalanceVisible(!balanceVisible);
  };

  const fetchCandidates = async () => {
    setLoadingCandidates(true);
    try {
      const response = await axios.get('/candidates');
      setCandidates(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Handle authorization error
        if (error.response.status === 403) {
          toast.error(error.response.data?.message || "You don't have permission to access candidates");
        } else {
          toast.error(
            error.response.data?.message || "Failed to fetch candidates"
          );
        }
      } else {
        toast.error("An unexpected error occurred while fetching candidates");
        console.error("Fetch candidates error:", error);
      }
    } finally {
      setLoadingCandidates(false);
    }
  };

  useEffect(() => {
    if (isPaymentDialogOpen) {
      fetchCandidates();
    }
  }, [isPaymentDialogOpen]);

  const handleCandidateSelect = (candidate: { id: string | number, name: string }) => {
    setSelectedCandidate(candidate.name);
    setFormData(prev => ({ ...prev, recipientId: String(candidate.id) }));
    setOpen(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProcessTransaction = async () => {
    if (!formData.recipientId || !formData.amount || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setProcessingPayment(true);
    try {
      console.log(formData)
      const response = await axios.post('/processTransaction', formData);

      console.log('Transaction processed successfully:', response.data);
      toast.success('Payment processed successfully!');

      setFormData({
        recipientId: '',
        amount: '',
        currency: 'ETB',
        description: ''
      });
      setSelectedCandidate('');
      setIsPaymentDialogOpen(false);
      router.reload();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Handle authorization error
        if (error.response.status === 403) {
          toast.error(error.response.data?.message || "You don't have permission to process this transaction");
        } else {
          toast.error(
            error.response.data?.message || "Transaction failed"
          );
        }
      } else {
        toast.error("An unexpected error occurred while processing the transaction");
        console.error("Process transaction error:", error);
      }
    } finally {
      setProcessingPayment(false);
    }
  };

  const lastTransaction = transactionsData.length > 0 ? transactionsData[0] : null;

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
      accessorKey: 'reference_number',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Reference #" />,
    },
    {
      accessorKey: 'amount',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
      cell: ({ row }) => {
        const transaction = row.original;
        const received = isReceived(transaction);
        const amount = parseFloat(transaction.amount);
        return (
          <div className={`font-semibold text-right flex items-center gap-1 ${received ? 'text-green-600' : 'text-red-600'}`}>
            {received ? (
              <ArrowDownLeft className="h-4 w-4 text-green-600" />
            ) : (
              <ArrowUpRight className="h-4 w-4 text-red-600" />
            )}
            {received ? '+' : '-'}{formatCurrency(amount, transaction.currency)}
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const status = row.getValue('status') as Transaction['status'];
        const statusClasses: Record<Transaction['status'], string> = {
          completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
          failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
      cell: ({ row }) => <span>{formatDate(row.getValue('created_at'))}</span>,
    },
    {

      id: 'details',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Details" />,
      cell: ({ row }) => {
        const transaction = row.original;
        const received = isReceived(transaction);
        const counterparty = received ? transaction.sender : transaction.recipient;
        return (
          <div className="flex flex-col">
            <span className="font-medium">{counterparty?.name || 'N/A'}</span>
            <span className="text-xs text-muted-foreground">{transaction.description}</span>
          </div>
        );
      },
    },
  ];

  return (
    <AuthenticatedLayout user={auth.user}>
      <Toaster />
      <div className="flex flex-1 flex-col gap-4 p-4 sm:p-6 pt-0">
        <div className="space-y-6">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium flex items-center">
                <Wallet className="h-5 w-5 mr-2" />
                Wallet Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl font-bold">
                    {balanceVisible
                      ? formatCurrency(wallet?.balance || 0, wallet?.currency || 'USD')
                      : '••••••••'
                    }
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleBalanceVisibility}
                    className="text-white hover:bg-white/20 p-1 rounded-full"
                  >
                    {balanceVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="text-right">
                  <div className="text-sm opacity-90">Available</div>
                  <div className="text-xs opacity-75">Currency: {wallet?.currency || 'N/A'}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* stats cards */}
          <div className="grid auto-rows-min gap-4 md:grid-cols-2">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Last Transaction</CardTitle>
                {lastTransaction && isReceived(lastTransaction) ? (
                  <ArrowDownLeft className="h-4 w-4 text-green-600" />
                ) : (
                  <ArrowUpRight className="h-4 w-4 text-red-600" />
                )}
              </CardHeader>
              <CardContent>
                {lastTransaction ? (
                  <>
                    <div className={`text-2xl font-bold ${isReceived(lastTransaction) ? 'text-green-600' : 'text-red-600'}`}>
                      {isReceived(lastTransaction) ? '+' : '-'}{formatCurrency(parseFloat(lastTransaction.amount), lastTransaction.currency)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {formatDate(lastTransaction.created_at)}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center mt-1">
                      <User className="h-3 w-3 mr-1" />
                      {isReceived(lastTransaction) ? 'From' : 'To'} {isReceived(lastTransaction) ? lastTransaction.sender.name : lastTransaction.recipient.name}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold text-gray-400">No transactions</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      No transaction history found.
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Your Stats</CardTitle>
                <Wallet className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Total Sent</span>
                    <span className="font-semibold text-red-600">-{formatCurrency(stats.totalSent, wallet?.currency || 'USD')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Total Received</span>
                    <span className="font-semibold text-green-600">+{formatCurrency(stats.totalReceived, wallet?.currency || 'USD')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Transaction Count</span>
                    <span className="font-semibold">{stats.transactionCount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={() => setIsPaymentDialogOpen(true)}
              className="bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-blue-600 text-white px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all rounded-full"
              disabled={isPaymentDialogOpen}
            >
              {isPaymentDialogOpen ? (
                <>
                  <Clock className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Initiate Payment
                </>
              )}
            </Button>
          </div>

          {/* Transactions table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ArrowUpRight className="h-5 w-5 mr-2" />
                Transaction History
              </CardTitle>
              <CardDescription>
                A log of all your recent transactions.
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

          <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Make a Transaction
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Recipient Selection */}
                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient *</Label>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                        disabled={loadingCandidates}
                      >
                        {selectedCandidate ? (
                          <span className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {selectedCandidate}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">
                            {loadingCandidates ? "Loading..." : "Select recipient..."}
                          </span>
                        )}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search recipients..." />
                        <CommandEmpty>No recipients found.</CommandEmpty>
                        <CommandGroup>
                          {candidates.map((candidate: { id: string | number, name: string }) => (
                            <CommandItem
                              key={candidate.id}
                              value={candidate.name}
                              onSelect={() => handleCandidateSelect(candidate)}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${selectedCandidate === candidate.name ? "opacity-100" : "opacity-0"
                                  }`}
                              />
                              <User className="mr-2 h-4 w-4" />
                              {candidate.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    max="999999999999999"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    className="text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ETB">ETB - Ethiopian Birr</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 flex flex-col">
                  <Label htmlFor="description">Description/Remarks *</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter transaction description..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsPaymentDialogOpen(false)}
                    className="flex-1"
                    disabled={processingPayment}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleProcessTransaction}
                    disabled={processingPayment || !formData.recipientId || !formData.amount || !formData.description}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500"
                  >
                    {processingPayment ? (
                      <>
                        <Clock className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Pay
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
