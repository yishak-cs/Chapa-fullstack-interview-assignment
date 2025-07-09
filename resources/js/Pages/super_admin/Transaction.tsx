import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';

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

export default function TransactionPage({ auth, transaction }: Props) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <div className="max-w-xl mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <span className="font-semibold">Reference:</span> {transaction.reference_number}
              </div>
              <div>
                <span className="font-semibold">Amount:</span>{' '}
                {formatCurrency(parseFloat(transaction.amount), transaction.currency)}
              </div>
              <div>
                <span className="font-semibold">Status:</span>{' '}
                <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                  {transaction.status}
                </Badge>
              </div>
              <div>
                <span className="font-semibold">Date:</span> {formatDate(transaction.created_at)}
              </div>
              <div>
                <span className="font-semibold">Sender:</span> {transaction.sender.name} ({transaction.sender.email})
              </div>
              <div>
                <span className="font-semibold">Recipient:</span> {transaction.recipient.name} ({transaction.recipient.email})
              </div>
              <div>
                <span className="font-semibold">Description:</span> {transaction.description}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}