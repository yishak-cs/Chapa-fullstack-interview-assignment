import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Avatar, AvatarFallback } from '@/Components/ui/avatar';
import { Separator } from '@/Components/ui/separator';
import { ArrowRight, Calendar, CreditCard, Hash, User, FileText, CheckCircle, Clock, XCircle } from 'lucide-react';

interface Transaction {
  id: number;
  amount: string;
  currency: string;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  reference_number: string;
  created_at: string;
  sender: { id: number; name: string; email: string };
  recipient: { id: number; name: string; email: string };
}

interface Props extends PageProps {
  transaction: Transaction;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'pending':
      return <Clock className="w-4 h-4 text-yellow-500" />;
    case 'failed':
      return <XCircle className="w-4 h-4 text-red-500" />;
    default:
      return <Clock className="w-4 h-4 text-gray-500" />;
  }
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'completed':
      return 'default';
    case 'pending':
      return 'secondary';
    case 'failed':
      return 'destructive';
    default:
      return 'secondary';
  }
};

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

export default function TransactionPage({ auth, transaction }: Props) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Transaction Details</h1>
          <p className="text-gray-600">Reference: {transaction.reference_number}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-2 border-gray-100 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Transaction Amount</p>
                    <p className="text-4xl font-bold text-gray-900">
                      {formatCurrency(parseFloat(transaction.amount), transaction.currency)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-1">Status</p>
                    <Badge
                      variant={getStatusVariant(transaction.status)}
                      className="text-sm px-3 py-1 font-medium"
                    >
                      <span className="flex items-center gap-1">
                        {getStatusIcon(transaction.status)}
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </Badge>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Transaction Date: {formatDate(transaction.created_at)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Transaction Flow
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12 bg-blue-100">
                      <AvatarFallback className="bg-blue-500 text-white font-semibold">
                        {getInitials(transaction.sender.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900">{transaction.sender.name}</p>
                      <p className="text-sm text-gray-500">{transaction.sender.email}</p>
                      <p className="text-xs text-gray-400">Sender</p>
                    </div>
                  </div>

                  <div className="flex-1 flex justify-center mx-4">
                    <div className="flex items-center">
                      <div className="h-px bg-gray-300 flex-1"></div>
                      <ArrowRight className="w-6 h-6 text-gray-400 mx-2" />
                      <div className="h-px bg-gray-300 flex-1"></div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12 bg-green-100">
                      <AvatarFallback className="bg-green-500 text-white font-semibold">
                        {getInitials(transaction.recipient.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900">{transaction.recipient.name}</p>
                      <p className="text-sm text-gray-500">{transaction.recipient.email}</p>
                      <p className="text-xs text-gray-400">Recipient</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {transaction.description && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{transaction.description}</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Transaction Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Hash className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Reference Number</p>
                    <p className="text-sm text-gray-600 font-mono">{transaction.reference_number}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <CreditCard className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Transaction ID</p>
                    <p className="text-sm text-gray-600 font-mono">#{transaction.id}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Created</p>
                    <p className="text-sm text-gray-600">{formatDate(transaction.created_at)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}