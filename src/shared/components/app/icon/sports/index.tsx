import BadmintonIcon from '@/shared/components/app/icon/sports/badminton';
import BasketballIcon from '@/shared/components/app/icon/sports/basketball';
import { Sport } from '@/modules/sports/types';
import { LucideProps } from 'lucide-react';

const SPORT_ICONS: Record<Sport, React.ComponentType<LucideProps>> = {
  badminton: BadmintonIcon,
  basketball: BasketballIcon,
};

type SportIconProps = LucideProps & { sportName: Sport };

export default function SportIcon({ sportName, ...props }: SportIconProps) {
  const Icon = SPORT_ICONS[sportName];

  return <Icon {...props} />;
}
