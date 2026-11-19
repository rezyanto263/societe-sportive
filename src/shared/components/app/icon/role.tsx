import { Role } from '@/modules/auth/types';
import { LucideProps, ShieldCheckIcon, UserRoundIcon } from 'lucide-react';

const ROLE_ICONS: Record<Role, React.ComponentType<LucideProps>> = {
  player: UserRoundIcon,
  organizer: ShieldCheckIcon,
};

type Props = LucideProps & { roleName: Role };

export default function RoleIcon({ roleName, ...props }: Props) {
  const Icon = ROLE_ICONS[roleName];

  return <Icon {...props} />;
}
