import CreateMemberDialog from '@/modules/members/components/create-dialog';
import RefreshButton from '@/shared/components/app/refresh-button';
import { Card } from '@/shared/components/ui/card';
import { UsersRoundIcon } from 'lucide-react';

export default function MemberListPage() {
  return (
    <div className="p-6 space-y-8">
      <Card className="p-6 flex-row justify-between max-lg:flex-col">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-green-700 font-bold uppercase">
            <UsersRoundIcon className="size-5" />
            DATA KEANGGOTAAN KOMUNITAS
          </div>
          <h1 className="inline-block text-3xl font-bold">
            Manajemen Anggota Komunitas
          </h1>
          <p className="text-muted-foreground">
            Kelola data anggota komunitas untuk memudahkan pengelolaan
            keanggotaan, pemantauan informasi anggota, dan pengelolaan
            partisipasi dalam berbagai kegiatan komunitas.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <RefreshButton />

          <CreateMemberDialog />
        </div>
      </Card>
    </div>
  );
}
