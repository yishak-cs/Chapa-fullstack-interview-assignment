import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';


export default function Page({ auth }: PageProps) {
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
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
        </div>
        <div className="aspect-video min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      </div>
    </AuthenticatedLayout>
  )
}
