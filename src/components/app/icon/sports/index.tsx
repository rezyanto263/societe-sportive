import BadmintonIcon from '@/components/app/icon/sports/badminton';
import BasketballIcon from '@/components/app/icon/sports/basketball';
import { Sport } from '@/constants/sports';
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
